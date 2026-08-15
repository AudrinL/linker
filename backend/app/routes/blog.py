"""Public blog reads. Drafts are never served here — see routes/admin.py."""

from fastapi import APIRouter, Depends, HTTPException

from ..db import Store, get_store
from ..schemas import BlogList, BlogPost

router = APIRouter(prefix="/blog", tags=["blog"])


@router.get("", response_model=BlogList)
def list_posts(store: Store = Depends(get_store)) -> BlogList:
    items = store.list_posts(published_only=True)
    return BlogList(items=items, count=len(items))


@router.get("/{slug}", response_model=BlogPost)
def get_post(slug: str, store: Store = Depends(get_store)) -> BlogPost:
    post = store.get_post(slug)
    # A draft is a 404 to the public, not a 403 — its existence is not public.
    if post is None or not post.published:
        raise HTTPException(status_code=404, detail="Post not found")
    return post
