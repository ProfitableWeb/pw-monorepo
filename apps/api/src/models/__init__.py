"""
PW-027 | Центральный реэкспорт моделей. Нужен для Alembic autogenerate —
без этого импорта alembic не увидит таблицы при генерации миграций.
"""

from src.models.article import Article
from src.models.base import Base
from src.models.category import Category
from src.models.comment import Comment
from src.models.tag import Tag, article_tags
from src.models.user import User

__all__ = [
    "Base",
    "Category",
    "Tag",
    "article_tags",
    "User",
    "Article",
    "Comment",
]
