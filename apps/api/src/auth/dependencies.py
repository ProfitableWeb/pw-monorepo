"""
PW-030 | FastAPI dependencies для аутентификации.
Читают access_token из httpOnly cookie, верифицируют JWT, возвращают User.
"""

from fastapi import Depends, HTTPException, Request, status
from jose import JWTError
from sqlalchemy.orm import Session

from src.auth.jwt import verify_token
from src.core.database import get_db
from src.models.user import User
from src.services import user as user_service


def get_current_user(
    request: Request, db: Session = Depends(get_db)
) -> User:
    token = request.cookies.get("access_token")
    if not token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Не авторизован",
        )

    try:
        payload = verify_token(token)
    except JWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Недействительный токен",
        )

    if payload.get("type") != "access":
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Неверный тип токена",
        )

    user_id: str | None = payload.get("sub")
    if not user_id:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Недействительный токен",
        )

    user = user_service.get_by_id(db, user_id)
    if not user or not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Пользователь не найден",
        )
    return user


def get_current_admin(
    user: User = Depends(get_current_user),
) -> User:
    if user.role.value not in ("admin", "editor"):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Недостаточно прав",
        )
    return user


def get_optional_user(
    request: Request, db: Session = Depends(get_db)
) -> User | None:
    token = request.cookies.get("access_token")
    if not token:
        return None

    try:
        payload = verify_token(token)
    except JWTError:
        return None

    if payload.get("type") != "access":
        return None

    user_id: str | None = payload.get("sub")
    if not user_id:
        return None

    user = user_service.get_by_id(db, user_id)
    if not user or not user.is_active:
        return None
    return user
