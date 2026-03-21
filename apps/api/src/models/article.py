"""
PW-027/PW-038 | Центральная модель контента.
ArticleLayout, ArticleStatus, ContentFormat — enum-зеркала фронтовых типов.
По умолчанию публичный API отдаёт только status=PUBLISHED (фильтр в services).
PW-038 добавил SEO-поля, артефакты (JSONB), content_format.
PW-054 | M2M категории: primary_category_id FK + article_categories junction.
"""

import enum
import uuid
from datetime import datetime
from typing import TYPE_CHECKING, Any

from sqlalchemy import Boolean, Column, ForeignKey, Integer, String, Table, Text
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.orm import Mapped, mapped_column, relationship

from src.models.base import Base, TimestampMixin, UUIDMixin
from src.models.media_file import article_media
from src.models.tag import article_tags

# PW-054: M2M связка article ↔ category (primary всегда включена)
article_categories = Table(
    "article_categories",
    Base.metadata,
    Column(
        "article_id",
        ForeignKey("articles.id", ondelete="CASCADE"),
        primary_key=True,
    ),
    Column(
        "category_id",
        ForeignKey("categories.id", ondelete="CASCADE"),
        primary_key=True,
    ),
)

if TYPE_CHECKING:
    from src.models.article_revision import ArticleRevision
    from src.models.category import Category
    from src.models.comment import Comment
    from src.models.media_file import MediaFile
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


class ArticleType(str, enum.Enum):
    ARTICLE = "article"
    PAGE = "page"


class ContentFormat(str, enum.Enum):
    HTML = "html"
    MARKDOWN = "markdown"


class Article(UUIDMixin, TimestampMixin, Base):
    __tablename__ = "articles"

    title: Mapped[str] = mapped_column(String(500))
    slug: Mapped[str] = mapped_column(String(500), unique=True, index=True)
    subtitle: Mapped[str | None] = mapped_column(String(500))
    content: Mapped[str] = mapped_column(Text, default="")
    content_format: Mapped[ContentFormat] = mapped_column(
        String(20), default=ContentFormat.HTML
    )
    excerpt: Mapped[str] = mapped_column(Text, default="")
    summary: Mapped[str | None] = mapped_column(Text)
    reading_time: Mapped[int | None] = mapped_column(Integer)
    views: Mapped[int] = mapped_column(Integer, default=0)
    type: Mapped[ArticleType] = mapped_column(String(20), default=ArticleType.ARTICLE)
    layout: Mapped[ArticleLayout] = mapped_column(default=ArticleLayout.THREE_COLUMN)
    status: Mapped[ArticleStatus] = mapped_column(default=ArticleStatus.DRAFT)
    image_url: Mapped[str | None] = mapped_column(String(500))
    image_alt: Mapped[str | None] = mapped_column(String(500))
    published_at: Mapped[datetime | None] = mapped_column()

    # SEO (PW-038)
    meta_title: Mapped[str | None] = mapped_column(String(500))
    meta_description: Mapped[str | None] = mapped_column(Text)
    canonical_url: Mapped[str | None] = mapped_column(String(500))
    og_title: Mapped[str | None] = mapped_column(String(500))
    og_description: Mapped[str | None] = mapped_column(Text)
    og_image: Mapped[str | None] = mapped_column(String(500))
    focus_keyword: Mapped[str | None] = mapped_column(String(200))
    seo_keywords: Mapped[Any | None] = mapped_column(JSONB)
    schema_type: Mapped[str | None] = mapped_column(String(50), default="BlogPosting")
    robots_no_index: Mapped[bool] = mapped_column(Boolean, default=False)
    robots_no_follow: Mapped[bool] = mapped_column(Boolean, default=False)

    # Артефакты (PW-038) — JSONB, структура см. docs/tasks/PW-038
    artifacts: Mapped[Any | None] = mapped_column(JSONB)

    # Table of Contents — JSONB, массив {id, text, level, enabled}
    toc: Mapped[Any | None] = mapped_column(JSONB)

    # PW-054: primary_category_id (обязательная, для URL/breadcrumbs/SEO)
    primary_category_id: Mapped[uuid.UUID] = mapped_column(
        ForeignKey("categories.id", ondelete="RESTRICT")
    )
    author_id: Mapped[uuid.UUID | None] = mapped_column(
        ForeignKey("users.id", ondelete="SET NULL")
    )

    primary_category: Mapped["Category"] = relationship(
        back_populates="primary_articles",
        foreign_keys=[primary_category_id],
    )
    categories: Mapped[list["Category"]] = relationship(
        secondary=article_categories,
        back_populates="articles",
    )
    author: Mapped["User | None"] = relationship(back_populates="articles")
    tags: Mapped[list["Tag"]] = relationship(secondary=article_tags)
    comments: Mapped[list["Comment"]] = relationship(
        back_populates="article", cascade="all, delete-orphan", passive_deletes=True
    )
    revisions: Mapped[list["ArticleRevision"]] = relationship(
        back_populates="article", cascade="all, delete-orphan"
    )
    media_files: Mapped[list["MediaFile"]] = relationship(
        secondary=article_media, back_populates="articles"
    )

    def __repr__(self) -> str:
        return f"<Article {self.slug}>"
