"""
PW-027 | Схема категории. article_count — вычисляемое поле,
заполняется в роутере через services/category.get_article_count().
"""

from pydantic import BaseModel


class CategoryResponse(BaseModel):
    id: str
    name: str
    slug: str
    subtitle: str | None = None
    description: str | None = None
    icon: str | None = None
    color: str | None = None
    article_count: int = 0

    model_config = {"from_attributes": True}
