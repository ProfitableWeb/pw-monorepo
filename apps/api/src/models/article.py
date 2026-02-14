"""
PW-027 | Центральная модель контента. Соответствует packages/types Article.
ArticleLayout и ArticleStatus — enum-зеркала фронтовых типов.
По умолчанию API отдаёт только status=PUBLISHED (фильтр в services).
"""

import enum
import uuid
from datetime import datetime
from typing import TYPE_CHECKING

from sqlalchemy import ForeignKey, Integer, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from src.models.base import Base, TimestampMixin, UUIDMixin
from src.models.tag import article_tags

if TYPE_CHECKING:
    from src.models.category import Category
    from src.models.comment import Comment
    from src.models.tag import Tag
    from src.models.user import User


class ArticleLayout(str, enum.Enum):
    THREE_COLUMN = "three-column"
    TWO_COLUMN = "two-column"
    FULL_WIDTH = "full-width"
    ONE_COLUMN = "one-column"


class ArticleStatus(str, enum.Enum):
    DRAFT = "draft"
    PUBLISHED = "published"
    ARCHIVED = "archived"
    SCHEDULED = "scheduled"


class Article(UUIDMixin, TimestampMixin, Base):
    __tablename__ = "articles"

    title: Mapped[str] = mapped_column(String(500))
    slug: Mapped[str] = mapped_column(String(500), unique=True, index=True)
    subtitle: Mapped[str | None] = mapped_column(String(500))
    content: Mapped[str] = mapped_column(Text, default="")
    excerpt: Mapped[str] = mapped_column(Text, default="")
    summary: Mapped[str | None] = mapped_column(Text)
    reading_time: Mapped[int | None] = mapped_column(Integer)
    views: Mapped[int] = mapped_column(Integer, default=0)
    layout: Mapped[ArticleLayout] = mapped_column(
        default=ArticleLayout.THREE_COLUMN
    )
    status: Mapped[ArticleStatus] = mapped_column(
        default=ArticleStatus.DRAFT
    )
    image_url: Mapped[str | None] = mapped_column(String(500))
    image_alt: Mapped[str | None] = mapped_column(String(500))
    published_at: Mapped[datetime | None] = mapped_column()

    category_id: Mapped[uuid.UUID] = mapped_column(
        ForeignKey("categories.id", ondelete="CASCADE")
    )
    author_id: Mapped[uuid.UUID | None] = mapped_column(
        ForeignKey("users.id", ondelete="SET NULL")
    )

    category: Mapped["Category"] = relationship(back_populates="articles")
    author: Mapped["User | None"] = relationship(back_populates="articles")
    tags: Mapped[list["Tag"]] = relationship(secondary=article_tags)
    comments: Mapped[list["Comment"]] = relationship(back_populates="article")

    def __repr__(self) -> str:
        return f"<Article {self.slug}>"
