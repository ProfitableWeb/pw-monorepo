"""
PW-041 | Pydantic-схемы для медиа-библиотеки.
Response/Update, без Create (upload через multipart).
"""

from datetime import datetime
from typing import Any

from pydantic import BaseModel


class MediaFileResponse(BaseModel):
    id: str
    filename: str
    storage_key: str
    mime_type: str
    file_type: str
    size: int
    width: int | None = None
    height: int | None = None
    slug: str
    alt: str | None = None
    caption: str | None = None
    exif_data: dict[str, Any] | None = None
    purposes: list[str] = []
    resizes: list[dict[str, Any]] | None = None
    url: str  # computed: storage.url(storage_key)
    thumbnail_url: str | None = None  # computed: первый ресайз _thumb
    uploaded_by_id: str | None = None
    used_in: int = 0  # computed: len(articles)
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}


class MediaFileUpdate(BaseModel):
    slug: str | None = None
    alt: str | None = None
    caption: str | None = None
    purposes: list[str] | None = None


class MediaStatsResponse(BaseModel):
    total_count: int
    total_size: int
    by_type: dict[str, int]
    all_purposes: list[str]
