"""PW-038 | Admin-схемы тегов."""

from pydantic import BaseModel


class TagAdminResponse(BaseModel):
    id: str
    name: str
    slug: str
    article_count: int = 0

    model_config = {"from_attributes": True}


class TagCreateRequest(BaseModel):
    name: str
