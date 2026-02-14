"""
PW-027 | Эндпоинты статей. Маппинг mock-api → реальный API:
  getAllArticles()     → GET /api/articles?page&limit&category&search&sort_by&order
  getArticleBySlug()   → GET /api/articles/{slug}
  getArticlesByAuthor() → GET /api/articles?author={name}
"""

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from src.core.database import get_db
from src.models.article import Article
from src.schemas.article import ArticleListItem, ArticleResponse
from src.schemas.common import ApiMeta, ApiResponse
from src.services import article as article_service

router = APIRouter(prefix="/articles", tags=["articles"])


def _article_to_response(article: Article) -> ArticleResponse:
    return ArticleResponse(
        id=str(article.id),
        title=article.title,
        slug=article.slug,
        subtitle=article.subtitle,
        content=article.content,
        excerpt=article.excerpt,
        summary=article.summary,
        category=article.category.slug if article.category else "",
        tags=[t.name for t in article.tags],
        author=article.author.name if article.author else None,
        reading_time=article.reading_time,
        views=article.views,
        layout=article.layout.value if article.layout else "three-column",
        image_url=article.image_url,
        image_alt=article.image_alt,
        published_at=article.published_at,
        updated_at=article.updated_at,
    )


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


@router.get("", response_model=ApiResponse[list[ArticleListItem]])
def list_articles(
    page: int = 1,
    limit: int = 20,
    category: str | None = None,
    search: str | None = None,
    sort_by: str = "published_at",
    order: str = "desc",
    author: str | None = None,
    db: Session = Depends(get_db),
) -> ApiResponse[list[ArticleListItem]]:
    if author:
        articles, total = article_service.get_articles_by_author(
            db, author, page=page, limit=limit
        )
    else:
        articles, total = article_service.get_all_articles(
            db,
            page=page,
            limit=limit,
            category_slug=category,
            search=search,
            sort_by=sort_by,
            order=order,
        )

    data = [_article_to_list_item(a) for a in articles]
    return ApiResponse(
        success=True,
        data=data,
        meta=ApiMeta(page=page, limit=limit, total=total, has_more=(page * limit < total)),
    )


@router.get("/{slug}", response_model=ApiResponse[ArticleResponse])
def get_article(slug: str, db: Session = Depends(get_db)) -> ApiResponse[ArticleResponse]:
    article = article_service.get_article_by_slug(db, slug)
    if not article:
        raise HTTPException(status_code=404, detail="Article not found")
    return ApiResponse(success=True, data=_article_to_response(article))
