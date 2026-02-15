"""
PW-030 | JWT утилиты: создание/верификация токенов, управление httpOnly cookies.
access_token: 15min, Path=/api. refresh_token: 7d, Path=/api/auth. SameSite=Lax.
"""

from datetime import datetime, timedelta, timezone
from uuid import uuid4

from fastapi import Response
from jose import JWTError, jwt

from src.core.config import settings

ALGORITHM = "HS256"


def create_access_token(user_id: str, role: str) -> str:
    payload = {
        "sub": user_id,
        "role": role,
        "type": "access",
        "exp": datetime.now(timezone.utc)
        + timedelta(minutes=settings.jwt_access_expire_minutes),
    }
    return jwt.encode(payload, settings.jwt_secret, algorithm=ALGORITHM)


def create_refresh_token(user_id: str) -> str:
    payload = {
        "sub": user_id,
        "type": "refresh",
        "jti": str(uuid4()),
        "exp": datetime.now(timezone.utc)
        + timedelta(days=settings.jwt_refresh_expire_days),
    }
    return jwt.encode(payload, settings.jwt_secret, algorithm=ALGORITHM)


def verify_token(token: str) -> dict:
    """Декодирует и проверяет JWT. Raises JWTError при невалидном токене."""
    try:
        return jwt.decode(token, settings.jwt_secret, algorithms=[ALGORITHM])
    except JWTError:
        raise


def set_auth_cookies(
    response: Response, access_token: str, refresh_token: str
) -> None:
    response.set_cookie(
        key="access_token",
        value=access_token,
        httponly=True,
        samesite="lax",
        path="/api",
        max_age=settings.jwt_access_expire_minutes * 60,
    )
    response.set_cookie(
        key="refresh_token",
        value=refresh_token,
        httponly=True,
        samesite="lax",
        path="/api/auth",
        max_age=settings.jwt_refresh_expire_days * 86400,
    )


def clear_auth_cookies(response: Response) -> None:
    response.delete_cookie(key="access_token", path="/api")
    response.delete_cookie(key="refresh_token", path="/api/auth")
