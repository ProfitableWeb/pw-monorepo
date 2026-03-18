"""
PW-038 | Admin CRUD логика для статей. Отдельный модуль от queries.py
(тот для публичного API, фильтрует только PUBLISHED).
"""

import uuid
from datetime import datetime, timezone
from typing import Any

from sqlalchemy import func, select
from sqlalchemy.orm import Session, joinedload, selectinload

from src.models.article import Article, ArticleStatus
from src.models.category import Category
from src.models.tag import Tag
from src.services.articles import category_filter_by_slug
from src.services.articles import revisions as revision_service
from src.services.articles.reading_time import calculate_reading_time
from src.services.slug import ensure_unique_slug, generate_slug

SORTABLE_COLUMNS = {"updated_at", "created_at", "published_at", "title", "views"}

UPDATABLE_FIELDS = {
    "title",
    "subtitle",
    "slug",
    "status",
    "published_at",
    "content",
    "content_format",
    "excerpt",
    "primary_category_id",
    "image_url",
    "image_alt",
    "layout",
    "meta_title",
    "meta_description",
    "focus_keyword",
    "seo_keywords",
    "schema_type",
    "canonical_url",
    "og_title",
    "og_description",
    "og_image",
    "robots_no_index",
    "robots_no_follow",
    "artifacts",
}


def _base_admin_query():
    return select(Article).options(
        joinedload(Article.primary_category),
        selectinload(Article.categories),
        selectinload(Article.tags),
        joinedload(Article.author),
    )


def create_article(
    db: Session,
    *,
    author_id: uuid.UUID,
    title: str,
    subtitle: str | None = None,
    slug: str | None = None,
    content: str = "",
    content_format: str = "html",
    excerpt: str = "",
    primary_category_id: uuid.UUID,
    additional_category_ids: list[uuid.UUID] | None = None,
    tags: list[str] | None = None,
    image_url: str | None = None,
    image_alt: str | None = None,
    layout: str = "three-column",
    meta_title: str | None = None,
    meta_description: str | None = None,
    focus_keyword: str | None = None,
    seo_keywords: list[str] | None = None,
    schema_type: str = "BlogPosting",
    canonical_url: str | None = None,
    og_title: str | None = None,
    og_description: str | None = None,
    og_image: str | None = None,
    robots_no_index: bool = False,
    robots_no_follow: bool = False,
    artifacts: dict | None = None,
) -> Article:
    if not slug:
        slug = generate_slug(title)
    slug = ensure_unique_slug(db, slug)

    reading_time = calculate_reading_time(content, content_format) if content else None

    article = Article(
        title=title,
        slug=slug,
        subtitle=subtitle,
        content=content,
        content_format=content_format,
        excerpt=excerpt,
        primary_category_id=primary_category_id,
        author_id=author_id,
        image_url=image_url,
        image_alt=image_alt,
        layout=layout,
        status=ArticleStatus.DRAFT,
        reading_time=reading_time,
        meta_title=meta_title,
        meta_description=meta_description,
        focus_keyword=focus_keyword,
        seo_keywords=seo_keywords,
        schema_type=schema_type,
        canonical_url=canonical_url,
        og_title=og_title,
        og_description=og_description,
        og_image=og_image,
        robots_no_index=robots_no_index,
        robots_no_follow=robots_no_follow,
        artifacts=artifacts,
    )
    db.add(article)
    db.flush()

    sync_categories(db, article, primary_category_id, additional_category_ids)

    if tags:
        sync_tags(db, article, tags)

    revision_service.create_revision(
        db,
        article_id=article.id,
        content=content,
        content_format=content_format,
        summary="Создание статьи",
        author_id=author_id,
    )

    db.commit()
    db.refresh(article)
    return article


def get_article_by_id(db: Session, article_id: uuid.UUID) -> Article | None:
    stmt = _base_admin_query().where(Article.id == article_id)
    return db.scalars(stmt).unique().first()


def get_all_articles(
    db: Session,
    *,
    page: int = 1,
    limit: int = 20,
    status: str | None = None,
    category: str | None = None,
    search: str | None = None,
    sort_by: str = "updated_at",
    order: str = "desc",
    author_id: uuid.UUID | None = None,
) -> tuple[list[Article], int]:
    stmt = _base_admin_query()
    count_stmt = select(func.count()).select_from(Article)

    if status:
        stmt = stmt.where(Article.status == status)
        count_stmt = count_stmt.where(Article.status == status)

    if category:
        cat_filter = category_filter_by_slug(category)
        stmt = stmt.where(cat_filter)
        count_stmt = count_stmt.where(cat_filter)

    if search:
        escaped = search.replace("\\", "\\\\").replace("%", "\\%").replace("_", "\\_")
        pattern = f"%{escaped}%"
        search_filter = Article.title.ilike(pattern) | Article.excerpt.ilike(pattern)
        stmt = stmt.where(search_filter)
        count_stmt = count_stmt.where(search_filter)

    if author_id:
        stmt = stmt.where(Article.author_id == author_id)
        count_stmt = count_stmt.where(Article.author_id == author_id)

    total = db.execute(count_stmt).scalar() or 0

    sort_col = (
        getattr(Article, sort_by) if sort_by in SORTABLE_COLUMNS else Article.updated_at
    )
    stmt = stmt.order_by(sort_col.asc() if order == "asc" else sort_col.desc())
    stmt = stmt.offset((page - 1) * limit).limit(limit)

    articles = list(db.scalars(stmt).unique().all())
    return articles, total


