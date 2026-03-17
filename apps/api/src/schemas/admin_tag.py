"""PW-052 | Admin-схемы меток."""

from datetime import datetime

from pydantic import BaseModel, Field


class TagAdminResponse(BaseModel):
    id: str
    name: str
    slug: str
    color: str | None = None
    group: str | None = None
    article_count: int = 0
    created_at: datetime | None = None

    model_config = {"from_attributes": True}


class TagCreateRequest(BaseModel):
    name: str = Field(min_length=1, max_length=100)
    slug: str | None = None
    color: str | None = Field(None, max_length=7)
    group: str | None = Field(None, max_length=50)


class TagUpdateRequest(BaseModel):
    name: str | None = Field(None, min_length=1, max_length=100)
    slug: str | None = None
    color: str | None = Field(None, max_length=7)
    group: str | None = Field(None, max_length=50)
