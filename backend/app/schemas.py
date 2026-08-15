"""
Request and response models.

The blog shape deliberately mirrors `src/lib/blog.ts` on the frontend (slug,
excerpt, category, sections of headed paragraphs) so a post authored in the
admin dashboard renders through the existing page components untouched.

Applications mirror `src/lib/forms.ts`: the funnel configs differ per service,
so the answers arrive as a free-form `values` map rather than a fixed set of
columns. Validation of *which* fields are required stays in the frontend config
that generated the form; the API validates identity, size and shape.
"""

from datetime import datetime, timezone
from enum import Enum
from typing import Annotated, Any

from pydantic import BaseModel, ConfigDict, EmailStr, Field, field_validator

# Bounded strings everywhere — the checklist calls for rejecting oversized
# payloads, and an unbounded str on a public endpoint is the easiest way in.
Short = Annotated[str, Field(min_length=1, max_length=200)]
Line = Annotated[str, Field(max_length=500)]
Body = Annotated[str, Field(max_length=5000)]


def utcnow() -> datetime:
    return datetime.now(timezone.utc)


# --------------------------------------------------------------------- status


class Status(str, Enum):
    """Staff triage state, shared by inquiries and applications."""

    new = "new"
    in_review = "in_review"
    contacted = "contacted"
    approved = "approved"
    rejected = "rejected"
    archived = "archived"


class Service(str, Enum):
    """Matches the service lines on the site."""

    work = "work"
    study = "study"
    travel = "travel"
    visa = "visa"
    flights = "flights"
    employer = "employer"
    other = "other"


# ----------------------------------------------------------------------- blog


class BlogSection(BaseModel):
    heading: str | None = Field(default=None, max_length=200)
    body: list[Body] = Field(default_factory=list, max_length=50)


class BlogPostIn(BaseModel):
    slug: Annotated[str, Field(min_length=1, max_length=120, pattern=r"^[a-z0-9]+(?:-[a-z0-9]+)*$")]
    title: Short
    excerpt: Line
    category: Short = "News"
    author: Short = "Linker World Travel"
    read_time: Short = "5 min read"
    hero_image: str | None = Field(default=None, max_length=500)
    tags: list[Short] = Field(default_factory=list, max_length=12)
    sections: list[BlogSection] = Field(default_factory=list, max_length=30)
    published: bool = False
    published_at: datetime | None = None


class BlogPostPatch(BaseModel):
    """Every field optional — the dashboard sends only what changed."""

    model_config = ConfigDict(extra="forbid")

    title: Short | None = None
    excerpt: Line | None = None
    category: Short | None = None
    author: Short | None = None
    read_time: Short | None = None
    hero_image: str | None = Field(default=None, max_length=500)
    tags: list[Short] | None = None
    sections: list[BlogSection] | None = None
    published: bool | None = None


class BlogPost(BlogPostIn):
    created_at: datetime = Field(default_factory=utcnow)
    updated_at: datetime = Field(default_factory=utcnow)


class BlogList(BaseModel):
    items: list[BlogPost]
    count: int


# ------------------------------------------------------------------ inquiries


class InquiryIn(BaseModel):
    name: Short
    email: EmailStr
    phone: Line | None = None
    service: Service = Service.other
    message: Body
    # Honeypot. Real people never see this field, so anything in it is a bot
    # and the request is dropped with a 202 so the bot learns nothing.
    website: str = ""
    source: Line | None = None


class Inquiry(BaseModel):
    id: str
    name: str
    email: str
    phone: str | None = None
    service: Service
    message: str
    source: str | None = None
    status: Status = Status.new
    note: str | None = None
    created_at: datetime
    updated_at: datetime


# --------------------------------------------------------------- applications


class DocumentRef(BaseModel):
    """
    A document the applicant attached.

    v1 records the metadata only: the file itself still travels over the
    existing WhatsApp/email hand-off, because there is no upload service yet
    (BACKEND_PLAN.md non-goals). `storage_key` is the seam — when S3 presigned
    uploads land, it holds the object key and nothing else here changes.
    """

    id: Short
    label: Short
    filename: Line | None = None
    size_bytes: int | None = Field(default=None, ge=0, le=50 * 1024 * 1024)
    content_type: Line | None = None
    storage_key: Line | None = None


class ApplicationIn(BaseModel):
    form_id: Short
    service: Service = Service.other
    reference: Short
    name: Short
    email: EmailStr
    phone: Line | None = None
    destination: Line | None = None
    values: dict[str, Body] = Field(default_factory=dict)
    documents: list[DocumentRef] = Field(default_factory=list, max_length=30)
    consents: list[Line] = Field(default_factory=list, max_length=20)
    website: str = ""

    @field_validator("values")
    @classmethod
    def cap_values(cls, v: dict[str, Any]) -> dict[str, Any]:
        # A funnel is at most a few dozen answers; anything larger is abuse.
        if len(v) > 120:
            raise ValueError("too many fields")
        return v


class Application(BaseModel):
    id: str
    form_id: str
    service: Service
    reference: str
    name: str
    email: str
    phone: str | None = None
    destination: str | None = None
    values: dict[str, str]
    documents: list[DocumentRef]
    consents: list[str]
    status: Status = Status.new
    note: str | None = None
    created_at: datetime
    updated_at: datetime


# --------------------------------------------------------------- subscribers


class SubscriberIn(BaseModel):
    email: EmailStr
    source: Line | None = None
    website: str = ""


class Subscriber(BaseModel):
    email: str
    source: str | None = None
    created_at: datetime
    unsubscribed: bool = False


# ------------------------------------------------------------------- shared


class StatusPatch(BaseModel):
    model_config = ConfigDict(extra="forbid")

    status: Status | None = None
    note: Body | None = None


class Accepted(BaseModel):
    ok: bool = True
    id: str | None = None


class Stats(BaseModel):
    """Dashboard overview counters."""

    applications_total: int
    applications_new: int
    inquiries_total: int
    inquiries_new: int
    subscribers_total: int
    posts_total: int
    posts_published: int
    by_service: dict[str, int]
    by_status: dict[str, int]
    recent_days: dict[str, int]
