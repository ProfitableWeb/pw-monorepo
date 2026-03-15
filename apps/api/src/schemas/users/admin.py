"""
PW-045 | Admin-схемы пользователей. Список, детали, обновление.
"""

from datetime import datetime

from pydantic import BaseModel, EmailStr, field_validator


class UserAdminBriefResponse(BaseModel):
    """Элемент списка пользователей."""
    id: str
    name: str
    email: str
    avatar: str | None = None
    role: str
    is_active: bool
    created_at: datetime
    last_login_at: datetime | None = None
    articles_count: int = 0

    model_config = {"from_attributes": True}


class UserAdminDetailResponse(UserAdminBriefResponse):
    """Детальная карточка пользователя."""
    oauth_providers: list[str] = []
    has_password: bool = False
    updated_at: datetime

    model_config = {"from_attributes": True}


class UserAdminUpdateRequest(BaseModel):
    """Обновление пользователя администратором."""
    name: str | None = None
    email: EmailStr | None = None
    role: str | None = None
    is_active: bool | None = None

    @field_validator("role")
    @classmethod
    def validate_role(cls, v: str | None) -> str | None:
        if v is not None and v not in ("admin", "editor", "author", "viewer"):
            msg = "Роль должна быть: admin, editor, author, viewer"
            raise ValueError(msg)
        return v


class AdminSetPasswordRequest(BaseModel):
    """Установка/сброс пароля администратором."""
    new_password: str

    @field_validator("new_password")
    @classmethod
    def validate_password(cls, v: str) -> str:
        if len(v) < 6:
            msg = "Пароль должен содержать не менее 6 символов"
            raise ValueError(msg)
        return v


class UserListStatsResponse(BaseModel):
    """Статистика для шапки списка."""
    total: int
    active: int
    inactive: int
    by_role: dict[str, int] = {}
    total_articles: int = 0
