"""
PW-060 | Public endpoint for static pages (type=page).
"""

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from src.api.articles import _article_to_response
from src.core.database import get_db
from src.schemas.articles.public import ArticleResponse
from src.schemas.common import ApiResponse
from src.services.articles.queries import get_page_by_slug

router = APIRouter(prefix="/pages", tags=["pages"])


@router.get("/{slug}", response_model=ApiResponse[ArticleResponse])
def get_page(
    slug: str,
    db: Session = Depends(get_db),
) -> ApiResponse[ArticleResponse]:
    page = get_page_by_slug(db, slug)
    if not page:
        raise HTTPException(status_code=404, detail="Страница не найдена")
    return ApiResponse(success=True, data=_article_to_response(page))
