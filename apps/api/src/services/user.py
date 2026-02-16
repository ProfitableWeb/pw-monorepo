"""
PW-030 | Сервис пользователей: CRUD + OAuth find-or-create.
"""

import uuid

from sqlalchemy import select
from sqlalchemy.orm import Session

from src.models.oauth_link import UserOAuthLink
from src.models.user import User, UserRole


def get_by_id(db: Session, user_id: str) -> User | None:
    stmt = select(User).where(User.id == uuid.UUID(user_id))
    return db.scalars(stmt).first()


def get_by_email(db: Session, email: str) -> User | None:
    stmt = select(User).where(User.email == email)
    return db.scalars(stmt).first()


def get_by_oauth(db: Session, provider: str, oauth_id: str) -> User | None:
    """Найти пользователя по OAuth-привязке (через user_oauth_links)."""
    stmt = (
        select(User)
        .join(UserOAuthLink, UserOAuthLink.user_id == User.id)
        .where(UserOAuthLink.provider == provider, UserOAuthLink.oauth_id == oauth_id)
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
    db.flush()

    # Создаём запись в user_oauth_links
    if oauth_provider and oauth_id:
        link = UserOAuthLink(
            user_id=user.id, provider=oauth_provider, oauth_id=oauth_id
        )
        db.add(link)

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
        # Создаём запись в user_oauth_links
        link = UserOAuthLink(
            user_id=user.id, provider=provider, oauth_id=oauth_id
        )
        db.add(link)
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


# -----------------------------------------------------------------------
# OAuth-привязки (мультипровайдер)
# -----------------------------------------------------------------------


def get_oauth_providers(db: Session, user: User) -> list[str]:
    """Получить список привязанных OAuth-провайдеров."""
    stmt = (
        select(UserOAuthLink.provider)
        .where(UserOAuthLink.user_id == user.id)
    )
    return list(db.scalars(stmt).all())


def link_oauth(
    db: Session,
    user: User,
    provider: str,
    oauth_id: str,
) -> None:
    """Привязать OAuth-провайдер к пользователю."""
    # Проверяем, не привязан ли уже этот провайдер к другому пользователю
    existing = get_by_oauth(db, provider, oauth_id)
    if existing and existing.id != user.id:
        msg = "Этот аккаунт уже привязан к другому пользователю"
        raise ValueError(msg)
    if existing and existing.id == user.id:
        return  # Уже привязан

    link = UserOAuthLink(
        user_id=user.id, provider=provider, oauth_id=oauth_id
    )
    db.add(link)
    db.commit()


def unlink_oauth(db: Session, user: User, provider: str) -> None:
    """Отвязать OAuth-провайдер от пользователя."""
    providers = get_oauth_providers(db, user)
    if provider not in providers:
        msg = f"Провайдер {provider} не привязан"
        raise ValueError(msg)

    # Нельзя отвязать единственный способ входа
    has_password = user.password_hash is not None
    if not has_password and len(providers) <= 1:
        msg = "Невозможно отвязать единственный способ входа"
        raise ValueError(msg)

    stmt = select(UserOAuthLink).where(
        UserOAuthLink.user_id == user.id,
        UserOAuthLink.provider == provider,
    )
    link = db.scalars(stmt).first()
    if link:
        db.delete(link)
        db.commit()


# -----------------------------------------------------------------------
# Профиль
# -----------------------------------------------------------------------


def update_profile(
    db: Session,
    user: User,
    *,
    name: str | None = None,
    email: str | None = None,
) -> User:
    if name is not None:
        user.name = name
    if email is not None:
        existing = get_by_email(db, email)
        if existing and existing.id != user.id:
            msg = "Пользователь с таким email уже существует"
            raise ValueError(msg)
        user.email = email
    db.commit()
    db.refresh(user)
    return user


def update_avatar(db: Session, user: User, avatar_url: str | None) -> User:
    user.avatar = avatar_url
    db.commit()
    db.refresh(user)
    return user


def set_password(db: Session, user: User, password_hash: str) -> User:
    user.password_hash = password_hash
    db.commit()
    db.refresh(user)
    return user