def update_article(
    db: Session,
    article: Article,
    *,
    author_id: uuid.UUID | None = None,
    **fields: Any,
) -> Article:
    content_changed = "content" in fields and fields["content"] != article.content

    tag_names = fields.pop("tags", None)
    additional_category_ids = fields.pop("additional_category_ids", None)

    new_status = fields.get("status")
    if new_status is not None:
        if new_status in ("published", ArticleStatus.PUBLISHED):
            _validate_publishable(article)
            if article.published_at is None and "published_at" not in fields:
                fields["published_at"] = datetime.now(timezone.utc)
        elif new_status in ("scheduled", ArticleStatus.SCHEDULED):
            pub_at = fields.get("published_at")
            if pub_at is None:
                raise ValueError("Для планирования необходимо указать published_at")
            if isinstance(pub_at, datetime) and pub_at <= datetime.now(timezone.utc):
                raise ValueError("Дата публикации должна быть в будущем")

    if "slug" in fields and fields["slug"] != article.slug:
        fields["slug"] = ensure_unique_slug(db, fields["slug"], exclude_id=article.id)

    for key, value in fields.items():
        if key in UPDATABLE_FIELDS:
            setattr(article, key, value)

    if content_changed:
        article.reading_time = calculate_reading_time(
            article.content, article.content_format
        )
        revision_service.create_revision(
            db,
            article_id=article.id,
            content=article.content,
            content_format=article.content_format
            if isinstance(article.content_format, str)
            else article.content_format.value,
            summary=None,
            author_id=author_id,
        )

    if not content_changed and "content" in fields:
        article.reading_time = calculate_reading_time(
            article.content, article.content_format
        )

    if tag_names is not None:
        sync_tags(db, article, tag_names)

    # Синхронизация M2M категорий (если менялись primary или additional)
    if additional_category_ids is not None or "primary_category_id" in fields:
        # Если additional не передан явно — сохраняем текущие из junction
        effective_additional = additional_category_ids
        if effective_additional is None and "primary_category_id" in fields:
            effective_additional = [
                c.id for c in article.categories
                if c.id != article.primary_category_id
            ]
        sync_categories(
            db,
            article,
            article.primary_category_id,
            effective_additional,
        )

    db.commit()
    db.refresh(article)
    return article


def delete_article(db: Session, article: Article, *, permanent: bool = False) -> None:
    if permanent:
        db.delete(article)
    else:
        article.status = ArticleStatus.ARCHIVED
    db.commit()


def publish_article(db: Session, article: Article) -> Article:
    _validate_publishable(article)
    article.status = ArticleStatus.PUBLISHED
    if article.published_at is None:
        article.published_at = datetime.now(timezone.utc)
    db.commit()
    db.refresh(article)
    return article


def schedule_article(db: Session, article: Article, published_at: datetime) -> Article:
    _validate_publishable(article)
    if published_at <= datetime.now(timezone.utc):
        raise ValueError("Дата публикации должна быть в будущем")
    article.status = ArticleStatus.SCHEDULED
    article.published_at = published_at
    db.commit()
    db.refresh(article)
    return article


def unpublish_article(db: Session, article: Article) -> Article:
    article.status = ArticleStatus.DRAFT
    db.commit()
    db.refresh(article)
    return article


def sync_categories(
    db: Session,
    article: Article,
    primary_category_id: uuid.UUID,
    additional_category_ids: list[uuid.UUID] | None = None,
) -> None:
    """Синхронизация M2M категорий (primary всегда включена в junction)."""
    all_ids = {primary_category_id}
    if additional_category_ids:
        all_ids.update(additional_category_ids)
    categories = list(
        db.scalars(select(Category).where(Category.id.in_(all_ids))).all()
    )
    article.categories = categories


def sync_tags(db: Session, article: Article, tag_names: list[str]) -> None:
    tags = []
    for name in tag_names:
        name = name.strip()
        if not name:
            continue
        tag = db.scalars(select(Tag).where(Tag.name == name)).first()
        if not tag:
            tag = Tag(name=name, slug=generate_slug(name))
            db.add(tag)
            db.flush()
        tags.append(tag)
    article.tags = tags


def _validate_publishable(article: Article) -> None:
    errors = []
    if not article.title:
        errors.append("title")
    if not article.content:
        errors.append("content")
    if not article.excerpt:
        errors.append("excerpt")
    if not article.primary_category_id:
        errors.append("primary_category_id")
    if errors:
        raise ValueError(f"Для публикации необходимы: {', '.join(errors)}")
