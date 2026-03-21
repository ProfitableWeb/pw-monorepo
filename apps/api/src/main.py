"""
PW-027/PW-042-A/PW-061-B | Точка входа FastAPI.
CORS, structured logging, request middleware. Эндпоинты через api_router (/api/*).
MCP-сервер монтируется на /mcp (Streamable HTTP transport).
"""

from collections.abc import AsyncIterator
from contextlib import asynccontextmanager

from asgi_correlation_id import CorrelationIdMiddleware
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from src.api.router import api_router
from src.core.config import settings
from src.core.logging import setup_logging
from src.mcp.server import create_mcp_asgi_app
from src.middleware.logging import RequestLoggingMiddleware

setup_logging()

# PW-061-D: создаём MCP до FastAPI, чтобы управлять lifespan session manager
_mcp_asgi_app, _mcp_server = create_mcp_asgi_app()


@asynccontextmanager
async def lifespan(app: FastAPI) -> AsyncIterator[None]:
    """Управляет жизненным циклом MCP session manager.

    FastAPI не пробрасывает lifespan в mounted raw ASGI apps,
    поэтому session_manager.run() вызываем явно.
    """
    async with _mcp_server.session_manager.run():
        yield


app = FastAPI(
    title=settings.app_name,
    description="Backend API for ProfitableWeb Research Lab",
    version="0.1.0",
    lifespan=lifespan,
)

# Middleware stack (Starlette: первый add_middleware = innermost)
# Результирующий порядок: CORS → CorrelationId → RequestLogging → handler
app.add_middleware(RequestLoggingMiddleware)
app.add_middleware(CorrelationIdMiddleware)
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.get_cors_origins(),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["x-request-id"],
)

app.include_router(api_router)

# PW-061-B: MCP-сервер (Streamable HTTP transport)
app.mount("/mcp", _mcp_asgi_app)


@app.get("/")
async def root() -> dict[str, str]:
    return {
        "message": settings.app_name,
        "version": "0.1.0",
        "status": "operational",
    }


@app.get("/health")
async def health_check() -> dict[str, str]:
    return {"status": "healthy"}
