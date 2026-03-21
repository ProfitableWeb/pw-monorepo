"""
PW-061-B | MCP tools: Контент-утилиты (2 tools).
"""

import json

from mcp.server.fastmcp import Context

from src.mcp.dependencies import get_auth_from_ctx, get_db, log_mcp_action, require_scope


def register(mcp_server: object) -> None:
    """Регистрирует content helper tools на MCP-сервере."""

    @mcp_server.tool()
    @require_scope("generate_slug")
    def generate_slug(
        text: str,
        ctx: Context = None,
    ) -> str:
        """Сгенерировать slug из текста (кириллица транслитерируется). Проверяет уникальность среди статей."""
        from src.services.slug import ensure_unique_slug
        from src.services.slug import generate_slug as make_slug

        db = get_db()
        try:
            user, key = get_auth_from_ctx(ctx)
            raw_slug = make_slug(text)
            unique_slug = ensure_unique_slug(db, raw_slug)
            log_mcp_action(db, user=user, api_key=key, tool_name="generate_slug",
                           arguments={"text": text})
            db.commit()
            return json.dumps({
                "slug": unique_slug,
                "original": raw_slug,
                "is_unique": raw_slug == unique_slug,
            }, ensure_ascii=False)
        finally:
            db.close()

    @mcp_server.tool()
    @require_scope("get_content_brief")
    def get_content_brief(
        topic: str,
        category_slug: str | None = None,
        ctx: Context = None,
    ) -> str:
        """Получить контекст для написания статьи: существующие статьи по теме, доступные категории и теги."""
        from src.services.articles.admin import get_all_articles
        from src.services.category import get_all_categories_with_counts
        from src.services.tag import get_all_tags_with_counts

        db = get_db()
        try:
            user, key = get_auth_from_ctx(ctx)

            # Search for related articles (filter by category if provided)
            related, total_related = get_all_articles(
                db, search=topic, limit=5, category=category_slug,
            )
            related_list = [
                {
                    "title": a.title,
                    "slug": a.slug,
                    "status": a.status.value if hasattr(a.status, "value") else str(a.status),
                    "excerpt": (a.excerpt or "")[:150],
                }
                for a in related
            ]

            # Categories
            cat_rows = get_all_categories_with_counts(db)
            categories = [
                {"name": cat.name, "slug": cat.slug, "article_count": count}
                for cat, count in cat_rows
            ]

            # Tags (top 20 by usage)
            tag_rows = get_all_tags_with_counts(db)
            tags = sorted(
                [{"name": t.name, "slug": t.slug, "article_count": c} for t, c in tag_rows],
                key=lambda x: x["article_count"],
                reverse=True,
            )[:20]

            log_mcp_action(db, user=user, api_key=key, tool_name="get_content_brief",
                           arguments={"topic": topic, "category_slug": category_slug})
            db.commit()

            return json.dumps({
                "topic": topic,
                "related_articles": related_list,
                "total_related": total_related,
                "available_categories": categories,
                "popular_tags": tags,
                "recommendations": [
                    "Убедитесь, что title 30-60 символов",
                    "Meta description 120-160 символов",
                    "Добавьте фокусное ключевое слово",
                    "Минимум 300 слов контента (рекомендуется 800+)",
                    "Добавьте главное изображение",
                ],
            }, ensure_ascii=False)
        finally:
            db.close()
