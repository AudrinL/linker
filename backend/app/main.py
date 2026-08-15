"""
Application factory and the Lambda entry point.

`handler` is what API Gateway invokes; `app` is what uvicorn and the tests use.
Both are the same application, so nothing can drift between local and deployed.
"""

import logging

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from mangum import Mangum

from .config import get_settings
from .routes import admin, applications, blog, health, inquiries, newsletter

logging.basicConfig(level=logging.INFO)
log = logging.getLogger(__name__)

# 256 KB. Comfortably above the largest funnel's answers, far below anything
# that could be used to run up Lambda time on a public endpoint.
MAX_BODY_BYTES = 256 * 1024


def create_app() -> FastAPI:
    settings = get_settings()
    app = FastAPI(
        title=settings.app_name,
        version=settings.version,
        # No interactive docs in production — the admin surface is described
        # there, and there is no reason to publish a map of it.
        docs_url="/docs" if settings.stage != "prod" else None,
        redoc_url=None,
        openapi_url="/openapi.json" if settings.stage != "prod" else None,
    )

    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.cors_origin_list,
        allow_credentials=False,
        allow_methods=["GET", "POST", "PATCH", "PUT", "DELETE", "OPTIONS"],
        allow_headers=["Authorization", "Content-Type"],
    )

    @app.middleware("http")
    async def limit_body_size(request: Request, call_next):
        length = request.headers.get("content-length")
        if length and length.isdigit() and int(length) > MAX_BODY_BYTES:
            return JSONResponse({"detail": "Payload too large"}, status_code=413)
        return await call_next(request)

    for router in (health, blog, inquiries, applications, newsletter, admin):
        app.include_router(router.router)

    return app


app = create_app()
handler = Mangum(app, lifespan="off")
