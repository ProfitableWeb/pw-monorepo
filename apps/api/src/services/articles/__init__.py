"""Доменный пакет статей — общие хелперы."""

from sqlalchemy import or_, select

from src.models.article import Article, article_categories
from src.models.category import Category


def category_filter_by_slug(slug: str):
    """OR-фильтр: статьи где slug — primary ИЛИ additional категория."""
    cat_subq = select(Category.id).where(Category.slug == slug).scalar_subquery()
    return or_(
        Article.primary_category_id == cat_subq,
        Article.id.in_(
            select(article_categories.c.article_id).where(
                article_categories.c.category_id == cat_subq
            )
        ),
    )
