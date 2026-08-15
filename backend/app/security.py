"""
Admin authentication.

A single shared bearer token, per BACKEND_PLAN.md Phase 4. The comparison is
constant-time so a wrong key cannot be narrowed down by timing, and an
unconfigured key fails closed with 503 rather than accepting an empty string.
"""

import secrets

from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer

from .config import Settings, get_settings

# auto_error=False so a missing header produces our 401 with a WWW-Authenticate
# challenge rather than FastAPI's bare 403.
_scheme = HTTPBearer(auto_error=False)

_UNAUTHORIZED = HTTPException(
    status_code=status.HTTP_401_UNAUTHORIZED,
    detail="Invalid or missing admin credentials",
    headers={"WWW-Authenticate": "Bearer"},
)


def require_admin(
    credentials: HTTPAuthorizationCredentials | None = Depends(_scheme),
    settings: Settings = Depends(get_settings),
) -> None:
    if not settings.admin_api_key:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Admin access is not configured",
        )
    if credentials is None or credentials.scheme.lower() != "bearer":
        raise _UNAUTHORIZED
    if not secrets.compare_digest(credentials.credentials, settings.admin_api_key):
        raise _UNAUTHORIZED
