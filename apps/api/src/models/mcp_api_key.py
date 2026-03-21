"""
PW-061-B | Модель API-ключей для MCP-сервера.
Ключи привязаны к пользователю (owner), имеют scope (read/write/admin)
и хранят SHA-256 хеш (не bcrypt — ключи высокоэнтропийные).
"""

import enum
import uuid
from datetime import datetime

from sqlalchemy import ForeignKey, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from src.models.base import Base, TimestampMixin, UUIDMixin


class McpKeyScope(str, enum.Enum):
    READ = "read"
    WRITE = "write"
    ADMIN = "admin"


# Иерархия scope: admin ⊃ write ⊃ read
SCOPE_HIERARCHY: dict[McpKeyScope, set[str]] = {
    McpKeyScope.READ: {"read"},
    McpKeyScope.WRITE: {"read", "write"},
    McpKeyScope.ADMIN: {"read", "write", "admin"},
}


class McpApiKey(UUIDMixin, TimestampMixin, Base):
    __tablename__ = "mcp_api_keys"

    name: Mapped[str] = mapped_column(String(200))
    key_hash: Mapped[str] = mapped_column(String(64), unique=True, index=True)
    key_prefix: Mapped[str] = mapped_column(String(12))
    user_id: Mapped[uuid.UUID] = mapped_column(
        ForeignKey("users.id", ondelete="CASCADE")
    )
    scope: Mapped[McpKeyScope] = mapped_column(
        String(10), default=McpKeyScope.READ
    )
    is_active: Mapped[bool] = mapped_column(default=True)
    last_used_at: Mapped[datetime | None] = mapped_column(default=None)
    expires_at: Mapped[datetime | None] = mapped_column(default=None)
    description: Mapped[str | None] = mapped_column(Text, default=None)

    # Relationships
    user: Mapped["User"] = relationship(  # noqa: F821
        back_populates="mcp_api_keys", lazy="joined"
    )
