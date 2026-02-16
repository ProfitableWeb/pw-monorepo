"""
PW-034 | Таблица привязок OAuth-провайдеров к пользователям.
Позволяет одному пользователю подключить несколько OAuth-провайдеров.
"""

import uuid

from sqlalchemy import ForeignKey, String, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column, relationship

from src.models.base import Base, TimestampMixin, UUIDMixin


class UserOAuthLink(UUIDMixin, TimestampMixin, Base):
    __tablename__ = "user_oauth_links"
    __table_args__ = (
        UniqueConstraint("provider", "oauth_id", name="uq_oauth_link"),
    )

    user_id: Mapped[uuid.UUID] = mapped_column(
        ForeignKey("users.id", ondelete="CASCADE"), index=True
    )
    provider: Mapped[str] = mapped_column(String(50))
    oauth_id: Mapped[str] = mapped_column(String(200))

    user: Mapped["User"] = relationship(back_populates="oauth_links")  # type: ignore[name-defined]  # noqa: F821
