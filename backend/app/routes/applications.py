"""
Multi-step application intake.

This is the funnel behind `<MultiStepForm />` — work placements, study abroad,
visa support, flight requests. The frontend keeps generating the client-side
reference (`LWT-XXXXXX`) it already shows the applicant on the success screen;
the API stores it so staff and applicant are quoting the same number.
"""

import uuid

from fastapi import APIRouter, Depends, status

from ..db import Store, get_store
from ..email import send_notification
from ..schemas import Accepted, Application, ApplicationIn, utcnow

router = APIRouter(prefix="/applications", tags=["applications"])


@router.post("", response_model=Accepted, status_code=status.HTTP_202_ACCEPTED)
def create_application(payload: ApplicationIn, store: Store = Depends(get_store)) -> Accepted:
    if payload.website:
        return Accepted(ok=True)

    now = utcnow()
    application = Application(
        id=str(uuid.uuid4()),
        form_id=payload.form_id,
        service=payload.service,
        reference=payload.reference,
        name=payload.name,
        email=str(payload.email),
        phone=payload.phone,
        destination=payload.destination,
        values=payload.values,
        documents=payload.documents,
        consents=payload.consents,
        created_at=now,
        updated_at=now,
    )
    store.put_application(application)

    send_notification(
        subject=f"New application {application.reference} — {application.form_id}",
        heading=f"New application · {application.reference}",
        fields={
            "Reference": application.reference,
            "Form": application.form_id,
            "Name": application.name,
            "Email": application.email,
            "Phone": application.phone or "",
            "Destination": application.destination or "",
            "Documents": ", ".join(d.label for d in application.documents),
        },
    )
    return Accepted(ok=True, id=application.id)
