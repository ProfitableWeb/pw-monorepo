"""
PW-042-A | ASGI middleware: correlation ID, request context binding, request logging.
Биндит request_id/method/path/client_ip/user_id в structlog contextvars.
Логирует event="http.request_completed" с status_code и duration_ms.
"""

import time

import structlog
from asgi_correlation_id import correlation_id
from jose import JWTError, jwt
from starlette.middleware.base import BaseHTTPMiddleware, RequestResponseEndpoint
from starlette.requests import Request
from starlette.responses import Response

from src.core.config import settings
from src.core.logging import get_logger

logger = get_logger("middleware.logging")

# Пути, для которых не нужно логирование (health checks)
_SILENT_PATHS = frozenset({"/", "/health"})


def _extract_user_id(request: Request) -> str | None:
    """Извлекает user_id из JWT access_token cookie без обращения к БД."""
    token = request.cookies.get("access_token")
    if not token:
        return None
    try:
        payload = jwt.decode(
            token,
            settings.jwt_secret,
            algorithms=["HS256"],
            options={"verify_exp": False},
        )
        return payload.get("sub")
    except JWTError:
        return None


def _get_client_ip(request: Request) -> str:
    """Извлекает IP клиента из X-Forwarded-For (nginx) или напрямую."""
    forwarded = request.headers.get("x-forwarded-for")
    if forwarded:
        return forwarded.split(",")[0].strip()
    return request.client.host if request.client else "unknown"


class RequestLoggingMiddleware(BaseHTTPMiddleware):
    """Middleware для логирования HTTP-запросов и биндинга контекста."""

    async def dispatch(
        self, request: Request, call_next: RequestResponseEndpoint
    ) -> Response:
        request_id = correlation_id.get() or request.headers.get("x-request-id", "")
        method = request.method
        path = request.url.path
        client_ip = _get_client_ip(request)
        user_id = _extract_user_id(request)

        structlog.contextvars.clear_contextvars()
        structlog.contextvars.bind_contextvars(
            request_id=request_id,
            method=method,
            path=path,
            client_ip=client_ip,
            **({"user_id": user_id} if user_id else {}),
        )

        start = time.monotonic()
        try:
            response = await call_next(request)
        except Exception:
            duration_ms = round((time.monotonic() - start) * 1000, 1)
            logger.error(
                "http.request_failed",
                status_code=500,
                duration_ms=duration_ms,
            )
            raise

        duration_ms = round((time.monotonic() - start) * 1000, 1)

        if path not in _SILENT_PATHS:
            log_method = logger.info
            if response.status_code >= 500:
                log_method = logger.error
            elif response.status_code >= 400:
                log_method = logger.warning
            log_method(
                "http.request_completed",
                status_code=response.status_code,
                duration_ms=duration_ms,
            )

        return response
