"""
PW-063 | Публичный профиль автора.
GET /api/authors/primary — основной автор сайта (первый admin).
GET /api/authors/{user_id} — профиль автора по ID.
"""

from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy import func, select
from sqlalchemy.orm import Session

from src.core.database import get_db
from src.models.article import Article, ArticleStatus, ArticleType
from src.models.user import User, UserRole
from src.schemas.common import ApiResponse


router = APIRouter(prefix="/authors", tags=["authors"])


class AuthorPublicProfile(BaseModel):
    id: str
    name: str
    job_title: str | None = None
    avatar: str | None = None
    bio: str | None = None
    email: str | None = None
    social_links: dict[str, str] | None = None
    article_count: int = 0

    model_config = {"from_attributes": True}


def _get_article_count(db: Session, user_id: object) -> int:
    stmt = (
        select(func.count())
        .select_from(Article)
        .where(
            Article.author_id == user_id,
            Article.status == ArticleStatus.PUBLISHED,
            Article.type == ArticleType.ARTICLE,
        )
    )
    return db.scalar(stmt) or 0


def _user_to_profile(user: User, db: Session) -> AuthorPublicProfile:
    return AuthorPublicProfile(
        id=str(user.id),
        name=user.name,
        job_title=user.job_title,
        avatar=user.avatar,
        bio=user.bio,
        email=user.email,
        social_links=user.social_links,
        article_count=_get_article_count(db, user.id),
    )


@router.get("/primary", response_model=ApiResponse[AuthorPublicProfile])
def get_primary_author(
    db: Session = Depends(get_db),
) -> ApiResponse[AuthorPublicProfile]:
    """Публичный профиль основного автора сайта (первый admin)."""
    stmt = (
        select(User)
        .where(User.role == UserRole.ADMIN, User.is_active.is_(True))
        .order_by(User.created_at.asc())
        .limit(1)
    )
    user = db.scalars(stmt).first()
    if not user:
        raise HTTPException(status_code=404, detail="Автор не найден")
    return ApiResponse(success=True, data=_user_to_profile(user, db))


@router.get("/{user_id}", response_model=ApiResponse[AuthorPublicProfile])
def get_author_by_id(
    user_id: UUID,
    db: Session = Depends(get_db),
) -> ApiResponse[AuthorPublicProfile]:
    """Публичный профиль автора по ID."""
    user = db.get(User, user_id)
    if not user or not user.is_active:
        raise HTTPException(status_code=404, detail="Автор не найден")
    return ApiResponse(success=True, data=_user_to_profile(user, db))
