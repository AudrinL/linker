"""Contact-form intake."""

import uuid

from fastapi import APIRouter, Depends, status

from ..db import Store, get_store
from ..email import send_notification
from ..schemas import Accepted, Inquiry, InquiryIn, utcnow

router = APIRouter(prefix="/inquiries", tags=["inquiries"])


@router.post("", response_model=Accepted, status_code=status.HTTP_202_ACCEPTED)
def create_inquiry(payload: InquiryIn, store: Store = Depends(get_store)) -> Accepted:
    # Honeypot: answer exactly as we would a real submission so the bot has no
    # signal to tune against, but store nothing.
    if payload.website:
        return Accepted(ok=True)

    now = utcnow()
    inquiry = Inquiry(
        id=str(uuid.uuid4()),
        name=payload.name,
        email=str(payload.email),
        phone=payload.phone,
        service=payload.service,
        message=payload.message,
        source=payload.source,
        created_at=now,
        updated_at=now,
    )
    store.put_inquiry(inquiry)

    send_notification(
        subject=f"New inquiry — {inquiry.service.value}",
        heading="New website inquiry",
        fields={
            "Name": inquiry.name,
            "Email": inquiry.email,
            "Phone": inquiry.phone or "",
            "Service": inquiry.service.value,
            "Page": inquiry.source or "",
            "Message": inquiry.message,
        },
    )
    return Accepted(ok=True, id=inquiry.id)
