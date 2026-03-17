"""PW-038 | Admin-схемы категорий. PW-051 | CRUD + reorder."""

from uuid import UUID

from pydantic import BaseModel, Field


class CategoryAdminResponse(BaseModel):
    id: str
    name: str
    slug: str
    subtitle: str | None = None
    description: str | None = None
    icon: str | None = None
    color: str | None = None
    parent_id: str | None = None
    order: int = 0
    article_count: int = 0
    is_default: bool = False

    model_config = {"from_attributes": True}


class CategoryCreateRequest(BaseModel):
    name: str = Field(min_length=1, max_length=200)
    slug: str | None = None
    subtitle: str | None = None
    description: str | None = None
    icon: str | None = None
    color: str | None = Field(None, max_length=7)
    parent_id: UUID | None = None
    order: int = 0


class CategoryUpdateRequest(BaseModel):
    name: str | None = Field(None, min_length=1, max_length=200)
    slug: str | None = None
    subtitle: str | None = None
    description: str | None = None
    icon: str | None = None
    color: str | None = Field(None, max_length=7)
    parent_id: UUID | None = None
    order: int | None = None


class CategoryOrderItem(BaseModel):
    id: UUID
    parent_id: UUID | None = None
    order: int


class CategoryReorderRequest(BaseModel):
    items: list[CategoryOrderItem]
