"""
PW-038 | Admin CRUD эндпоинты для статей.
Все защищены get_current_admin (admin/editor).
"""

import uuid

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from src.auth.dependencies import get_current_admin
from src.core.database import get_db
from src.models.article import Article
from src.models.category import Category
from src.models.user import User
from src.schemas.articles.admin import (
    ArticleAdminListItem,
    ArticleAdminResponse,
    ArticleCreateRequest,
    ArticleScheduleRequest,
    ArticleUpdateRequest,
    AuthorBrief,
    CategoryBrief,
    RevisionListItem,
    RevisionResponse,
    TagBrief,
)
from src.schemas.common import ApiMeta, ApiResponse
from src.services.articles import admin as admin_service
from src.services.articles import revisions as revision_service

router = APIRouter(prefix="/articles", tags=["admin-articles"])


# --- Helpers ---


def _to_response(article: Article, revision_count: int = 0) -> ArticleAdminResponse:
    return ArticleAdminResponse(
        id=str(article.id),
        title=article.title,
        slug=article.slug,
        subtitle=article.subtitle,
        content=article.content,
        content_format=(
            article.content_format.value
            if hasattr(article.content_format, "value")
            else str(article.content_format or "html")
        ),
        excerpt=article.excerpt,
        summary=article.summary,
        status=(
            article.status.value
            if hasattr(article.status, "value")
            else str(article.status)
        ),
        layout=(
            article.layout.value
            if hasattr(article.layout, "value")
            else str(article.layout)
        ),
        image_url=article.image_url,
        image_alt=article.image_alt,
        reading_time=article.reading_time,
        views=article.views,
        published_at=article.published_at,
        created_at=article.created_at,
        updated_at=article.updated_at,
        meta_title=article.meta_title,
        meta_description=article.meta_description,
        canonical_url=article.canonical_url,
        og_title=article.og_title,
        og_description=article.og_description,
        og_image=article.og_image,
        focus_keyword=article.focus_keyword,
        seo_keywords=article.seo_keywords or [],
        schema_type=article.schema_type,
        robots_no_index=article.robots_no_index,
        robots_no_follow=article.robots_no_follow,
        category=CategoryBrief(
            id=str(article.category.id),
            name=article.category.name,
            slug=article.category.slug,
        )
        if article.category
        else CategoryBrief(id="", name="", slug=""),
        tags=[TagBrief(id=str(t.id), name=t.name, slug=t.slug) for t in article.tags],
        author=AuthorBrief(id=str(article.author.id), name=article.author.name)
        if article.author
        else None,
        artifacts=article.artifacts,
        revision_count=revision_count,
    )


def _to_list_item(article: Article) -> ArticleAdminListItem:
    return ArticleAdminListItem(
        id=str(article.id),
        title=article.title,
        slug=article.slug,
        status=(
            article.status.value
            if hasattr(article.status, "value")
            else str(article.status)
        ),
        excerpt=article.excerpt,
        category=CategoryBrief(
            id=str(article.category.id),
            name=article.category.name,
            slug=article.category.slug,
        )
        if article.category
        else CategoryBrief(id="", name="", slug=""),
        tags=[TagBrief(id=str(t.id), name=t.name, slug=t.slug) for t in article.tags],
        author=AuthorBrief(id=str(article.author.id), name=article.author.name)
        if article.author
        else None,
        image_url=article.image_url,
        reading_time=article.reading_time,
        views=article.views,
        published_at=article.published_at,
        created_at=article.created_at,
        updated_at=article.updated_at,
    )


def _parse_uuid(value: str, label: str = "UUID") -> uuid.UUID:
    try:
        return uuid.UUID(value)
    except ValueError:
        raise HTTPException(status_code=400, detail=f"Невалидный {label}")


def _validate_category(db: Session, category_id: str) -> uuid.UUID:
    uid = _parse_uuid(category_id, "UUID категории")
    if not db.get(Category, uid):
        raise HTTPException(status_code=422, detail="Категория не найдена")
    return uid


def _get_article_or_404(db: Session, article_id: str) -> Article:
    uid = _parse_uuid(article_id, "UUID статьи")
    article = admin_service.get_article_by_id(db, uid)
    if not article:
        raise HTTPException(status_code=404, detail="Статья не найдена")
    return article


