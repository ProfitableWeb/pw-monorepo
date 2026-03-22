"""
PW-030 | Pydantic-схемы для аутентификации.
"""

from pydantic import BaseModel, EmailStr


class RegisterRequest(BaseModel):
    email: EmailStr
    password: str
    name: str


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class AuthUserResponse(BaseModel):
    id: str
    name: str
    email: str
    avatar: str | None = None
    role: str
    bio: str | None = None
    social_links: dict[str, str] | None = None

    model_config = {"from_attributes": True}


class OAuthUrlResponse(BaseModel):
    url: str


class TelegramAuthRequest(BaseModel):
    id: int
    first_name: str
    username: str | None = None
    photo_url: str | None = None
    auth_date: int
    hash: str
