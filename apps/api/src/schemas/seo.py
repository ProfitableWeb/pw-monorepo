"""PW-047 | Pydantic-схемы SEO-настроек (admin + public)."""

from typing import Literal

from pydantic import BaseModel, field_validator

# --- Вложенные схемы ---


class SitemapConfigSchema(BaseModel):
    enabled: bool = True
    include_articles: bool = True
    include_categories: bool = True
    include_tags: bool = False
    include_static_pages: bool = True
    priorities: dict[str, float] = {}
    changefreq: dict[str, str] = {}

    @field_validator("priorities")
    @classmethod
    def validate_priorities(cls, v: dict[str, float]) -> dict[str, float]:
        for key, val in v.items():
            if not 0.0 <= val <= 1.0:
                raise ValueError(
                    f"Приоритет '{key}' должен быть от 0.0 до 1.0, получено {val}"
                )
        return v

    @field_validator("changefreq")
    @classmethod
    def validate_changefreq(cls, v: dict[str, str]) -> dict[str, str]:
        allowed = {"always", "hourly", "daily", "weekly", "monthly", "yearly", "never"}
        for key, val in v.items():
            if val not in allowed:
                raise ValueError(
                    f"Частота '{key}' должна быть одной из {allowed}, получено '{val}'"
                )
        return v


class RssConfigSchema(BaseModel):
    enabled: bool = True
    format: Literal["rss2", "atom"] = "atom"
    item_count: int = 20
    content_mode: Literal["full", "excerpt"] = "excerpt"
    include_articles: bool = True
    include_category_updates: bool = False

    @field_validator("item_count")
    @classmethod
    def validate_item_count(cls, v: int) -> int:
        if not 1 <= v <= 100:
            raise ValueError("Количество записей RSS должно быть от 1 до 100")
        return v


class MetaDirectivesSchema(BaseModel):
    index: bool = True
    follow: bool = True
    noarchive: bool = False


class MetrikaConfigSchema(BaseModel):
    counter_id: str = ""
    clickmap: bool = True
    track_links: bool = True
    accurate_track_bounce: bool = True
    webvisor: bool = True
    track_hash: bool = False

    @field_validator("counter_id")
    @classmethod
    def validate_counter_id(cls, v: str) -> str:
        v = v.strip()
        if v and not v.isdigit():
            raise ValueError("Номер счётчика должен содержать только цифры")
        return v


# --- Admin: полный ответ + обновление ---


class SeoSettingsResponse(BaseModel):
    sitemap_config: SitemapConfigSchema
    robots_txt: str
    rss_config: RssConfigSchema
    default_meta_directives: dict[str, MetaDirectivesSchema]
    metrika_config: MetrikaConfigSchema


class SeoSettingsUpdateRequest(BaseModel):
    sitemap_config: SitemapConfigSchema | None = None
    robots_txt: str | None = None
    rss_config: RssConfigSchema | None = None
    default_meta_directives: dict[str, MetaDirectivesSchema] | None = None
    metrika_config: MetrikaConfigSchema | None = None


# --- Public: конфигурация для web (без meta_directives) ---


class SeoPublicConfigResponse(BaseModel):
    sitemap_config: SitemapConfigSchema
    robots_txt: str
    rss_config: RssConfigSchema
    metrika_config: MetrikaConfigSchema
