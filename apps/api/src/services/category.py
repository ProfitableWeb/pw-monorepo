"""
PW-027 | Сервис категорий. Прямые запросы к БД, кеш НЕ используется.
TODO PW-029: добавить Redis для частых запросов (главная, навигация).
"""

from sqlalchemy import func, select
from sqlalchemy.orm import Session

from src.models.article import Article, ArticleStatus
from src.models.category import Category


def get_all_categories(db: Session) -> list[Category]:
    stmt = select(Category).order_by(Category.name)
    return list(db.scalars(stmt).all())


def get_category_by_slug(db: Session, slug: str) -> Category | None:
    stmt = select(Category).where(Category.slug == slug)
    return db.scalars(stmt).first()


def get_article_count(db: Session, category_id: object) -> int:
    stmt = (
        select(func.count())
        .select_from(Article)
        .where(
            Article.category_id == category_id,
            Article.status == ArticleStatus.PUBLISHED,
        )
    )
    result = db.execute(stmt).scalar()
    return result or 0
