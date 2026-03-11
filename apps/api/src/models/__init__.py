"""
PW-027/PW-038/PW-041 | Центральный реэкспорт моделей. Нужен для Alembic autogenerate —
без этого импорта alembic не увидит таблицы при генерации миграций.
"""

from src.models.article import Article
from src.models.article_revision import ArticleRevision
from src.models.audit_log import AuditLog
from src.models.base import Base
from src.models.category import Category
from src.models.comment import Comment
from src.models.error_log import ErrorLog
from src.models.media_file import MediaFile, article_media
from src.models.oauth_link import UserOAuthLink
from src.models.system_settings import SystemSettings
from src.models.tag import Tag, article_tags
from src.models.user import User

__all__ = [
    "Base",
    "Category",
    "Tag",
    "article_tags",
    "User",
    "UserOAuthLink",
    "Article",
    "ArticleRevision",
    "SystemSettings",
    "Comment",
    "AuditLog",
    "ErrorLog",
    "MediaFile",
    "article_media",
]
