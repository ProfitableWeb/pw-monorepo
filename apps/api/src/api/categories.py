"""
PW-027 | Эндпоинты категорий + вложенный /categories/{slug}/articles.
article_count вычисляется на лету через отдельный COUNT-запрос.
"""

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from src.core.database import get_db
from src.models.article import Article
from src.models.category import Category
from src.schemas.articles.public import ArticleListItem
from src.schemas.category import CategoryResponse
from src.schemas.common import ApiMeta, ApiResponse
from src.services import category as category_service
from src.services.articles import queries as article_service

router = APIRouter(prefix="/categories", tags=["categories"])


def _category_to_response(cat: Category, article_count: int = 0) -> CategoryResponse:
    return CategoryResponse(
        id=str(cat.id),
        name=cat.name,
        slug=cat.slug,
        subtitle=cat.subtitle,
        description=cat.description,
        icon=cat.icon,
        color=cat.color,
        parent_id=str(cat.parent_id) if cat.parent_id else None,
        order=cat.order,
        article_count=article_count,
        is_default=cat.is_default,
    )


@router.get("", response_model=ApiResponse[list[CategoryResponse]])
def list_categories(
    db: Session = Depends(get_db),
) -> ApiResponse[list[CategoryResponse]]:
    rows = category_service.get_all_categories_with_counts(db)
    data = [_category_to_response(c, count) for c, count in rows]
    return ApiResponse(success=True, data=data)


@router.get("/{slug}", response_model=ApiResponse[CategoryResponse])
def get_category(
    slug: str, db: Session = Depends(get_db)
) -> ApiResponse[CategoryResponse]:
    cat = category_service.get_category_by_slug(db, slug)
    if not cat:
        raise HTTPException(status_code=404, detail="Category not found")
    count = category_service.get_article_count(db, cat.id)
    return ApiResponse(success=True, data=_category_to_response(cat, count))


def _article_to_list_item(article: Article) -> ArticleListItem:
    return ArticleListItem(
        id=str(article.id),
        title=article.title,
        slug=article.slug,
        subtitle=article.subtitle,
        excerpt=article.excerpt,
        summary=article.summary,
        category=article.primary_category.slug if article.primary_category else "",
        categories=[c.slug for c in article.categories],
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
        meta=ApiMeta(
            page=page, limit=limit, total=total, has_more=(page * limit < total)
        ),
    )
