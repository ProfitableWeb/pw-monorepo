"""
PW-038 | Транслитерация кириллицы + slugify. Гарантия уникальности slug
через суффикс -2, -3 и т.д.
"""

from slugify import slugify
from sqlalchemy import select
from sqlalchemy.orm import Session

from src.models.article import Article
from src.models.category import Category


def generate_slug(text: str) -> str:
    return slugify(text, max_length=200)


def _ensure_unique(
    db: Session, model: type, slug: str, exclude_id: object = None
) -> str:
    """Гарантирует уникальность slug для указанной модели."""
    candidate = slug
    counter = 2
    while True:
        stmt = select(model.id).where(model.slug == candidate)
        if exclude_id is not None:
            stmt = stmt.where(model.id != exclude_id)
        if not db.execute(stmt).first():
            return candidate
        candidate = f"{slug}-{counter}"
        counter += 1


def ensure_unique_slug(db: Session, slug: str, exclude_id: object = None) -> str:
    """Уникальный slug для статей."""
    return _ensure_unique(db, Article, slug, exclude_id)


def ensure_unique_category_slug(
    db: Session, slug: str, exclude_id: object = None
) -> str:
    """Уникальный slug для категорий."""
    return _ensure_unique(db, Category, slug, exclude_id)
