"""
PW-030 | Сервис пользователей: CRUD + OAuth find-or-create.
"""

import uuid

from sqlalchemy import select
from sqlalchemy.orm import Session

from src.models.user import User, UserRole


def get_by_id(db: Session, user_id: str) -> User | None:
    stmt = select(User).where(User.id == uuid.UUID(user_id))
    return db.scalars(stmt).first()


def get_by_email(db: Session, email: str) -> User | None:
    stmt = select(User).where(User.email == email)
    return db.scalars(stmt).first()


def get_by_oauth(db: Session, provider: str, oauth_id: str) -> User | None:
    stmt = select(User).where(
        User.oauth_provider == provider, User.oauth_id == oauth_id
    )
    return db.scalars(stmt).first()


def create_user(
    db: Session,
    *,
    name: str,
    email: str,
    password_hash: str | None = None,
    oauth_provider: str | None = None,
    oauth_id: str | None = None,
    avatar: str | None = None,
    role: UserRole = UserRole.VIEWER,
) -> User:
    user = User(
        name=name,
        email=email,
        password_hash=password_hash,
        oauth_provider=oauth_provider,
        oauth_id=oauth_id,
        avatar=avatar,
        role=role,
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return user


def get_or_create_oauth_user(
    db: Session,
    *,
    provider: str,
    oauth_id: str,
    name: str,
    email: str,
    avatar: str | None = None,
) -> User:
    user = get_by_oauth(db, provider, oauth_id)
    if user:
        return user

    # Проверяем email — может уже есть аккаунт
    user = get_by_email(db, email)
    if user:
        # Привязываем OAuth к существующему аккаунту
        user.oauth_provider = provider
        user.oauth_id = oauth_id
        if avatar and not user.avatar:
            user.avatar = avatar
        db.commit()
        db.refresh(user)
        return user

    return create_user(
        db,
        name=name,
        email=email,
        oauth_provider=provider,
        oauth_id=oauth_id,
        avatar=avatar,
    )
