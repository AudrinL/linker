"""
Settings, read from the environment.

Nothing here has a production-safe default on purpose: table names, the CORS
allow-list and the admin key must be supplied by the deployment (Lambda env
vars / SAM parameters). The defaults that do exist are local-development ones,
and `storage="memory"` is the flag that keeps `uvicorn` and `pytest` running
without any AWS credentials at all.
"""

from functools import lru_cache
from typing import Literal

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    app_name: str = "Linker World Travel API"
    version: str = "0.1.0"
    stage: Literal["local", "dev", "prod"] = "local"

    # ---------------------------------------------------------------- storage
    # "memory" is an in-process dict store for local dev and tests. "dynamodb"
    # is the real thing. The routes never learn which one they are talking to.
    storage: Literal["memory", "dynamodb"] = "memory"
    aws_region: str = "us-east-1"
    blog_table: str = "lwt_blog_posts"
    inquiries_table: str = "lwt_inquiries"
    applications_table: str = "lwt_applications"
    subscribers_table: str = "lwt_subscribers"

    # How long submissions live before DynamoDB's TTL sweeps them, per the plan.
    inquiry_ttl_days: int = 30
    application_ttl_days: int = 365
    subscriber_ttl_days: int = 180

    # ------------------------------------------------------------------- auth
    # Empty means "no key configured" and every /admin route returns 503 rather
    # than silently accepting an empty bearer token.
    admin_api_key: str = ""

    # ------------------------------------------------------------------ email
    # SES is off unless a verified sender is configured, so local runs do not
    # need credentials and tests do not send mail.
    email_enabled: bool = False
    email_sender: str = ""
    email_recipient: str = "info@linkerworldtravel.com"

    # ------------------------------------------------------------------- CORS
    # Comma-separated exact origins. Never "*" — see the safety checklist.
    cors_origins: str = "http://localhost:3000"

    @property
    def cors_origin_list(self) -> list[str]:
        return [o.strip() for o in self.cors_origins.split(",") if o.strip()]


@lru_cache
def get_settings() -> Settings:
    return Settings()
