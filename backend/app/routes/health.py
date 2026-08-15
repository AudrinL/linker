"""Liveness probe. Public, cheap, and it touches no storage on purpose."""

from fastapi import APIRouter, Depends

from ..config import Settings, get_settings

router = APIRouter(tags=["health"])


@router.get("/health")
def health(settings: Settings = Depends(get_settings)) -> dict[str, str]:
    return {"status": "ok", "version": settings.version, "stage": settings.stage}
