"""
PW-030 | Сервис пользователей: CRUD + OAuth find-or-create.
"""

import uuid
from datetime import datetime, timezone

from sqlalchemy import func, select
from sqlalchemy.orm import Session, selectinload

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
    bio: str | None = ...,
    social_links: dict[str, str] | None = ...,
) -> User:
    if name is not None:
        user.name = name
    if email is not None:
        existing = get_by_email(db, email)
        if existing and existing.id != user.id:
            msg = "Пользователь с таким email уже существует"
            raise ValueError(msg)
        user.email = email
    if bio is not ...:
        user.bio = bio
    if social_links is not ...:
        user.social_links = social_links
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


# -----------------------------------------------------------------------
# Admin: управление пользователями
# -----------------------------------------------------------------------


def update_last_login(db: Session, user: User) -> None:
    """Обновить время последнего входа."""
    user.last_login_at = datetime.now(timezone.utc)
    db.commit()


def list_users(
    db: Session,
    *,
    page: int = 1,
    limit: int = 20,
    search: str | None = None,
    role: str | None = None,
    is_active: bool | None = None,
    sort: str = "created_at",
    order: str = "desc",
) -> tuple[list[User], int]:
    """Список пользователей с фильтрацией и пагинацией."""
    stmt = select(User).options(selectinload(User.articles))

    if search:
        pattern = f"%{search}%"
        stmt = stmt.where(
            User.name.ilike(pattern) | User.email.ilike(pattern)
        )
    if role:
        roles = [r.strip() for r in role.split(",")]
        stmt = stmt.where(User.role.in_(roles))
    if is_active is not None:
        stmt = stmt.where(User.is_active.is_(is_active))

    # Count
    count_stmt = select(func.count()).select_from(stmt.subquery())
    total = db.scalar(count_stmt) or 0

    # Sort
    allowed_sorts = {"created_at", "name", "email", "last_login_at", "role"}
    sort_col = getattr(User, sort) if sort in allowed_sorts else User.created_at
    stmt = stmt.order_by(sort_col.desc() if order == "desc" else sort_col.asc())

    # Paginate
    stmt = stmt.offset((page - 1) * limit).limit(limit)

    return list(db.scalars(stmt).all()), total


def get_user_stats(db: Session) -> dict:
    """Статистика пользователей: total, active, inactive, by_role, total_articles."""
    from src.models.article import Article

    total = db.scalar(select(func.count(User.id))) or 0
    active = db.scalar(select(func.count(User.id)).where(User.is_active.is_(True))) or 0
    inactive = total - active

    role_rows = db.execute(
        select(User.role, func.count(User.id)).group_by(User.role)
    ).all()
    by_role = {str(r[0].value if hasattr(r[0], 'value') else r[0]): r[1] for r in role_rows}

    total_articles = db.scalar(select(func.count(Article.id))) or 0

    return {
        "total": total,
        "active": active,
        "inactive": inactive,
        "by_role": by_role,
        "total_articles": total_articles,
    }


def update_user_admin(
    db: Session,
    user: User,
    *,
    name: str | None = None,
    email: str | None = None,
    role: str | None = None,
    is_active: bool | None = None,
) -> User:
    """Обновление пользователя администратором (включая роль)."""
    if name is not None:
        user.name = name
    if email is not None:
        existing = get_by_email(db, email)
        if existing and existing.id != user.id:
            msg = "Пользователь с таким email уже существует"
            raise ValueError(msg)
        user.email = email
    if role is not None:
        user.role = UserRole(role)
    if is_active is not None:
        user.is_active = is_active
    db.commit()
    db.refresh(user)
    return user
