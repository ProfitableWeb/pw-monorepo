"""
PW-030 | Сервис комментариев. Возвращает плоский список — сборка в треды
(root + replies) выполняется в роутере через _build_threads().
"""

import uuid

from sqlalchemy import func, select
from sqlalchemy.orm import Session, joinedload

from src.models.article import Article
from src.models.comment import Comment


def get_article_comments(db: Session, article_slug: str) -> list[Comment]:
    stmt = (
        select(Comment)
        .join(Comment.article)
        .where(Article.slug == article_slug)
        .options(joinedload(Comment.user), joinedload(Comment.article))
        .order_by(Comment.created_at.asc())
    )
    return list(db.scalars(stmt).unique().all())


def get_user_comments(
    db: Session,
    user_id: str,
    *,
    query: str | None = None,
    limit: int = 20,
    offset: int = 0,
) -> tuple[list[Comment], int]:
    stmt = (
        select(Comment)
        .where(Comment.user_id == user_id)
        .options(joinedload(Comment.user), joinedload(Comment.article))
    )

    count_stmt = (
        select(func.count())
        .select_from(Comment)
        .where(Comment.user_id == user_id)
    )

    if query:
        pattern = f"%{query}%"
        stmt = stmt.join(Comment.article).where(
            Comment.content.ilike(pattern) | Article.title.ilike(pattern)
        )
        count_stmt = count_stmt.join(Comment.article).where(
            Comment.content.ilike(pattern) | Article.title.ilike(pattern)
        )

    total = db.execute(count_stmt).scalar() or 0

    stmt = stmt.order_by(Comment.created_at.desc()).offset(offset).limit(limit)
    comments = list(db.scalars(stmt).unique().all())
    return comments, total


def create_comment(
    db: Session,
    *,
    user_id: str,
    article_slug: str,
    content: str,
    parent_id: str | None = None,
) -> Comment:
    article = db.scalars(
        select(Article).where(Article.slug == article_slug)
    ).first()
    if not article:
        msg = f"Статья '{article_slug}' не найдена"
        raise ValueError(msg)

    comment = Comment(
        user_id=uuid.UUID(user_id),
        article_id=article.id,
        content=content,
        parent_id=uuid.UUID(parent_id) if parent_id else None,
    )
    db.add(comment)
    db.commit()
    db.refresh(comment, attribute_names=["user", "article"])
    return comment
