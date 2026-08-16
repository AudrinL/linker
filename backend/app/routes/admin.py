"""
Staff dashboard API. Everything under `/admin` requires the bearer key.

Filtering and search run in-process, on top of the store's full list. Same
reasoning as the scan in `db.py`: at this data volume a Python comprehension is
cheaper than the index it would take to avoid it, and it keeps every filter the
dashboard offers working against both store backends identically.
"""

import csv
import io
from collections import Counter
from datetime import timedelta

from fastapi import APIRouter, Depends, HTTPException, Query, Response, status

from ..db import Store, get_store
from ..schemas import (
    Application,
    BlogPost,
    BlogPostIn,
    BlogPostPatch,
    Inquiry,
    Stats,
    Status,
    StatusPatch,
    Subscriber,
    utcnow,
)
from ..security import require_admin

router = APIRouter(prefix="/admin", tags=["admin"], dependencies=[Depends(require_admin)])

# How far back the overview sparkline reaches.
TREND_DAYS = 14


def _matches(haystack: list[str | None], needle: str) -> bool:
    q = needle.lower()
    return any(q in (h or "").lower() for h in haystack)


# Characters a spreadsheet treats as the start of a formula rather than text.
# Tab and carriage return are here because Excel strips leading whitespace
# before deciding, so "\t=cmd" is still a formula.
_FORMULA_PREFIXES = ("=", "+", "-", "@", "\t", "\r")


def _csv_safe(value: str | None) -> str:
    """Neutralise a spreadsheet formula without altering how the cell reads."""
    text = str(value or "")
    return f"'{text}" if text[:1] in _FORMULA_PREFIXES else text


# ------------------------------------------------------------------- overview


@router.get("/stats", response_model=Stats)
def stats(store: Store = Depends(get_store)) -> Stats:
    applications = store.list_applications()
    inquiries = store.list_inquiries()
    posts = store.list_posts(published_only=False)

    # Both collections feed the same triage board, so the status and service
    # breakdowns count them together.
    by_service = Counter(a.service.value for a in applications)
    by_service.update(i.service.value for i in inquiries)
    by_status = Counter(a.status.value for a in applications)
    by_status.update(i.status.value for i in inquiries)

    since = utcnow() - timedelta(days=TREND_DAYS - 1)
    trend = {(since + timedelta(days=n)).date().isoformat(): 0 for n in range(TREND_DAYS)}
    for item in [*applications, *inquiries]:
        key = item.created_at.date().isoformat()
        if key in trend:
            trend[key] += 1

    return Stats(
        applications_total=len(applications),
        applications_new=sum(1 for a in applications if a.status is Status.new),
        inquiries_total=len(inquiries),
        inquiries_new=sum(1 for i in inquiries if i.status is Status.new),
        subscribers_total=len(store.list_subscribers()),
        posts_total=len(posts),
        posts_published=sum(1 for p in posts if p.published),
        by_service=dict(by_service),
        by_status=dict(by_status),
        recent_days=trend,
    )


# --------------------------------------------------------------- applications


@router.get("/applications", response_model=list[Application])
def list_applications(
    store: Store = Depends(get_store),
    status_filter: Status | None = Query(default=None, alias="status"),
    service: str | None = None,
    q: str | None = Query(default=None, max_length=100),
) -> list[Application]:
    items = store.list_applications()
    if status_filter:
        items = [a for a in items if a.status is status_filter]
    if service:
        items = [a for a in items if a.service.value == service]
    if q:
        items = [
            a
            for a in items
            if _matches([a.name, a.email, a.reference, a.destination, a.form_id], q)
        ]
    return items


@router.get("/applications/{id}", response_model=Application)
def get_application(id: str, store: Store = Depends(get_store)) -> Application:
    application = store.get_application(id)
    if application is None:
        raise HTTPException(status_code=404, detail="Application not found")
    return application


@router.patch("/applications/{id}", response_model=Application)
def patch_application(
    id: str, patch: StatusPatch, store: Store = Depends(get_store)
) -> Application:
    application = store.get_application(id)
    if application is None:
        raise HTTPException(status_code=404, detail="Application not found")
    updates = patch.model_dump(exclude_unset=True)
    return store.put_application(
        application.model_copy(update={**updates, "updated_at": utcnow()})
    )


# ------------------------------------------------------------------ inquiries


@router.get("/inquiries", response_model=list[Inquiry])
def list_inquiries(
    store: Store = Depends(get_store),
    status_filter: Status | None = Query(default=None, alias="status"),
    service: str | None = None,
    q: str | None = Query(default=None, max_length=100),
) -> list[Inquiry]:
    items = store.list_inquiries()
    if status_filter:
        items = [i for i in items if i.status is status_filter]
    if service:
        items = [i for i in items if i.service.value == service]
    if q:
        items = [i for i in items if _matches([i.name, i.email, i.message], q)]
    return items


