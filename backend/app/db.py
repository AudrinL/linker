"""
Storage.

Routes talk to a `Store`, never to boto3. Two implementations exist:

* `MemoryStore` — a dict per collection. Used by `pytest` and by local `uvicorn`
  runs so the API (and the admin dashboard in front of it) can be developed
  without AWS credentials. Data dies with the process.
* `DynamoStore` — the deployed one. Table names come from settings, never
  hardcoded.

Reads use `scan` rather than a GSI query. That is a deliberate call for v1: the
collections here are in the hundreds of items, a scan of that costs a fraction
of a read unit, and it keeps the table definitions (and the SAM template) to
the minimum. Ordering is done in-process. If any collection reaches five
figures, add a GSI on `created_at` and swap the two `_all` helpers below —
nothing outside this module needs to change.
"""

from __future__ import annotations

import time
from datetime import datetime, timedelta, timezone
from typing import Any

from .config import Settings, get_settings
from .schemas import Application, BlogPost, Inquiry, Subscriber

Item = dict[str, Any]


def _ttl_epoch(days: int) -> int:
    """DynamoDB TTL wants a unix timestamp in seconds."""
    return int(time.time() + days * 86400)


def _sort_desc(items: list[Item], key: str = "created_at") -> list[Item]:
    return sorted(items, key=lambda i: str(i.get(key) or ""), reverse=True)


class Store:
    """The interface the routes depend on."""

    # ------------------------------------------------------------------ blog
    def list_posts(self, published_only: bool = True) -> list[BlogPost]:
        raise NotImplementedError

    def get_post(self, slug: str) -> BlogPost | None:
        raise NotImplementedError

    def put_post(self, post: BlogPost) -> BlogPost:
        raise NotImplementedError

    def delete_post(self, slug: str) -> bool:
        raise NotImplementedError

    # ------------------------------------------------------------- inquiries
    def put_inquiry(self, inquiry: Inquiry) -> Inquiry:
        raise NotImplementedError

    def list_inquiries(self) -> list[Inquiry]:
        raise NotImplementedError

    def get_inquiry(self, id: str) -> Inquiry | None:
        raise NotImplementedError

    # ---------------------------------------------------------- applications
    def put_application(self, application: Application) -> Application:
        raise NotImplementedError

    def list_applications(self) -> list[Application]:
        raise NotImplementedError

    def get_application(self, id: str) -> Application | None:
        raise NotImplementedError

    # ----------------------------------------------------------- subscribers
    def put_subscriber(self, subscriber: Subscriber) -> Subscriber:
        raise NotImplementedError

    def list_subscribers(self) -> list[Subscriber]:
        raise NotImplementedError


class MemoryStore(Store):
    def __init__(self) -> None:
        self.posts: dict[str, Item] = {}
        self.inquiries: dict[str, Item] = {}
        self.applications: dict[str, Item] = {}
        self.subscribers: dict[str, Item] = {}

    # ------------------------------------------------------------------ blog
    def list_posts(self, published_only: bool = True) -> list[BlogPost]:
        rows = [p for p in self.posts.values() if p["published"] or not published_only]
        return [BlogPost(**p) for p in _sort_desc(rows, "published_at")]

    def get_post(self, slug: str) -> BlogPost | None:
        row = self.posts.get(slug)
        return BlogPost(**row) if row else None

    def put_post(self, post: BlogPost) -> BlogPost:
        self.posts[post.slug] = post.model_dump(mode="json")
        return post

    def delete_post(self, slug: str) -> bool:
        return self.posts.pop(slug, None) is not None

    # ------------------------------------------------------------- inquiries
    def put_inquiry(self, inquiry: Inquiry) -> Inquiry:
        self.inquiries[inquiry.id] = inquiry.model_dump(mode="json")
        return inquiry

    def list_inquiries(self) -> list[Inquiry]:
        return [Inquiry(**i) for i in _sort_desc(list(self.inquiries.values()))]

    def get_inquiry(self, id: str) -> Inquiry | None:
        row = self.inquiries.get(id)
        return Inquiry(**row) if row else None

    # ---------------------------------------------------------- applications
    def put_application(self, application: Application) -> Application:
        self.applications[application.id] = application.model_dump(mode="json")
        return application

    def list_applications(self) -> list[Application]:
        return [Application(**a) for a in _sort_desc(list(self.applications.values()))]

    def get_application(self, id: str) -> Application | None:
        row = self.applications.get(id)
        return Application(**row) if row else None

    # ----------------------------------------------------------- subscribers
    def put_subscriber(self, subscriber: Subscriber) -> Subscriber:
        # Upsert keyed on email keeps a repeat sign-up idempotent, and keeps
        # the original created_at rather than resetting it.
        existing = self.subscribers.get(subscriber.email)
        if existing:
            subscriber = subscriber.model_copy(
                update={"created_at": datetime.fromisoformat(existing["created_at"])}
            )
        self.subscribers[subscriber.email] = subscriber.model_dump(mode="json")
        return subscriber

    def list_subscribers(self) -> list[Subscriber]:
        return [Subscriber(**s) for s in _sort_desc(list(self.subscribers.values()))]


