"""
PW-038 | Admin-схемы статей. Расширенные данные: SEO, артефакты,
category/tags как объекты (не строки), author с id.
"""

from datetime import datetime
from typing import Any, Literal

from pydantic import AwareDatetime, BaseModel

# --- Brief sub-schemas ---


class CategoryBrief(BaseModel):
    id: str
    name: str
    slug: str

    model_config = {"from_attributes": True}


class TagBrief(BaseModel):
    id: str
    name: str
    slug: str

    model_config = {"from_attributes": True}


class AuthorBrief(BaseModel):
    id: str
    name: str
    avatar: str | None = None

    model_config = {"from_attributes": True}


# --- Request schemas ---


class ArticleCreateRequest(BaseModel):
    title: str
    subtitle: str | None = None
    slug: str | None = None
    content: str = ""
    content_format: Literal["html", "markdown"] = "html"
    excerpt: str = ""
    primary_category_id: str
    additional_category_ids: list[str] = []
    tags: list[str] = []
    image_url: str | None = None
    image_alt: str | None = None
    layout: Literal["three-column", "two-column", "full-width", "one-column"] = (
        "three-column"
    )
    meta_title: str | None = None
    meta_description: str | None = None
    focus_keyword: str | None = None
    seo_keywords: list[str] = []
    schema_type: str = "BlogPosting"
    canonical_url: str | None = None
    og_title: str | None = None
    og_description: str | None = None
    og_image: str | None = None
    robots_no_index: bool = False
    robots_no_follow: bool = False
    artifacts: dict[str, Any] | None = None
    toc: list[dict[str, Any]] | None = None
    type: Literal["article", "page"] = "article"


class ArticleUpdateRequest(BaseModel):
    title: str | None = None
    subtitle: str | None = None
    slug: str | None = None
    status: Literal["draft", "published", "archived", "scheduled"] | None = None
    published_at: datetime | None = None
    content: str | None = None
    content_format: Literal["html", "markdown"] | None = None
    excerpt: str | None = None
    primary_category_id: str | None = None
    additional_category_ids: list[str] | None = None
    tags: list[str] | None = None
    image_url: str | None = None
    image_alt: str | None = None
    layout: Literal["three-column", "two-column", "full-width", "one-column"] | None = (
        None
    )
    meta_title: str | None = None
    meta_description: str | None = None
    focus_keyword: str | None = None
    seo_keywords: list[str] | None = None
    schema_type: str | None = None
    canonical_url: str | None = None
    og_title: str | None = None
    og_description: str | None = None
    og_image: str | None = None
    robots_no_index: bool | None = None
    robots_no_follow: bool | None = None
    artifacts: dict[str, Any] | None = None
    toc: list[dict[str, Any]] | None = None
    type: Literal["article", "page"] | None = None


class ArticleScheduleRequest(BaseModel):
    published_at: AwareDatetime


# --- Response schemas ---


class ArticleAdminResponse(BaseModel):
    id: str
    title: str
    slug: str
    subtitle: str | None = None
    content: str
    content_format: str
    excerpt: str
    summary: str | None = None
    type: str = "article"
    status: str
    layout: str
    image_url: str | None = None
    image_alt: str | None = None
    reading_time: int | None = None
    views: int = 0
    published_at: datetime | None = None
    created_at: datetime
    updated_at: datetime
    # SEO
    meta_title: str | None = None
    meta_description: str | None = None
    canonical_url: str | None = None
    og_title: str | None = None
    og_description: str | None = None
    og_image: str | None = None
    focus_keyword: str | None = None
    seo_keywords: list[str] = []
    schema_type: str | None = None
    robots_no_index: bool = False
    robots_no_follow: bool = False
    # Relations
    primary_category: CategoryBrief
    additional_categories: list[CategoryBrief] = []
    tags: list[TagBrief] = []
    author: AuthorBrief | None = None
    # Artifacts
    artifacts: dict[str, Any] | None = None
    # Table of Contents
    toc: list[dict[str, Any]] | None = None
    revision_count: int = 0

    model_config = {"from_attributes": True}


class ArticleAdminListItem(BaseModel):
    id: str
    title: str
    slug: str
    type: str = "article"
    status: str
    excerpt: str
    primary_category: CategoryBrief
    additional_categories: list[CategoryBrief] = []
    tags: list[TagBrief] = []
    author: AuthorBrief | None = None
    image_url: str | None = None
    reading_time: int | None = None
    views: int = 0
    published_at: datetime | None = None
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}


class RevisionResponse(BaseModel):
    id: str
    content: str
    content_format: str
    summary: str | None = None
    author_id: str | None = None
    created_at: datetime

    model_config = {"from_attributes": True}


class RevisionListItem(BaseModel):
    id: str
    summary: str | None = None
    content_format: str
    author_id: str | None = None
    created_at: datetime

    model_config = {"from_attributes": True}
