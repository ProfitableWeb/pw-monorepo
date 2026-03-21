"""
PW-061-B | Auth middleware для MCP-сервера.
Извлекает Authorization: Bearer <key>, верифицирует через mcp_key service,
сохраняет user + key в request.state для tools.
"""

import json
import logging

from starlette.requests import Request
from starlette.responses import Response
from starlette.types import ASGIApp, Receive, Scope, Send

from src.core.database import SessionLocal
from src.services import mcp_key as mcp_key_service

logger = logging.getLogger(__name__)


class McpAuthMiddleware:
    """ASGI middleware: проверяет API-ключ в Authorization header."""

    def __init__(self, app: ASGIApp) -> None:
        self.app = app

    async def __call__(self, scope: Scope, receive: Receive, send: Send) -> None:
        if scope["type"] != "http":
            await self.app(scope, receive, send)
            return

        request = Request(scope)

        # Пропускаем OPTIONS (CORS preflight)
        if request.method == "OPTIONS":
            await self.app(scope, receive, send)
            return

        auth_header = request.headers.get("authorization", "")
        if not auth_header.startswith("Bearer "):
            response = Response(
                content=json.dumps({
                    "jsonrpc": "2.0",
                    "error": {"code": -32001, "message": "Missing Authorization header"},
                    "id": None,
                }),
                status_code=401,
                media_type="application/json",
            )
            await response(scope, receive, send)
            return

        raw_key = auth_header[7:]  # strip "Bearer "

        db = SessionLocal()
        try:
            result = mcp_key_service.verify_key(db, raw_key)
            if result is None:
                response = Response(
                    content=json.dumps({
                        "jsonrpc": "2.0",
                        "error": {"code": -32001, "message": "Invalid or expired API key"},
                        "id": None,
                    }),
                    status_code=401,
                    media_type="application/json",
                )
                await response(scope, receive, send)
                return

            api_key, user = result
            db.commit()  # persist last_used_at update

            # Store auth info in request state
            scope.setdefault("state", {})
            scope["state"]["mcp_user"] = user
            scope["state"]["mcp_key"] = api_key

        except Exception:
            logger.exception("MCP auth error")
            response = Response(
                content=json.dumps({
                    "jsonrpc": "2.0",
                    "error": {"code": -32603, "message": "Internal auth error"},
                    "id": None,
                }),
                status_code=500,
                media_type="application/json",
            )
            await response(scope, receive, send)
            return
        finally:
            db.close()

        await self.app(scope, receive, send)