@router.get("/inquiries/{id}", response_model=Inquiry)
def get_inquiry(id: str, store: Store = Depends(get_store)) -> Inquiry:
    inquiry = store.get_inquiry(id)
    if inquiry is None:
        raise HTTPException(status_code=404, detail="Inquiry not found")
    return inquiry


@router.patch("/inquiries/{id}", response_model=Inquiry)
def patch_inquiry(id: str, patch: StatusPatch, store: Store = Depends(get_store)) -> Inquiry:
    inquiry = store.get_inquiry(id)
    if inquiry is None:
        raise HTTPException(status_code=404, detail="Inquiry not found")
    updates = patch.model_dump(exclude_unset=True)
    return store.put_inquiry(inquiry.model_copy(update={**updates, "updated_at": utcnow()}))


# ---------------------------------------------------------------- subscribers


@router.get("/subscribers", response_model=list[Subscriber])
def list_subscribers(store: Store = Depends(get_store)) -> list[Subscriber]:
    return store.list_subscribers()


@router.get("/subscribers.csv")
def export_subscribers(store: Store = Depends(get_store)) -> Response:
    """
    Export the mailing list.

    Both columns are attacker-controlled: anyone may POST to /newsletter with
    whatever `source` they like. So the file is built with `csv.writer` rather
    than an f-string — it escapes embedded quotes, which hand-rolled quoting
    did not, and a single `"` in `source` was enough to forge extra columns.

    `_csv_safe` covers the other half: staff open this in Excel, and a cell
    beginning `=`, `+`, `-` or `@` is evaluated as a formula on open. That is
    remote code execution on a staff laptop by way of a newsletter sign-up.
    Prefixing an apostrophe makes the cell literal text; Excel hides the
    apostrophe, so the column still reads normally.
    """
    buffer = io.StringIO()
    # QUOTE_ALL so a comma inside a value can never shift the columns, and
    # \r\n because that is what RFC 4180 specifies and what Excel expects.
    writer = csv.writer(buffer, quoting=csv.QUOTE_ALL, lineterminator="\r\n")
    writer.writerow(["email", "source", "created_at"])
    for s in store.list_subscribers():
        writer.writerow(
            [_csv_safe(s.email), _csv_safe(s.source), s.created_at.isoformat()]
        )

    return Response(
        buffer.getvalue(),
        media_type="text/csv",
        headers={"Content-Disposition": 'attachment; filename="subscribers.csv"'},
    )


# ----------------------------------------------------------------------- blog


@router.get("/blog", response_model=list[BlogPost])
def list_all_posts(store: Store = Depends(get_store)) -> list[BlogPost]:
    """Drafts included — this is the CMS view."""
    return store.list_posts(published_only=False)


@router.get("/blog/{slug}", response_model=BlogPost)
def get_any_post(slug: str, store: Store = Depends(get_store)) -> BlogPost:
    post = store.get_post(slug)
    if post is None:
        raise HTTPException(status_code=404, detail="Post not found")
    return post


@router.post("/blog", response_model=BlogPost, status_code=status.HTTP_201_CREATED)
def create_post(payload: BlogPostIn, store: Store = Depends(get_store)) -> BlogPost:
    if store.get_post(payload.slug) is not None:
        raise HTTPException(status_code=409, detail="A post with that slug already exists")
    now = utcnow()
    post = BlogPost(
        **payload.model_dump(),
        created_at=now,
        updated_at=now,
    )
    # Publishing without an explicit date stamps it now, so the public list
    # never sorts a live post to the bottom on a null.
    if post.published and post.published_at is None:
        post = post.model_copy(update={"published_at": now})
    return store.put_post(post)


@router.patch("/blog/{slug}", response_model=BlogPost)
def update_post(slug: str, patch: BlogPostPatch, store: Store = Depends(get_store)) -> BlogPost:
    post = store.get_post(slug)
    if post is None:
        raise HTTPException(status_code=404, detail="Post not found")
    updates = patch.model_dump(exclude_unset=True)
    updated = post.model_copy(update={**updates, "updated_at": utcnow()})
    if updated.published and updated.published_at is None:
        updated = updated.model_copy(update={"published_at": updated.updated_at})
    return store.put_post(updated)


@router.delete("/blog/{slug}", status_code=status.HTTP_204_NO_CONTENT)
def delete_post(slug: str, store: Store = Depends(get_store)) -> Response:
    if not store.delete_post(slug):
        raise HTTPException(status_code=404, detail="Post not found")
    return Response(status_code=status.HTTP_204_NO_CONTENT)
