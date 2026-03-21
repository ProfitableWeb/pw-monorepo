"""
PW-061-B | MCP tools: Система (3 tools).
"""

import json

from mcp.server.fastmcp import Context

from src.mcp.dependencies import get_auth_from_ctx, get_db, log_mcp_action, require_scope


def register(mcp_server: object) -> None:
    """Регистрирует system tools на MCP-сервере."""

    @mcp_server.tool()
    @require_scope("get_system_health")
    def get_system_health(ctx: Context = None) -> str:
        """Статус системы: CPU, RAM, диск, БД, хранилище, ошибки за 24ч."""
        from src.services.health import get_system_health as svc_health

        db = get_db()
        try:
            user, key = get_auth_from_ctx(ctx)
            health = svc_health(db)
            log_mcp_action(db, user=user, api_key=key, tool_name="get_system_health")
            db.commit()
            return json.dumps(health.model_dump(), ensure_ascii=False)
        finally:
            db.close()

    @mcp_server.tool()
    @require_scope("get_site_analytics")
    def get_site_analytics(ctx: Context = None) -> str:
        """Агрегированная аналитика сайта: количество статей, категорий, тегов, медиа."""
        from sqlalchemy import func, select

        from src.models.article import Article
        from src.models.category import Category
        from src.models.media_file import MediaFile
        from src.models.tag import Tag

        db = get_db()
        try:
            user, key = get_auth_from_ctx(ctx)

            # Article stats by status
            article_rows = db.execute(
                select(Article.status, func.count()).group_by(Article.status)
            ).all()
            articles_by_status = {str(s): c for s, c in article_rows}
            total_articles = sum(articles_by_status.values())

            # Counts
            total_categories = db.scalar(select(func.count()).select_from(Category)) or 0
            total_tags = db.scalar(select(func.count()).select_from(Tag)) or 0
            total_media = db.scalar(select(func.count()).select_from(MediaFile)) or 0

            # Recent articles
            recent = db.execute(
                select(Article.title, Article.slug, Article.status, Article.updated_at)
                .order_by(Article.updated_at.desc())
                .limit(5)
            ).all()
            recent_articles = [
                {
                    "title": r.title,
                    "slug": r.slug,
                    "status": str(r.status),
                    "updated_at": r.updated_at.isoformat() if r.updated_at else None,
                }
                for r in recent
            ]

            log_mcp_action(db, user=user, api_key=key, tool_name="get_site_analytics")
            db.commit()

            return json.dumps({
                "articles": {
                    "total": total_articles,
                    "by_status": articles_by_status,
                },
                "categories": total_categories,
                "tags": total_tags,
                "media_files": total_media,
                "recent_articles": recent_articles,
            }, ensure_ascii=False)
        finally:
            db.close()

    @mcp_server.tool()
    @require_scope("get_audit_log")
    def get_audit_log(
        limit: int = 20,
        offset: int = 0,
        action: str | None = None,
        date_range: str | None = None,
        ctx: Context = None,
    ) -> str:
        """Журнал аудита: последние действия в системе. Фильтрация по действию и периоду (24h/7d/30d)."""
        from src.services.audit_log import get_entries

        db = get_db()
        try:
            user, key = get_auth_from_ctx(ctx)
            entries, total = get_entries(
                db, limit=min(limit, 100), offset=offset,
                action=action, date_range=date_range,
            )
            log_mcp_action(db, user=user, api_key=key, tool_name="get_audit_log",
                           arguments={"limit": limit, "action": action, "date_range": date_range})
            db.commit()
            return json.dumps({
                "entries": [e.model_dump() for e in entries],
                "total": total,
                "limit": limit,
                "offset": offset,
            }, ensure_ascii=False)
        finally:
            db.close()
