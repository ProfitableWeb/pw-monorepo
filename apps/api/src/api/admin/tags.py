"""PW-038 | Admin эндпоинты тегов."""

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import func, select
from sqlalchemy.orm import Session

from src.auth.dependencies import get_current_admin
from src.core.database import get_db
from src.models.article import Article, ArticleStatus
from src.models.tag import Tag, article_tags
from src.models.user import User
from src.schemas.admin_tag import TagAdminResponse, TagCreateRequest
from src.schemas.common import ApiResponse
from src.services.slug import generate_slug

router = APIRouter(prefix="/tags", tags=["admin-tags"])


@router.get("", response_model=ApiResponse[list[TagAdminResponse]])
def list_tags(
    db: Session = Depends(get_db),
    _user: User = Depends(get_current_admin),
) -> ApiResponse[list[TagAdminResponse]]:
    count_col = func.count(Article.id).label("article_count")
    stmt = (
        select(Tag, count_col)
        .outerjoin(article_tags, Tag.id == article_tags.c.tag_id)
        .outerjoin(
            Article,
            (Article.id == article_tags.c.article_id)
            & (Article.status != ArticleStatus.ARCHIVED),
        )
        .group_by(Tag.id)
        .order_by(Tag.name)
    )
    rows = db.execute(stmt).all()
    data = [
        TagAdminResponse(
            id=str(tag.id),
            name=tag.name,
            slug=tag.slug,
            article_count=count,
        )
        for tag, count in rows
    ]
    return ApiResponse(success=True, data=data)


@router.post("", response_model=ApiResponse[TagAdminResponse], status_code=201)
def create_tag(
    body: TagCreateRequest,
    db: Session = Depends(get_db),
    _user: User = Depends(get_current_admin),
) -> ApiResponse[TagAdminResponse]:
    existing = db.scalars(select(Tag).where(Tag.name == body.name)).first()
    if existing:
        raise HTTPException(status_code=409, detail="Тег уже существует")

    tag = Tag(name=body.name, slug=generate_slug(body.name))
    db.add(tag)
    db.commit()
    db.refresh(tag)
    return ApiResponse(
        success=True,
        data=TagAdminResponse(
            id=str(tag.id), name=tag.name, slug=tag.slug, article_count=0
        ),
    )
