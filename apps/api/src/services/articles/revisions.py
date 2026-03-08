"""
PW-038 | Сервис ревизий контента статей.
"""

import uuid

from sqlalchemy import func, select
from sqlalchemy.orm import Session

from src.models.article_revision import ArticleRevision


def create_revision(
    db: Session,
    *,
    article_id: uuid.UUID,
    content: str,
    content_format: str = "html",
    summary: str | None = None,
    author_id: uuid.UUID | None = None,
) -> ArticleRevision:
    revision = ArticleRevision(
        article_id=article_id,
        content=content,
        content_format=content_format,
        summary=summary,
        author_id=author_id,
    )
    db.add(revision)
    db.flush()
    return revision


def get_revisions(
    db: Session,
    article_id: uuid.UUID,
    *,
    page: int = 1,
    limit: int = 20,
) -> tuple[list[ArticleRevision], int]:
    count_stmt = (
        select(func.count())
        .select_from(ArticleRevision)
        .where(ArticleRevision.article_id == article_id)
    )
    total = db.execute(count_stmt).scalar() or 0

    stmt = (
        select(ArticleRevision)
        .where(ArticleRevision.article_id == article_id)
        .order_by(ArticleRevision.created_at.desc())
        .offset((page - 1) * limit)
        .limit(limit)
    )
    revisions = list(db.scalars(stmt).all())
    return revisions, total


def get_revision_by_id(db: Session, revision_id: uuid.UUID) -> ArticleRevision | None:
    return db.get(ArticleRevision, revision_id)


def get_revision_count(db: Session, article_id: uuid.UUID) -> int:
    stmt = (
        select(func.count())
        .select_from(ArticleRevision)
        .where(ArticleRevision.article_id == article_id)
    )
    return db.execute(stmt).scalar() or 0
