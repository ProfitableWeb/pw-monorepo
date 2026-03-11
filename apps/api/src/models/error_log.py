"""
PW-042-B | Модель лога ошибок. Хранит unhandled exceptions из middleware.
Без FK на users — удаление пользователя не сломает историю ошибок.
"""

import uuid
from datetime import datetime

from sqlalchemy import JSON, Boolean, DateTime, Integer, String, Text, func
from sqlalchemy.orm import Mapped, mapped_column

from src.models.base import Base, UUIDMixin


class ErrorLog(Base, UUIDMixin):
    __tablename__ = "error_logs"

    timestamp: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=func.now(), server_default=func.now(), index=True
    )
    level: Mapped[str] = mapped_column(String(20))  # warning | error | critical
    event: Mapped[str] = mapped_column(String(255))  # тип: unhandled_exception и т.д.
    message: Mapped[str] = mapped_column(Text)

    traceback: Mapped[str | None] = mapped_column(Text, nullable=True)
    request_method: Mapped[str | None] = mapped_column(String(10), nullable=True)
    request_path: Mapped[str | None] = mapped_column(String(2048), nullable=True)
    request_id: Mapped[str | None] = mapped_column(String(64), nullable=True)
    user_id: Mapped[uuid.UUID | None] = mapped_column(nullable=True)  # без FK
    ip_address: Mapped[str | None] = mapped_column(String(45), nullable=True)
    user_agent: Mapped[str | None] = mapped_column(Text, nullable=True)
    status_code: Mapped[int | None] = mapped_column(Integer, nullable=True)
    context: Mapped[dict | None] = mapped_column(JSON, nullable=True)
    resolved: Mapped[bool] = mapped_column(Boolean, default=False, server_default="false")