def _response_with_revisions(
    db: Session, article: Article
) -> ApiResponse[ArticleAdminResponse]:
    article = admin_service.get_article_by_id(db, article.id)
    rev_count = revision_service.get_revision_count(db, article.id)
    return ApiResponse(success=True, data=_to_response(article, rev_count))


# --- Endpoints ---


@router.post("", response_model=ApiResponse[ArticleAdminResponse], status_code=201)
def create_article(
    body: ArticleCreateRequest,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_admin),
) -> ApiResponse[ArticleAdminResponse]:
    cat_id = _validate_category(db, body.category_id)
    article = admin_service.create_article(
        db,
        author_id=user.id,
        title=body.title,
        subtitle=body.subtitle,
        slug=body.slug,
        content=body.content,
        content_format=body.content_format,
        excerpt=body.excerpt,
        category_id=cat_id,
        tags=body.tags or [],
        image_url=body.image_url,
        image_alt=body.image_alt,
        layout=body.layout,
        meta_title=body.meta_title,
        meta_description=body.meta_description,
        focus_keyword=body.focus_keyword,
        seo_keywords=body.seo_keywords or [],
        schema_type=body.schema_type,
        canonical_url=body.canonical_url,
        og_title=body.og_title,
        og_description=body.og_description,
        og_image=body.og_image,
        robots_no_index=body.robots_no_index,
        robots_no_follow=body.robots_no_follow,
        artifacts=body.artifacts,
    )
    return _response_with_revisions(db, article)


@router.get("", response_model=ApiResponse[list[ArticleAdminListItem]])
def list_articles(
    page: int = Query(default=1, ge=1),
    limit: int = Query(default=20, ge=1, le=100),
    status: str | None = None,
    category: str | None = None,
    search: str | None = None,
    sort_by: str = "updated_at",
    order: str = "desc",
    author_id: str | None = None,
    db: Session = Depends(get_db),
    _user: User = Depends(get_current_admin),
) -> ApiResponse[list[ArticleAdminListItem]]:
    author_uuid = _parse_uuid(author_id, "UUID автора") if author_id else None
    articles, total = admin_service.get_all_articles(
        db,
        page=page,
        limit=limit,
        status=status,
        category=category,
        search=search,
        sort_by=sort_by,
        order=order,
        author_id=author_uuid,
    )
    data = [_to_list_item(a) for a in articles]
    return ApiResponse(
        success=True,
        data=data,
        meta=ApiMeta(
            page=page,
            limit=limit,
            total=total,
            has_more=(page * limit < total),
        ),
    )


@router.get("/{article_id}", response_model=ApiResponse[ArticleAdminResponse])
def get_article(
    article_id: str,
    db: Session = Depends(get_db),
    _user: User = Depends(get_current_admin),
) -> ApiResponse[ArticleAdminResponse]:
    article = _get_article_or_404(db, article_id)
    rev_count = revision_service.get_revision_count(db, article.id)
    return ApiResponse(success=True, data=_to_response(article, rev_count))


@router.patch("/{article_id}", response_model=ApiResponse[ArticleAdminResponse])
def update_article(
    article_id: str,
    body: ArticleUpdateRequest,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_admin),
) -> ApiResponse[ArticleAdminResponse]:
    article = _get_article_or_404(db, article_id)
    fields = body.model_dump(exclude_unset=True)
    if "category_id" in fields and fields["category_id"] is not None:
        fields["category_id"] = _validate_category(db, fields["category_id"])
    try:
        article = admin_service.update_article(db, article, author_id=user.id, **fields)
    except ValueError as e:
        raise HTTPException(status_code=422, detail=str(e))
    return _response_with_revisions(db, article)


@router.delete("/{article_id}", status_code=204)
def delete_article(
    article_id: str,
    permanent: bool = False,
    db: Session = Depends(get_db),
    _user: User = Depends(get_current_admin),
) -> None:
    article = _get_article_or_404(db, article_id)
    admin_service.delete_article(db, article, permanent=permanent)


