"""
PW-038/PW-047 | CRUD системных настроек. Синглтон — одна строка в таблице,
создаётся с дефолтами при первом обращении.
PW-047: SEO-настройки — get/update для sitemap, robots.txt, RSS, директив, Метрики.
"""

import uuid

from sqlalchemy import select
from sqlalchemy.orm import Session

from src.models.system_settings import (
    DEFAULT_META_DIRECTIVES,
    DEFAULT_METRIKA_CONFIG,
    DEFAULT_ROBOTS_TXT,
    DEFAULT_RSS_CONFIG,
    DEFAULT_SITEMAP_CONFIG,
    SystemSettings,
)
from src.schemas.seo import (
    MetaDirectivesSchema,
    MetrikaConfigSchema,
    RssConfigSchema,
    SeoSettingsResponse,
    SitemapConfigSchema,
)


def get_settings(db: Session) -> SystemSettings:
    stmt = select(SystemSettings)
    settings = db.scalars(stmt).first()
    if settings is None:
        settings = SystemSettings(
            timezone="+03:00",
            sitemap_config=DEFAULT_SITEMAP_CONFIG,
            robots_txt=DEFAULT_ROBOTS_TXT,
            rss_config=DEFAULT_RSS_CONFIG,
            default_meta_directives=DEFAULT_META_DIRECTIVES,
            metrika_config=DEFAULT_METRIKA_CONFIG,
        )
        db.add(settings)
        db.commit()
        db.refresh(settings)
    return settings


def update_settings(
    db: Session,
    *,
    timezone: str | None = None,
    updated_by: uuid.UUID | None = None,
) -> SystemSettings:
    settings = get_settings(db)
    if timezone is not None:
        settings.timezone = timezone
    if updated_by is not None:
        settings.updated_by = updated_by
    db.commit()
    db.refresh(settings)
    return settings


# --- PW-047: SEO-настройки ---


def _deep_merge(base: dict, override: dict) -> dict:
    """Рекурсивно мержит override в base (base не мутируется)."""
    result = base.copy()
    for key, value in override.items():
        if key in result and isinstance(result[key], dict) and isinstance(value, dict):
            result[key] = _deep_merge(result[key], value)
        else:
            result[key] = value
    return result


def _merge_with_defaults(stored: dict, defaults: dict) -> dict:
    """Объединяет сохранённые JSONB-данные с дефолтами (для пустых полей после миграции)."""
    if not stored:
        return defaults.copy()
    return _deep_merge(defaults, stored)


def get_seo_settings(db: Session) -> SeoSettingsResponse:
    """Возвращает все SEO-настройки с дефолтами для пустых полей."""
    settings = get_settings(db)

    sitemap_data = _merge_with_defaults(settings.sitemap_config, DEFAULT_SITEMAP_CONFIG)
    rss_data = _merge_with_defaults(settings.rss_config, DEFAULT_RSS_CONFIG)
    metrika_data = _merge_with_defaults(settings.metrika_config, DEFAULT_METRIKA_CONFIG)
    robots = settings.robots_txt or DEFAULT_ROBOTS_TXT

    # Мета-директивы: merge каждого ключа
    directives_data = DEFAULT_META_DIRECTIVES.copy()
    if settings.default_meta_directives:
        for key, val in settings.default_meta_directives.items():
            directives_data[key] = val

    return SeoSettingsResponse(
        sitemap_config=SitemapConfigSchema(**sitemap_data),
        robots_txt=robots,
        rss_config=RssConfigSchema(**rss_data),
        default_meta_directives={
            k: MetaDirectivesSchema(**v) for k, v in directives_data.items()
        },
        metrika_config=MetrikaConfigSchema(**metrika_data),
    )


def update_seo_settings(
    db: Session,
    *,
    updated_by: uuid.UUID,
    sitemap_config: SitemapConfigSchema | None = None,
    robots_txt: str | None = None,
    rss_config: RssConfigSchema | None = None,
    default_meta_directives: dict[str, MetaDirectivesSchema] | None = None,
    metrika_config: MetrikaConfigSchema | None = None,
) -> SeoSettingsResponse:
    """Обновляет SEO-настройки (partial update)."""
    settings = get_settings(db)
    settings.updated_by = updated_by

    if sitemap_config is not None:
        existing = settings.sitemap_config or {}
        settings.sitemap_config = _deep_merge(existing, sitemap_config.model_dump())
    if robots_txt is not None:
        settings.robots_txt = robots_txt
    if rss_config is not None:
        existing = settings.rss_config or {}
        settings.rss_config = _deep_merge(existing, rss_config.model_dump())
    if default_meta_directives is not None:
        existing = settings.default_meta_directives or {}
        incoming = {k: v.model_dump() for k, v in default_meta_directives.items()}
        settings.default_meta_directives = _deep_merge(existing, incoming)
    if metrika_config is not None:
        existing = settings.metrika_config or {}
        settings.metrika_config = _deep_merge(existing, metrika_config.model_dump())

    db.commit()
    db.refresh(settings)
    return get_seo_settings(db)
