"""
Test fixtures.

The environment is set before `app` is imported because `get_settings` is
`lru_cache`d — reading it once and reusing it is exactly what Lambda does, so
the tests exercise the same path rather than a special-cased one.
"""

import os

import pytest

os.environ.setdefault("STORAGE", "memory")
os.environ.setdefault("ADMIN_API_KEY", "test-admin-key")
os.environ.setdefault("EMAIL_ENABLED", "false")
os.environ.setdefault("STAGE", "local")

from fastapi.testclient import TestClient  # noqa: E402

from app.db import reset_store  # noqa: E402
from app.main import app  # noqa: E402

ADMIN_KEY = "test-admin-key"


@pytest.fixture
def client():
    reset_store()
    with TestClient(app) as c:
        yield c


@pytest.fixture
def auth() -> dict[str, str]:
    return {"Authorization": f"Bearer {ADMIN_KEY}"}


@pytest.fixture
def post_payload() -> dict:
    return {
        "slug": "hello-kigali",
        "title": "Hello Kigali",
        "excerpt": "A first post.",
        "category": "News",
        "sections": [{"heading": "Intro", "body": ["Paragraph one."]}],
    }


@pytest.fixture
def application_payload() -> dict:
    return {
        "form_id": "work-abroad",
        "service": "work",
        "reference": "LWT-AB12CD",
        "name": "Aline Uwase",
        "email": "aline@example.com",
        "phone": "+250781072868",
        "destination": "Germany",
        "values": {"sector": "Healthcare & Care", "experience": "3 years"},
        "documents": [{"id": "cv", "label": "CV", "filename": "cv.pdf", "size_bytes": 12345}],
        "consents": ["I confirm the information is accurate."],
    }
