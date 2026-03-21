"""
PW-061-B | MCP tools: SEO (3 tools).
"""

import json

from mcp.server.fastmcp import Context

from src.mcp.dependencies import (
    get_article_by_id_or_slug,
    get_auth_from_ctx,
    get_db,
    log_mcp_action,
    require_scope,
)


def register(mcp_server: object) -> None:
    """Регистрирует SEO tools на MCP-сервере."""

    @mcp_server.tool()
    @require_scope("get_seo_settings")
    def get_seo_settings(ctx: Context = None) -> str:
        """Текущие SEO-настройки сайта: sitemap, robots.txt, RSS, мета-директивы, Метрика."""
        from src.services.system_settings import get_seo_settings as svc_get

        db = get_db()
        try:
            user, key = get_auth_from_ctx(ctx)
            settings = svc_get(db)
            log_mcp_action(db, user=user, api_key=key, tool_name="get_seo_settings")
            db.commit()
            return json.dumps(settings.model_dump(), ensure_ascii=False)
        finally:
            db.close()

    @mcp_server.tool()
    @require_scope("analyze_article_seo")
    def analyze_article_seo(
        id_or_slug: str,
        ctx: Context = None,
    ) -> str:
        """Анализ SEO статьи: проверка title, description, ключевых слов, длины контента."""
        db = get_db()
        try:
            user, key = get_auth_from_ctx(ctx)
            article = get_article_by_id_or_slug(db, id_or_slug)

            if not article:
                return json.dumps({"error": "Статья не найдена"}, ensure_ascii=False)

            issues: list[str] = []
            warnings: list[str] = []
            score = 100

            # Meta title
            meta_title = article.meta_title or article.title or ""
            if not meta_title:
                issues.append("Отсутствует title")
                score -= 20
            elif len(meta_title) < 30:
                warnings.append(f"Title слишком короткий ({len(meta_title)} символов, рекомендуется 30-60)")
                score -= 5
            elif len(meta_title) > 60:
                warnings.append(f"Title слишком длинный ({len(meta_title)} символов, рекомендуется 30-60)")
                score -= 5

            # Meta description
            meta_desc = article.meta_description or ""
            if not meta_desc:
                issues.append("Отсутствует meta description")
                score -= 15
            elif len(meta_desc) < 120:
                warnings.append(f"Meta description короткий ({len(meta_desc)} символов, рекомендуется 120-160)")
                score -= 5
            elif len(meta_desc) > 160:
                warnings.append(f"Meta description длинный ({len(meta_desc)} символов, рекомендуется 120-160)")
                score -= 5

            # Content length (strip markup for accurate word count)
            import re

            content = article.content or ""
            content_format = getattr(article, "content_format", None)
            fmt = content_format.value if hasattr(content_format, "value") else str(content_format or "html")
            if fmt == "markdown":
                from src.services.articles.reading_time import _strip_markdown
                clean = _strip_markdown(content)
            else:
                clean = re.sub(r"<[^>]+>", " ", content)
            word_count = len(clean.split())
            if word_count < 300:
                issues.append(f"Контент слишком короткий ({word_count} слов, рекомендуется 300+)")
                score -= 15
            elif word_count < 800:
                warnings.append(f"Контент средней длины ({word_count} слов, рекомендуется 800+)")
                score -= 5

            # Excerpt
            if not article.excerpt:
                warnings.append("Отсутствует excerpt")
                score -= 5

            # Focus keyword
            focus = article.focus_keyword or ""
            if not focus:
                warnings.append("Не задано фокусное ключевое слово")
                score -= 10
            else:
                title_lower = (article.title or "").lower()
                if focus.lower() not in title_lower:
                    warnings.append(f"Фокусное слово «{focus}» не найдено в title")
                    score -= 5
                if focus.lower() not in (article.meta_description or "").lower():
                    warnings.append(f"Фокусное слово «{focus}» не найдено в meta description")
                    score -= 5

            # Image
            if not article.image_url:
                warnings.append("Нет главного изображения (image_url)")
                score -= 5

            score = max(0, score)

            log_mcp_action(db, user=user, api_key=key, tool_name="analyze_article_seo",
                           resource_type="article", resource_id=article.id,
                           arguments={"id_or_slug": id_or_slug})
            db.commit()

            return json.dumps({
                "article_id": str(article.id),
                "title": article.title,
                "score": score,
                "word_count": word_count,
                "issues": issues,
                "warnings": warnings,
            }, ensure_ascii=False)
        finally:
            db.close()

    @mcp_server.tool()
    @require_scope("update_seo_settings")
    def update_seo_settings(
        robots_txt: str | None = None,
        sitemap_enabled: bool | None = None,
        rss_enabled: bool | None = None,
        rss_item_count: int | None = None,
        ctx: Context = None,
    ) -> str:
        """Обновить SEO-настройки: robots.txt, sitemap, RSS. Передайте только изменяемые поля."""
        from src.schemas.seo import RssConfigSchema, SitemapConfigSchema
        from src.services.system_settings import update_seo_settings as svc_update

        db = get_db()
        try:
            user, key = get_auth_from_ctx(ctx)

            if user is None:
                return json.dumps({"error": "Обновление SEO-настроек требует аутентификации"}, ensure_ascii=False)

            kwargs: dict = {"updated_by": user.id}
            if robots_txt is not None:
                kwargs["robots_txt"] = robots_txt
            if sitemap_enabled is not None:
                kwargs["sitemap_config"] = SitemapConfigSchema(enabled=sitemap_enabled)
            if rss_enabled is not None or rss_item_count is not None:
                rss_kwargs: dict = {}
                if rss_enabled is not None:
                    rss_kwargs["enabled"] = rss_enabled
                if rss_item_count is not None:
                    rss_kwargs["item_count"] = rss_item_count
                kwargs["rss_config"] = RssConfigSchema(**rss_kwargs)

            updated = svc_update(db, **kwargs)
            log_mcp_action(db, user=user, api_key=key, tool_name="update_seo_settings",
                           arguments={"robots_txt": robots_txt is not None,
                                      "sitemap_enabled": sitemap_enabled,
                                      "rss_enabled": rss_enabled})
            db.commit()
            return json.dumps({
                "message": "SEO-настройки обновлены",
                "settings": updated.model_dump(),
            }, ensure_ascii=False)
        except ValueError as e:
            return json.dumps({"error": str(e)}, ensure_ascii=False)
        finally:
            db.close()
