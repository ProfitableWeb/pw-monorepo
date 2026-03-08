"""PW-038 | Admin-схемы категорий."""

from pydantic import BaseModel


class CategoryAdminResponse(BaseModel):
    id: str
    name: str
    slug: str
    subtitle: str | None = None
    description: str | None = None
    icon: str | None = None
    color: str | None = None
    article_count: int = 0

    model_config = {"from_attributes": True}
