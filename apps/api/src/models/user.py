"""
PW-027 | Минимальная модель пользователя (для FK в статьях и комментариях).
Роли: admin/editor/author/viewer. Аутентификация НЕ реализована.
TODO PW-028: добавить password_hash, OAuth, токены для аутентификации.
"""

import enum
from typing import TYPE_CHECKING

from sqlalchemy import Boolean, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from src.models.base import Base, TimestampMixin, UUIDMixin

if TYPE_CHECKING:
    from src.models.article import Article
    from src.models.comment import Comment


class UserRole(str, enum.Enum):
    ADMIN = "admin"
    EDITOR = "editor"
    AUTHOR = "author"
    VIEWER = "viewer"


class User(UUIDMixin, TimestampMixin, Base):
    __tablename__ = "users"

    name: Mapped[str] = mapped_column(String(200))
    email: Mapped[str] = mapped_column(String(200), unique=True)
    avatar: Mapped[str | None] = mapped_column(String(500))
    role: Mapped[UserRole] = mapped_column(default=UserRole.VIEWER)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)

    articles: Mapped[list["Article"]] = relationship(back_populates="author")
    comments: Mapped[list["Comment"]] = relationship(back_populates="user")

    def __repr__(self) -> str:
        return f"<User {self.email}>"
