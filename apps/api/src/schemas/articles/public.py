"""
PW-027 | Две проекции статьи: ArticleResponse (полная, для страницы) и
ArticleListItem (карточка/masonry — без content). category и tags → slug/name строки.
"""

from datetime import datetime
from typing import Any

from pydantic import BaseModel


class AuthorProfile(BaseModel):
    id: str
    name: str
    avatar: str | None = None
    bio: str | None = None
    social_links: dict[str, str] | None = None

    model_config = {"from_attributes": True}


class ArticleResponse(BaseModel):
    id: str
    title: str
    slug: str
    subtitle: str | None = None
    content: str
    excerpt: str
    summary: str | None = None
    category: str  # primary category slug (backward compat)
    categories: list[str] = []  # все категории (primary + additional)
    tags: list[str] = []
    author: AuthorProfile | None = None
    reading_time: int | None = None
    views: int = 0
    layout: str = "three-column"
    image_url: str | None = None
    image_alt: str | None = None
    published_at: datetime | None = None
    updated_at: datetime | None = None
    toc: Any | None = None
    artifacts: Any | None = None

    model_config = {"from_attributes": True}


class ArticleListItem(BaseModel):
    id: str
    title: str
    slug: str
    subtitle: str | None = None
    excerpt: str
    summary: str | None = None
    category: str  # primary category slug (backward compat)
    categories: list[str] = []  # все категории (primary + additional)
    tags: list[str] = []
    reading_time: int | None = None
    image_url: str | None = None
    image_alt: str | None = None
    published_at: datetime | None = None

    model_config = {"from_attributes": True}
