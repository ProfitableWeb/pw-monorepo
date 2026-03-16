"""
PW-038/PW-047 | Системные настройки редакции (синглтон).
Часовой пояс единый для всей системы — published_at в UTC,
фронтенд конвертирует для отображения.
PW-047: SEO-настройки — sitemap, robots.txt, RSS, мета-директивы, Метрика.
"""

import uuid

from sqlalchemy import ForeignKey, String, Text
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.orm import Mapped, mapped_column

from src.models.base import Base, TimestampMixin, UUIDMixin

# Дефолтные значения SEO-настроек
DEFAULT_SITEMAP_CONFIG: dict = {
    "enabled": True,
    "include_articles": True,
    "include_categories": True,
    "include_tags": False,
    "include_static_pages": True,
    "priorities": {
        "home": 1.0,
        "articles": 0.8,
        "categories": 0.6,
        "tags": 0.4,
        "static_pages": 0.5,
    },
    "changefreq": {
        "home": "daily",
        "articles": "weekly",
        "categories": "weekly",
        "tags": "monthly",
        "static_pages": "monthly",
    },
}

DEFAULT_ROBOTS_TXT = """User-agent: *
Allow: /
Disallow: /admin/
Disallow: /api/
Disallow: /preview/

Sitemap: https://profitableweb.ru/sitemap.xml

Host: profitableweb.ru"""

DEFAULT_RSS_CONFIG: dict = {
    "enabled": True,
    "format": "atom",
    "item_count": 20,
    "content_mode": "excerpt",
    "include_articles": True,
    "include_category_updates": False,
}

DEFAULT_META_DIRECTIVES: dict = {
    "articles": {"index": True, "follow": True, "noarchive": False},
    "categories": {"index": True, "follow": True, "noarchive": False},
    "tags": {"index": False, "follow": True, "noarchive": False},
}

DEFAULT_METRIKA_CONFIG: dict = {
    "counter_id": "",
    "clickmap": True,
    "track_links": True,
    "accurate_track_bounce": True,
    "webvisor": True,
    "track_hash": False,
}


class SystemSettings(UUIDMixin, TimestampMixin, Base):
    __tablename__ = "system_settings"

    timezone: Mapped[str] = mapped_column(String(10), default="+03:00")
    updated_by: Mapped[uuid.UUID | None] = mapped_column(
        ForeignKey("users.id", ondelete="SET NULL")
    )

    # PW-047: SEO-настройки
    sitemap_config: Mapped[dict] = mapped_column(
        JSONB, nullable=False, default=dict, server_default="{}"
    )
    robots_txt: Mapped[str] = mapped_column(
        Text, nullable=False, default="", server_default=""
    )
    rss_config: Mapped[dict] = mapped_column(
        JSONB, nullable=False, default=dict, server_default="{}"
    )
    default_meta_directives: Mapped[dict] = mapped_column(
        JSONB, nullable=False, default=dict, server_default="{}"
    )
    metrika_config: Mapped[dict] = mapped_column(
        JSONB, nullable=False, default=dict, server_default="{}"
    )

    def __repr__(self) -> str:
        return f"<SystemSettings tz={self.timezone}>"
