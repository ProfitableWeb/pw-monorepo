"""
PW-034 | Pydantic-схемы для профиля пользователя.
"""

from pydantic import BaseModel, EmailStr, field_validator


class UpdateProfileRequest(BaseModel):
    name: str | None = None
    email: EmailStr | None = None
    job_title: str | None = None
    bio: str | None = None
    social_links: dict[str, str] | None = None

    @field_validator("name")
    @classmethod
    def name_not_empty(cls, v: str | None) -> str | None:
        if v is not None and len(v.strip()) == 0:
            msg = "Имя не может быть пустым"
            raise ValueError(msg)
        return v.strip() if v else v


class SetPasswordRequest(BaseModel):
    """Для OAuth-пользователей без пароля (password_hash IS NULL)."""

    new_password: str

    @field_validator("new_password")
    @classmethod
    def password_min_length(cls, v: str) -> str:
        if len(v) < 8:
            msg = "Пароль должен содержать минимум 8 символов"
            raise ValueError(msg)
        return v


class ChangePasswordRequest(BaseModel):
    """Для пользователей с установленным паролем."""

    old_password: str
    new_password: str

    @field_validator("new_password")
    @classmethod
    def password_min_length(cls, v: str) -> str:
        if len(v) < 8:
            msg = "Пароль должен содержать минимум 8 символов"
            raise ValueError(msg)
        return v


class ProfileResponse(BaseModel):
    id: str
    name: str
    email: str
    job_title: str | None = None
    avatar: str | None = None
    bio: str | None = None
    social_links: dict[str, str] | None = None
    role: str
    has_password: bool
    oauth_provider: str | None = None
    oauth_providers: list[str] = []

    model_config = {"from_attributes": True}
