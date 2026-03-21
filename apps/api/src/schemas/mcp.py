"""
PW-061-B | Pydantic-схемы для MCP API-ключей.
"""

from datetime import datetime

from pydantic import BaseModel, Field


class McpKeyCreateRequest(BaseModel):
    name: str = Field(min_length=1, max_length=200)
    scope: str = Field(default="read", pattern="^(read|write|admin)$")
    expires_in_days: int | None = Field(
        default=None, ge=1, le=3650, description="Срок действия в днях (null = бессрочный)"
    )


class McpKeyCreateResponse(BaseModel):
    """Ответ при создании — содержит raw key (показывается один раз)."""

    id: str
    name: str
    raw_key: str
    key_prefix: str
    scope: str
    is_active: bool = True
    expires_at: datetime | None = None
    created_at: datetime | None = None

    model_config = {"from_attributes": True}


class McpKeyResponse(BaseModel):
    """Ответ для списка/деталей — без raw key."""

    id: str
    name: str
    key_prefix: str
    scope: str
    is_active: bool
    last_used_at: datetime | None = None
    expires_at: datetime | None = None
    created_at: datetime | None = None
    user_name: str | None = None

    model_config = {"from_attributes": True}
