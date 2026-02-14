"""
PW-027 | Бизнес-логика статей. Все запросы фильтруют по PUBLISHED —
draft/archived/scheduled видны только через будущий Admin API (PW-030).
"""

from typing import Any

from sqlalchemy import func, select
from sqlalchemy.orm import Session, joinedload
from sqlalchemy.sql import Select

from src.models.article import Article, ArticleStatus
from src.models.category import Category
from src.models.user import User


def _base_published_query() -> Select[Any]:
    return (
        select(Article)
        .where(Article.status == ArticleStatus.PUBLISHED)
        .options(joinedload(Article.category), joinedload(Article.tags), joinedload(Article.author))
    )


def get_all_articles(
    db: Session,
    *,
    page: int = 1,
    limit: int = 20,
    category_slug: str | None = None,
    search: str | None = None,
    sort_by: str = "published_at",
    order: str = "desc",
) -> tuple[list[Article], int]:
    stmt = _base_published_query()

    if category_slug:
        stmt = stmt.join(Article.category).where(Category.slug == category_slug)

    if search:
        pattern = f"%{search}%"
        stmt = stmt.where(Article.title.ilike(pattern) | Article.excerpt.ilike(pattern))

    # Count total
    count_stmt = (
        select(func.count())
        .select_from(Article)
        .where(Article.status == ArticleStatus.PUBLISHED)
    )
    if category_slug:
        count_stmt = count_stmt.join(Article.category).where(Category.slug == category_slug)
    if search:
        pattern = f"%{search}%"
        count_stmt = count_stmt.where(
            Article.title.ilike(pattern) | Article.excerpt.ilike(pattern)
        )
    total = db.execute(count_stmt).scalar() or 0

    # Sort
    sort_col = getattr(Article, sort_by, Article.published_at)
    if order == "asc":
        stmt = stmt.order_by(sort_col.asc())
    else:
        stmt = stmt.order_by(sort_col.desc())

    # Paginate
    offset = (page - 1) * limit
    stmt = stmt.offset(offset).limit(limit)

    articles = list(db.scalars(stmt).unique().all())
    return articles, total


def get_article_by_slug(db: Session, slug: str) -> Article | None:
    stmt = _base_published_query().where(Article.slug == slug)
    return db.scalars(stmt).unique().first()


def get_articles_by_category(
    db: Session,
    category_slug: str,
    *,
    page: int = 1,
    limit: int = 20,
) -> tuple[list[Article], int]:
    return get_all_articles(db, page=page, limit=limit, category_slug=category_slug)


def get_articles_by_author(
    db: Session,
    author_name: str,
    *,
    page: int = 1,
    limit: int = 20,
) -> tuple[list[Article], int]:
    stmt = (
        _base_published_query()
        .join(Article.author)
        .where(User.name == author_name)
        .order_by(Article.published_at.desc())
    )

    count_stmt = (
        select(func.count())
        .select_from(Article)
        .where(Article.status == ArticleStatus.PUBLISHED)
        .join(Article.author)
        .where(User.name == author_name)
    )
    total = db.execute(count_stmt).scalar() or 0

    offset = (page - 1) * limit
    stmt = stmt.offset(offset).limit(limit)

    articles = list(db.scalars(stmt).unique().all())
    return articles, total
