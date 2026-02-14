"""
PW-027 | Комментарии: CommentResponse (плоский) + CommentThreadResponse (root + replies).
user_name/avatar и article_slug/title подтягиваются из связей, не хранятся отдельно.
"""

from datetime import datetime

from pydantic import BaseModel


class CommentResponse(BaseModel):
    id: str
    user_id: str
    user_name: str
    user_avatar: str | None = None
    article_id: str
    article_slug: str
    article_title: str
    content: str
    created_at: datetime
    updated_at: datetime | None = None
    parent_id: str | None = None

    model_config = {"from_attributes": True}


class CommentThreadResponse(BaseModel):
    root: CommentResponse
    replies: list[CommentResponse] = []
