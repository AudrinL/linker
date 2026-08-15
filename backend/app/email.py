"""
Outbound notification mail via SES.

Sending is off unless `EMAIL_ENABLED` and a verified `EMAIL_SENDER` are both
set, so local runs and tests never touch AWS. Failures are swallowed and
logged without the body: a submission that reached storage must not 500 because
the mail relay hiccuped, and the checklist forbids logging applicant contact
details.
"""

from __future__ import annotations

import html
import logging

from .config import get_settings

log = logging.getLogger(__name__)


def _rows(fields: dict[str, str]) -> str:
    return "".join(
        f"<tr>"
        f'<td style="padding:6px 12px;color:#666;vertical-align:top">{html.escape(k)}</td>'
        f'<td style="padding:6px 12px">{html.escape(str(v))}</td>'
        f"</tr>"
        for k, v in fields.items()
        if v
    )


def send_notification(subject: str, heading: str, fields: dict[str, str]) -> bool:
    """
    Email the office inbox. Returns whether the message was handed to SES.

    Never raises — the caller has already persisted the submission.
    """
    settings = get_settings()
    if not settings.email_enabled or not settings.email_sender:
        log.info("email disabled; skipped notification %r", subject)
        return False

    body = (
        f'<div style="font-family:system-ui,sans-serif;max-width:640px">'
        f"<h2>{html.escape(heading)}</h2>"
        f'<table style="border-collapse:collapse;width:100%">{_rows(fields)}</table>'
        f'<p style="color:#888;font-size:12px">Sent by the Linker World Travel website.</p>'
        f"</div>"
    )

    try:
        import boto3

        client = boto3.client("ses", region_name=settings.aws_region)
        client.send_email(
            Source=settings.email_sender,
            Destination={"ToAddresses": [settings.email_recipient]},
            Message={
                "Subject": {"Data": subject, "Charset": "UTF-8"},
                "Body": {"Html": {"Data": body, "Charset": "UTF-8"}},
            },
        )
        return True
    except Exception as exc:  # noqa: BLE001 — notification is best-effort
        # Type only. The message can echo the recipient address back at us.
        log.warning("SES send failed: %s", type(exc).__name__)
        return False
