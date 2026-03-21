"""
PW-061-B | Сервис MCP API-ключей: создание, проверка, отзыв.
SHA-256 для хеширования (ключи высокоэнтропийные, bcrypt не нужен).
"""

import hashlib
import secrets
import uuid
from datetime import datetime, timedelta, timezone

from sqlalchemy import select
from sqlalchemy.orm import Session

from src.models.mcp_api_key import McpApiKey, McpKeyScope
from src.models.user import User

KEY_PREFIX = "pw_mcp_"
KEY_BYTES = 20  # 40 hex chars


def _hash_key(raw_key: str) -> str:
    """SHA-256 хеш ключа."""
    return hashlib.sha256(raw_key.encode()).hexdigest()


def _generate_raw_key() -> str:
    """Генерирует ключ формата pw_mcp_{40_hex_chars}."""
    hex_part = secrets.token_hex(KEY_BYTES)
    return f"{KEY_PREFIX}{hex_part}"


# --- Create ---


def create_key(
    db: Session,
    *,
    user_id: uuid.UUID,
    name: str,
    scope: str = "read",
    expires_in_days: int | None = None,
) -> tuple[McpApiKey, str]:
    """Создаёт API-ключ. Возвращает (модель, raw_key). Raw key показывается один раз."""
    raw_key = _generate_raw_key()
    key_hash = _hash_key(raw_key)

    expires_at = None
    if expires_in_days:
        expires_at = datetime.now(timezone.utc) + timedelta(days=expires_in_days)

    api_key = McpApiKey(
        name=name,
        key_hash=key_hash,
        key_prefix=raw_key[:12],
        user_id=user_id,
        scope=McpKeyScope(scope),
        is_active=True,
        expires_at=expires_at,
    )
    db.add(api_key)
    db.flush()
    return api_key, raw_key


# --- Read ---


def list_keys(db: Session) -> list[McpApiKey]:
    """Все ключи (для admin UI)."""
    stmt = (
        select(McpApiKey)
        .order_by(McpApiKey.created_at.desc())
    )
    return list(db.scalars(stmt).all())


def get_key(db: Session, key_id: uuid.UUID) -> McpApiKey | None:
    return db.get(McpApiKey, key_id)


# --- Verify (для MCP auth) ---


def verify_key(db: Session, raw_key: str) -> tuple[McpApiKey, User] | None:
    """Проверяет raw key → возвращает (ключ, пользователь) или None.
    Обновляет last_used_at. Не коммитит."""
    key_hash = _hash_key(raw_key)
    stmt = (
        select(McpApiKey)
        .where(
            McpApiKey.key_hash == key_hash,
            McpApiKey.is_active.is_(True),
        )
    )
    api_key = db.scalars(stmt).first()
    if not api_key:
        return None

    # Проверка срока действия
    if api_key.expires_at and api_key.expires_at < datetime.now(timezone.utc):
        return None

    # Обновляем last_used_at
    api_key.last_used_at = datetime.now(timezone.utc)

    user = db.get(User, api_key.user_id)
    if not user or not user.is_active:
        return None

    return api_key, user


# --- Toggle / Delete ---


def toggle_key(db: Session, key_id: uuid.UUID) -> McpApiKey:
    """Переключает is_active (активация / деактивация)."""
    api_key = get_key(db, key_id)
    if not api_key:
        raise ValueError("Ключ не найден")
    api_key.is_active = not api_key.is_active
    return api_key


def delete_key(db: Session, key_id: uuid.UUID) -> None:
    """Полностью удаляет ключ из базы."""
    api_key = get_key(db, key_id)
    if not api_key:
        raise ValueError("Ключ не найден")
    db.delete(api_key)
