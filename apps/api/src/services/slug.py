"""
PW-038 | Транслитерация кириллицы + slugify. Гарантия уникальности slug
через суффикс -2, -3 и т.д.
"""

from slugify import slugify
from sqlalchemy import select
from sqlalchemy.orm import Session

from src.models.article import Article


def generate_slug(text: str) -> str:
    return slugify(text, max_length=200)


def ensure_unique_slug(db: Session, slug: str, exclude_id: object = None) -> str:
    candidate = slug
    counter = 2
    while True:
        stmt = select(Article.id).where(Article.slug == candidate)
        if exclude_id is not None:
            stmt = stmt.where(Article.id != exclude_id)
        exists = db.execute(stmt).first()
        if not exists:
            return candidate
        candidate = f"{slug}-{counter}"
        counter += 1
