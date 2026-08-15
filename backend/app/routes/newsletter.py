"""Newsletter sign-up. Upsert keyed on email, so re-subscribing is a no-op."""

from fastapi import APIRouter, Depends, status

from ..db import Store, get_store
from ..schemas import Accepted, Subscriber, SubscriberIn, utcnow

router = APIRouter(prefix="/newsletter", tags=["newsletter"])


@router.post("", response_model=Accepted, status_code=status.HTTP_201_CREATED)
def subscribe(payload: SubscriberIn, store: Store = Depends(get_store)) -> Accepted:
    if payload.website:
        return Accepted(ok=True)

    subscriber = Subscriber(
        email=str(payload.email).lower(),
        source=payload.source,
        created_at=utcnow(),
    )
    store.put_subscriber(subscriber)
    return Accepted(ok=True, id=subscriber.email)
