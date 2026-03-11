"""
PW-042-D | Модель аудит-лога. Фиксирует действия пользователей в админке.
Без FK на users — удаление пользователя не сломает историю аудита.
"""

import uuid
from datetime import datetime

from sqlalchemy import JSON, DateTime, String, Text, func
from sqlalchemy.orm import Mapped, mapped_column

from src.models.base import Base, UUIDMixin


class AuditLog(Base, UUIDMixin):
    __tablename__ = "audit_logs"

    timestamp: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=func.now(), server_default=func.now(), index=True
    )
    user_id: Mapped[uuid.UUID | None] = mapped_column(nullable=True)  # без FK
    action: Mapped[str] = mapped_column(String(100), index=True)  # article.published и т.д.
    resource_type: Mapped[str] = mapped_column(String(50))  # article, media_file, user
    resource_id: Mapped[uuid.UUID | None] = mapped_column(nullable=True)
    changes: Mapped[dict | None] = mapped_column(JSON, nullable=True)
    request_id: Mapped[str | None] = mapped_column(String(64), nullable=True)
    ip_address: Mapped[str | None] = mapped_column(String(45), nullable=True)
    user_agent: Mapped[str | None] = mapped_column(Text, nullable=True)
