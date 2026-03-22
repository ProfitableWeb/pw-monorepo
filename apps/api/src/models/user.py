"""
PW-030 | Модель пользователя с поддержкой password_hash и OAuth.
Роли: admin/editor/author/viewer.
"""

import enum
from datetime import datetime
from typing import TYPE_CHECKING

from sqlalchemy import Boolean, String, Text, UniqueConstraint
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.orm import Mapped, mapped_column, relationship

from src.models.base import Base, TimestampMixin, UUIDMixin

if TYPE_CHECKING:
    from src.models.article import Article
    from src.models.comment import Comment
    from src.models.mcp_api_key import McpApiKey
    from src.models.media_file import MediaFile
    from src.models.oauth_link import UserOAuthLink


class UserRole(str, enum.Enum):
    ADMIN = "admin"
    EDITOR = "editor"
    AUTHOR = "author"
    VIEWER = "viewer"


class User(UUIDMixin, TimestampMixin, Base):
    __tablename__ = "users"
    __table_args__ = (
        UniqueConstraint("oauth_provider", "oauth_id", name="uq_user_oauth"),
    )

    name: Mapped[str] = mapped_column(String(200))
    email: Mapped[str] = mapped_column(String(200), unique=True)
    avatar: Mapped[str | None] = mapped_column(String(500))
    bio: Mapped[str | None] = mapped_column(Text)
    job_title: Mapped[str | None] = mapped_column(String(200))
    social_links: Mapped[dict | None] = mapped_column(JSONB)
    role: Mapped[UserRole] = mapped_column(default=UserRole.VIEWER)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)
    last_login_at: Mapped[datetime | None] = mapped_column(default=None)

    password_hash: Mapped[str | None] = mapped_column(String(200))
    oauth_provider: Mapped[str | None] = mapped_column(String(50))
    oauth_id: Mapped[str | None] = mapped_column(String(200))

    articles: Mapped[list["Article"]] = relationship(back_populates="author")
    comments: Mapped[list["Comment"]] = relationship(back_populates="user")
    oauth_links: Mapped[list["UserOAuthLink"]] = relationship(
        back_populates="user", cascade="all, delete-orphan"
    )
    media_files: Mapped[list["MediaFile"]] = relationship(
        back_populates="uploaded_by"
    )
    mcp_api_keys: Mapped[list["McpApiKey"]] = relationship(
        back_populates="user", cascade="all, delete-orphan"
    )

    def __repr__(self) -> str:
        return f"<User {self.email}>"