class DynamoStore(Store):
    def __init__(self, settings: Settings) -> None:
        import boto3  # imported lazily so MemoryStore runs never need botocore

        self.settings = settings
        resource = boto3.resource("dynamodb", region_name=settings.aws_region)
        self.posts = resource.Table(settings.blog_table)
        self.inquiries = resource.Table(settings.inquiries_table)
        self.applications = resource.Table(settings.applications_table)
        self.subscribers = resource.Table(settings.subscribers_table)

    @staticmethod
    def _all(table: Any) -> list[Item]:
        items: list[Item] = []
        kwargs: dict[str, Any] = {}
        while True:
            page = table.scan(**kwargs)
            items.extend(page.get("Items", []))
            key = page.get("LastEvaluatedKey")
            if not key:
                return items
            kwargs["ExclusiveStartKey"] = key

    @staticmethod
    def _clean(item: Item) -> Item:
        """Drop storage-only attributes before a model sees the row."""
        return {k: v for k, v in item.items() if k not in {"ttl", "pk"}}

    # ------------------------------------------------------------------ blog
    def list_posts(self, published_only: bool = True) -> list[BlogPost]:
        rows = [self._clean(r) for r in self._all(self.posts)]
        rows = [r for r in rows if r.get("published") or not published_only]
        return [BlogPost(**r) for r in _sort_desc(rows, "published_at")]

    def get_post(self, slug: str) -> BlogPost | None:
        row = self.posts.get_item(Key={"slug": slug}).get("Item")
        return BlogPost(**self._clean(row)) if row else None

    def put_post(self, post: BlogPost) -> BlogPost:
        self.posts.put_item(Item=post.model_dump(mode="json"))
        return post

    def delete_post(self, slug: str) -> bool:
        result = self.posts.delete_item(Key={"slug": slug}, ReturnValues="ALL_OLD")
        return "Attributes" in result

    # ------------------------------------------------------------- inquiries
    def put_inquiry(self, inquiry: Inquiry) -> Inquiry:
        item = inquiry.model_dump(mode="json")
        item["ttl"] = _ttl_epoch(self.settings.inquiry_ttl_days)
        self.inquiries.put_item(Item=item)
        return inquiry

    def list_inquiries(self) -> list[Inquiry]:
        rows = [self._clean(r) for r in self._all(self.inquiries)]
        return [Inquiry(**r) for r in _sort_desc(rows)]

    def get_inquiry(self, id: str) -> Inquiry | None:
        row = self.inquiries.get_item(Key={"id": id}).get("Item")
        return Inquiry(**self._clean(row)) if row else None

    # ---------------------------------------------------------- applications
    def put_application(self, application: Application) -> Application:
        item = application.model_dump(mode="json")
        item["ttl"] = _ttl_epoch(self.settings.application_ttl_days)
        self.applications.put_item(Item=item)
        return application

    def list_applications(self) -> list[Application]:
        rows = [self._clean(r) for r in self._all(self.applications)]
        return [Application(**r) for r in _sort_desc(rows)]

    def get_application(self, id: str) -> Application | None:
        row = self.applications.get_item(Key={"id": id}).get("Item")
        return Application(**self._clean(row)) if row else None

    # ----------------------------------------------------------- subscribers
    def put_subscriber(self, subscriber: Subscriber) -> Subscriber:
        existing = self.subscribers.get_item(Key={"email": subscriber.email}).get("Item")
        if existing and existing.get("created_at"):
            subscriber = subscriber.model_copy(
                update={"created_at": datetime.fromisoformat(existing["created_at"])}
            )
        item = subscriber.model_dump(mode="json")
        item["ttl"] = _ttl_epoch(self.settings.subscriber_ttl_days)
        self.subscribers.put_item(Item=item)
        return subscriber

    def list_subscribers(self) -> list[Subscriber]:
        rows = [self._clean(r) for r in self._all(self.subscribers)]
        return [Subscriber(**r) for r in _sort_desc(rows)]


_store: Store | None = None


def get_store() -> Store:
    """FastAPI dependency. One store per process — Lambda reuses it warm."""
    global _store
    if _store is None:
        settings = get_settings()
        _store = DynamoStore(settings) if settings.storage == "dynamodb" else MemoryStore()
    return _store


def reset_store(store: Store | None = None) -> Store:
    """Test seam — swap in a clean store between cases."""
    global _store
    _store = store or MemoryStore()
    return _store


def days_ago(n: int) -> datetime:
    return datetime.now(timezone.utc) - timedelta(days=n)
