"""
PW-038 | Системные настройки редакции (синглтон).
Часовой пояс единый для всей системы — published_at в UTC,
фронтенд конвертирует для отображения.
"""

import uuid

from sqlalchemy import ForeignKey, String
from sqlalchemy.orm import Mapped, mapped_column

from src.models.base import Base, TimestampMixin, UUIDMixin


class SystemSettings(UUIDMixin, TimestampMixin, Base):
    __tablename__ = "system_settings"

    timezone: Mapped[str] = mapped_column(String(10), default="+03:00")
    updated_by: Mapped[uuid.UUID | None] = mapped_column(
        ForeignKey("users.id", ondelete="SET NULL")
    )

    def __repr__(self) -> str:
        return f"<SystemSettings tz={self.timezone}>"