@router.post("/{article_id}/publish", response_model=ApiResponse[ArticleAdminResponse])
def publish_article(
    article_id: str,
    db: Session = Depends(get_db),
    _user: User = Depends(get_current_admin),
) -> ApiResponse[ArticleAdminResponse]:
    article = _get_article_or_404(db, article_id)
    try:
        article = admin_service.publish_article(db, article)
    except ValueError as e:
        raise HTTPException(status_code=422, detail=str(e))
    return _response_with_revisions(db, article)


@router.post("/{article_id}/schedule", response_model=ApiResponse[ArticleAdminResponse])
def schedule_article(
    article_id: str,
    body: ArticleScheduleRequest,
    db: Session = Depends(get_db),
    _user: User = Depends(get_current_admin),
) -> ApiResponse[ArticleAdminResponse]:
    article = _get_article_or_404(db, article_id)
    try:
        article = admin_service.schedule_article(db, article, body.published_at)
    except ValueError as e:
        raise HTTPException(status_code=422, detail=str(e))
    return _response_with_revisions(db, article)


@router.post(
    "/{article_id}/unpublish", response_model=ApiResponse[ArticleAdminResponse]
)
def unpublish_article(
    article_id: str,
    db: Session = Depends(get_db),
    _user: User = Depends(get_current_admin),
) -> ApiResponse[ArticleAdminResponse]:
    article = _get_article_or_404(db, article_id)
    article = admin_service.unpublish_article(db, article)
    return _response_with_revisions(db, article)


# --- Revisions ---


@router.get(
    "/{article_id}/revisions",
    response_model=ApiResponse[list[RevisionListItem]],
)
def list_revisions(
    article_id: str,
    page: int = Query(default=1, ge=1),
    limit: int = Query(default=20, ge=1, le=100),
    db: Session = Depends(get_db),
    _user: User = Depends(get_current_admin),
) -> ApiResponse[list[RevisionListItem]]:
    article = _get_article_or_404(db, article_id)
    revisions, total = revision_service.get_revisions(
        db, article.id, page=page, limit=limit
    )
    data = [
        RevisionListItem(
            id=str(r.id),
            summary=r.summary,
            content_format=r.content_format,
            author_id=str(r.author_id) if r.author_id else None,
            created_at=r.created_at,
        )
        for r in revisions
    ]
    return ApiResponse(
        success=True,
        data=data,
        meta=ApiMeta(
            page=page, limit=limit, total=total, has_more=(page * limit < total)
        ),
    )


@router.get(
    "/{article_id}/revisions/{revision_id}",
    response_model=ApiResponse[RevisionResponse],
)
def get_revision(
    article_id: str,
    revision_id: str,
    db: Session = Depends(get_db),
    _user: User = Depends(get_current_admin),
) -> ApiResponse[RevisionResponse]:
    _get_article_or_404(db, article_id)
    rev_uid = _parse_uuid(revision_id, "UUID ревизии")
    revision = revision_service.get_revision_by_id(db, rev_uid)
    if not revision or str(revision.article_id) != article_id:
        raise HTTPException(status_code=404, detail="Ревизия не найдена")
    return ApiResponse(
        success=True,
        data=RevisionResponse(
            id=str(revision.id),
            content=revision.content,
            content_format=revision.content_format,
            summary=revision.summary,
            author_id=str(revision.author_id) if revision.author_id else None,
            created_at=revision.created_at,
        ),
    )


@router.post(
    "/{article_id}/revisions/{revision_id}/restore",
    response_model=ApiResponse[ArticleAdminResponse],
)
def restore_revision(
    article_id: str,
    revision_id: str,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_admin),
) -> ApiResponse[ArticleAdminResponse]:
    article = _get_article_or_404(db, article_id)
    rev_uid = _parse_uuid(revision_id, "UUID ревизии")
    revision = revision_service.get_revision_by_id(db, rev_uid)
    if not revision or str(revision.article_id) != article_id:
        raise HTTPException(status_code=404, detail="Ревизия не найдена")
    article = admin_service.update_article(
        db,
        article,
        author_id=user.id,
        content=revision.content,
        content_format=revision.content_format,
    )
    return _response_with_revisions(db, article)
