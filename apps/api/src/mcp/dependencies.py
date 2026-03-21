"""
PW-061-B | Хелперы для MCP tool handlers: DB-сессия, auth, scope-проверка.
"""

import functools
import json
import logging
from typing import Any, Callable

from sqlalchemy.orm import Session

from src.core.database import SessionLocal
from src.mcp.config import TOOL_SCOPES, check_scope
from src.models.mcp_api_key import McpApiKey
from src.models.user import User
from src.services import audit_log as audit_service

logger = logging.getLogger(__name__)


def get_db() -> Session:
    """Создаёт новую DB-сессию (вызывающий должен закрыть)."""
    return SessionLocal()


def get_auth_from_ctx(ctx: Any) -> tuple[User | None, McpApiKey | None]:
    """Извлекает user и API key из MCP request context.

    Возвращает (None, None) в stdio-режиме (нет HTTP-запроса / auth middleware).
    """
    if ctx is None:
        return None, None
    try:
        request = ctx.request_context.request
        return request.state.mcp_user, request.state.mcp_key
    except (AttributeError, KeyError):
        return None, None


def require_scope(tool_name: str) -> Callable:
    """Декоратор: проверяет scope ключа перед выполнением tool.

    В stdio-режиме (нет auth данных) проверка пропускается — локальный доступ доверенный.
    """
    required = TOOL_SCOPES.get(tool_name, "admin")

    def decorator(fn: Callable) -> Callable:
        @functools.wraps(fn)
        def wrapper(*args: Any, **kwargs: Any) -> Any:
            ctx = kwargs.get("ctx")
            if ctx is not None:
                _, api_key = get_auth_from_ctx(ctx)
                if api_key is not None and not check_scope(api_key.scope, required):
                    scope_str = getattr(api_key.scope, "value", api_key.scope)
                    return json.dumps({
                        "error": f"Недостаточно прав. Требуется scope '{required}', "
                        f"ваш ключ имеет scope '{scope_str}'."
                    })

            return fn(*args, **kwargs)

        return wrapper

    return decorator


def log_mcp_action(
    db: Session,
    *,
    user: User | None,
    api_key: McpApiKey | None,
    tool_name: str,
    arguments: dict | None = None,
    resource_type: str = "mcp",
    resource_id: Any = None,
) -> None:
    """Логирует MCP tool-вызов в audit_log.

    В stdio-режиме user/api_key могут быть None — логирует без привязки к пользователю.
    """
    # Обрезаем content для аудита (не сохраняем тела статей)
    safe_args = {}
    if arguments:
        for k, v in arguments.items():
            if k == "content" and isinstance(v, str) and len(v) > 200:
                safe_args[k] = v[:200] + "..."
            else:
                safe_args[k] = v

    changes: dict[str, Any] = {"arguments": safe_args}
    if api_key is not None:
        changes["key_prefix"] = api_key.key_prefix
        changes["key_name"] = api_key.name
    else:
        changes["transport"] = "stdio"

    audit_service.log_action(
        db,
        user_id=user.id if user else None,
        action=f"mcp.{tool_name}",
        resource_type=resource_type,
        resource_id=resource_id,
        changes=changes,
    )


def get_article_by_id_or_slug(db: Session, id_or_slug: str):
    """Ищет статью по UUID или slug (без фильтра по статусу).

    В отличие от public queries.get_article_by_slug, находит черновики,
    запланированные и архивированные статьи.
    """
    import uuid

    from sqlalchemy import select

    from src.models.article import Article

    try:
        article_id = uuid.UUID(id_or_slug)
        return db.get(Article, article_id)
    except ValueError:
        stmt = select(Article).where(Article.slug == id_or_slug)
        return db.scalars(stmt).first()
