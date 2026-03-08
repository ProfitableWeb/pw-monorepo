"""PW-038 | Admin эндпоинт категорий (только чтение)."""

from fastapi import APIRouter, Depends
from sqlalchemy import func, select
from sqlalchemy.orm import Session

from src.auth.dependencies import get_current_admin
from src.core.database import get_db
from src.models.article import Article, ArticleStatus
from src.models.category import Category
from src.models.user import User
from src.schemas.admin_category import CategoryAdminResponse
from src.schemas.common import ApiResponse

router = APIRouter(prefix="/categories", tags=["admin-categories"])


@router.get("", response_model=ApiResponse[list[CategoryAdminResponse]])
def list_categories(
    db: Session = Depends(get_db),
    _user: User = Depends(get_current_admin),
) -> ApiResponse[list[CategoryAdminResponse]]:
    count_col = func.count(Article.id).label("article_count")
    stmt = (
        select(Category, count_col)
        .outerjoin(
            Article,
            (Article.category_id == Category.id)
            & (Article.status == ArticleStatus.PUBLISHED),
        )
        .group_by(Category.id)
        .order_by(Category.name)
    )
    rows = db.execute(stmt).all()
    data = [
        CategoryAdminResponse(
            id=str(c.id),
            name=c.name,
            slug=c.slug,
            subtitle=c.subtitle,
            description=c.description,
            icon=c.icon,
            color=c.color,
            article_count=count,
        )
        for c, count in rows
    ]
    return ApiResponse(success=True, data=data)
