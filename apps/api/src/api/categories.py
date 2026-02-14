"""
PW-027 | Эндпоинты категорий + вложенный /categories/{slug}/articles.
article_count вычисляется на лету через отдельный COUNT-запрос.
"""

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from src.core.database import get_db
from src.models.article import Article
from src.models.category import Category
from src.schemas.article import ArticleListItem
from src.schemas.category import CategoryResponse
from src.schemas.common import ApiMeta, ApiResponse
from src.services import article as article_service
from src.services import category as category_service

router = APIRouter(prefix="/categories", tags=["categories"])


def _category_to_response(db: Session, cat: Category) -> CategoryResponse:
    count = category_service.get_article_count(db, cat.id)
    return CategoryResponse(
        id=str(cat.id),
        name=cat.name,
        slug=cat.slug,
        subtitle=cat.subtitle,
        description=cat.description,
        icon=cat.icon,
        color=cat.color,
        article_count=count,
    )


@router.get("", response_model=ApiResponse[list[CategoryResponse]])
def list_categories(db: Session = Depends(get_db)) -> ApiResponse[list[CategoryResponse]]:
    categories = category_service.get_all_categories(db)
    data = [_category_to_response(db, c) for c in categories]
    return ApiResponse(success=True, data=data)


@router.get("/{slug}", response_model=ApiResponse[CategoryResponse])
def get_category(slug: str, db: Session = Depends(get_db)) -> ApiResponse[CategoryResponse]:
    cat = category_service.get_category_by_slug(db, slug)
    if not cat:
        raise HTTPException(status_code=404, detail="Category not found")
    return ApiResponse(success=True, data=_category_to_response(db, cat))


def _article_to_list_item(article: Article) -> ArticleListItem:
    return ArticleListItem(
        id=str(article.id),
        title=article.title,
        slug=article.slug,
        subtitle=article.subtitle,
        excerpt=article.excerpt,
        summary=article.summary,
        category=article.category.slug if article.category else "",
        tags=[t.name for t in article.tags],
        reading_time=article.reading_time,
        image_url=article.image_url,
        image_alt=article.image_alt,
        published_at=article.published_at,
    )


@router.get(
    "/{slug}/articles",
    response_model=ApiResponse[list[ArticleListItem]],
)
def list_category_articles(
    slug: str,
    page: int = 1,
    limit: int = 20,
    db: Session = Depends(get_db),
) -> ApiResponse[list[ArticleListItem]]:
    cat = category_service.get_category_by_slug(db, slug)
    if not cat:
        raise HTTPException(status_code=404, detail="Category not found")

    articles, total = article_service.get_articles_by_category(
        db, slug, page=page, limit=limit
    )
    data = [_article_to_list_item(a) for a in articles]
    return ApiResponse(
        success=True,
        data=data,
        meta=ApiMeta(page=page, limit=limit, total=total, has_more=(page * limit < total)),
    )
