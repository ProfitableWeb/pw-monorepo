"""
PW-027 | Две проекции статьи: ArticleResponse (полная, для страницы) и
ArticleListItem (карточка/masonry — без content). category и tags → slug/name строки.
"""

from datetime import datetime

from pydantic import BaseModel


class ArticleResponse(BaseModel):
    id: str
    title: str
    slug: str
    subtitle: str | None = None
    content: str
    excerpt: str
    summary: str | None = None
    category: str  # category slug
    tags: list[str] = []
    author: str | None = None
    reading_time: int | None = None
    views: int = 0
    layout: str = "three-column"
    image_url: str | None = None
    image_alt: str | None = None
    published_at: datetime | None = None
    updated_at: datetime | None = None

    model_config = {"from_attributes": True}


class ArticleListItem(BaseModel):
    id: str
    title: str
    slug: str
    subtitle: str | None = None
    excerpt: str
    summary: str | None = None
    category: str  # category slug
    tags: list[str] = []
    reading_time: int | None = None
    image_url: str | None = None
    image_alt: str | None = None
    published_at: datetime | None = None

    model_config = {"from_attributes": True}
