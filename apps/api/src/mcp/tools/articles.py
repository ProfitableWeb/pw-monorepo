"""
PW-061-B | MCP tools: Статьи (9 tools).
"""

import json
import uuid
from datetime import datetime, timezone

from mcp.server.fastmcp import Context

from src.mcp.dependencies import (
    get_article_by_id_or_slug,
    get_auth_from_ctx,
    get_db,
    log_mcp_action,
    require_scope,
)


def _article_to_brief(article: object) -> dict:
    """Конвертирует Article в краткий dict (для списков)."""
    return {
        "id": str(article.id),
        "title": article.title,
        "slug": article.slug,
        "status": article.status.value if hasattr(article.status, "value") else str(article.status),
        "excerpt": (article.excerpt or "")[:200],
        "category": article.primary_category.name if article.primary_category else None,
        "author": article.author.name if article.author else None,
        "published_at": article.published_at.isoformat() if article.published_at else None,
        "updated_at": article.updated_at.isoformat() if article.updated_at else None,
        "views": getattr(article, "views", 0),
    }


def _article_to_full(article: object) -> dict:
    """Конвертирует Article в полный dict."""
    brief = _article_to_brief(article)
    brief.update({
        "content": article.content,
        "content_format": article.content_format.value if hasattr(article.content_format, "value") else str(article.content_format),
        "subtitle": article.subtitle,
        "image_url": article.image_url,
        "meta_title": article.meta_title,
        "meta_description": article.meta_description,
        "focus_keyword": article.focus_keyword,
        "tags": [{"id": str(t.id), "name": t.name, "slug": t.slug} for t in article.tags],
        "categories": [{"id": str(c.id), "name": c.name, "slug": c.slug} for c in article.categories],
        "reading_time": article.reading_time,
        "created_at": article.created_at.isoformat() if article.created_at else None,
    })
    return brief


def register(mcp_server: object) -> None:
    """Регистрирует article tools на MCP-сервере."""

    @mcp_server.tool()
    @require_scope("list_articles")
    def list_articles(
        page: int = 1,
        limit: int = 20,
        status: str | None = None,
        category: str | None = None,
        search: str | None = None,
        sort_by: str = "updated_at",
        order: str = "desc",
        ctx: Context = None,
    ) -> str:
        """Список статей с фильтрацией по статусу, категории, поиску. Поддерживает пагинацию."""
        from src.services.articles.admin import get_all_articles

        db = get_db()
        try:
            user, key = get_auth_from_ctx(ctx)
            articles, total = get_all_articles(
                db, page=page, limit=limit, status=status,
                category=category, search=search,
                sort_by=sort_by, order=order,
            )
            log_mcp_action(db, user=user, api_key=key, tool_name="list_articles",
                           arguments={"page": page, "limit": limit, "status": status, "search": search})
            db.commit()
            return json.dumps({
                "articles": [_article_to_brief(a) for a in articles],
                "total": total,
                "page": page,
                "limit": limit,
            }, ensure_ascii=False)
        finally:
            db.close()

    @mcp_server.tool()
    @require_scope("get_article")
    def get_article(
        id_or_slug: str,
        ctx: Context = None,
    ) -> str:
        """Получить полную статью по ID (UUID) или slug. Возвращает контент, SEO, категории, теги."""
        db = get_db()
        try:
            user, key = get_auth_from_ctx(ctx)
            article = get_article_by_id_or_slug(db, id_or_slug)

            if not article:
                return json.dumps({"error": "Статья не найдена"}, ensure_ascii=False)

            log_mcp_action(db, user=user, api_key=key, tool_name="get_article",
                           resource_type="article", resource_id=article.id,
                           arguments={"id_or_slug": id_or_slug})
            db.commit()
            return json.dumps(_article_to_full(article), ensure_ascii=False)
        finally:
            db.close()

    @mcp_server.tool()
    @require_scope("search_articles")
    def search_articles(
        query: str,
        limit: int = 10,
        ctx: Context = None,
    ) -> str:
        """Полнотекстовый поиск по статьям (заголовок, excerpt)."""
        from src.services.articles.admin import get_all_articles

        db = get_db()
        try:
            user, key = get_auth_from_ctx(ctx)
            articles, total = get_all_articles(db, search=query, limit=limit)
            log_mcp_action(db, user=user, api_key=key, tool_name="search_articles",
                           arguments={"query": query, "limit": limit})
            db.commit()
            return json.dumps({
                "articles": [_article_to_brief(a) for a in articles],
                "total": total,
                "query": query,
            }, ensure_ascii=False)
        finally:
            db.close()

    @mcp_server.tool()
    @require_scope("get_article_stats")
    def get_article_stats(ctx: Context = None) -> str:
        """Агрегированная статистика по статьям: количество по статусам, общее число."""
        from sqlalchemy import func, select
        from src.models.article import Article

        db = get_db()
        try:
            user, key = get_auth_from_ctx(ctx)
            rows = db.execute(
                select(Article.status, func.count()).group_by(Article.status)
            ).all()
            stats = {str(status): count for status, count in rows}
            total = sum(stats.values())
            log_mcp_action(db, user=user, api_key=key, tool_name="get_article_stats")
            db.commit()
            return json.dumps({"total": total, "by_status": stats}, ensure_ascii=False)
        finally:
            db.close()

    @mcp_server.tool()
    @require_scope("create_article")
    def create_article(
        title: str,
        content: str,
        primary_category_id: str,
        excerpt: str = "",
        tags: list[str] | None = None,
        meta_title: str | None = None,
        meta_description: str | None = None,
        ctx: Context = None,
    ) -> str:
        """Создать черновик статьи. Требуется title, content и primary_category_id (UUID). Slug генерируется автоматически."""
        from src.services.articles.admin import create_article as svc_create

        db = get_db()
        try:
            user, key = get_auth_from_ctx(ctx)
            try:
                cat_id = uuid.UUID(primary_category_id)
            except ValueError:
                return json.dumps({"error": "primary_category_id должен быть UUID"}, ensure_ascii=False)

            if user is None:
                return json.dumps({"error": "Создание статей требует аутентификации (author_id)"}, ensure_ascii=False)

            article = svc_create(
                db, author_id=user.id, title=title, content=content,
                primary_category_id=cat_id, excerpt=excerpt,
                tags=tags, meta_title=meta_title, meta_description=meta_description,
            )
            log_mcp_action(db, user=user, api_key=key, tool_name="create_article",
                           resource_type="article", resource_id=article.id,
                           arguments={"title": title})
            db.commit()
            return json.dumps({
                "id": str(article.id),
                "slug": article.slug,
                "status": "draft",
                "message": f"Статья «{title}» создана как черновик",
            }, ensure_ascii=False)
        except ValueError as e:
            return json.dumps({"error": str(e)}, ensure_ascii=False)
        finally:
            db.close()

    @mcp_server.tool()
    @require_scope("update_article")
    def update_article(
        id_or_slug: str,
        title: str | None = None,
        content: str | None = None,
        excerpt: str | None = None,
        meta_title: str | None = None,
        meta_description: str | None = None,
        tags: list[str] | None = None,
        ctx: Context = None,
    ) -> str:
        """Обновить поля существующей статьи. Передайте только изменяемые поля."""
        from src.services.articles.admin import update_article as svc_update

        db = get_db()
        try:
            user, key = get_auth_from_ctx(ctx)
            article = get_article_by_id_or_slug(db, id_or_slug)

            if not article:
                return json.dumps({"error": "Статья не найдена"}, ensure_ascii=False)

            fields = {}
            if title is not None:
                fields["title"] = title
            if content is not None:
                fields["content"] = content
            if excerpt is not None:
                fields["excerpt"] = excerpt
            if meta_title is not None:
                fields["meta_title"] = meta_title
            if meta_description is not None:
                fields["meta_description"] = meta_description
            if tags is not None:
                fields["tags"] = tags

            if user is None:
                return json.dumps({"error": "Обновление статей требует аутентификации (author_id)"}, ensure_ascii=False)

            updated = svc_update(db, article, author_id=user.id, **fields)
            log_mcp_action(db, user=user, api_key=key, tool_name="update_article",
                           resource_type="article", resource_id=updated.id,
                           arguments={"id_or_slug": id_or_slug, **{k: v for k, v in fields.items() if k != "content"}})
            db.commit()
            return json.dumps({
                "id": str(updated.id),
                "slug": updated.slug,
                "message": f"Статья «{updated.title}» обновлена",
            }, ensure_ascii=False)
        except ValueError as e:
            return json.dumps({"error": str(e)}, ensure_ascii=False)
        finally:
            db.close()

    @mcp_server.tool()
    @require_scope("publish_article")
    def publish_article(
        id_or_slug: str,
        ctx: Context = None,
    ) -> str:
        """Опубликовать статью немедленно. Статья должна иметь title, content, excerpt и категорию."""
        from src.services.articles.admin import publish_article as svc_publish

        db = get_db()
        try:
            user, key = get_auth_from_ctx(ctx)
            article = get_article_by_id_or_slug(db, id_or_slug)

            if not article:
                return json.dumps({"error": "Статья не найдена"}, ensure_ascii=False)

            published = svc_publish(db, article)
            log_mcp_action(db, user=user, api_key=key, tool_name="publish_article",
                           resource_type="article", resource_id=published.id)
            db.commit()
            return json.dumps({
                "id": str(published.id),
                "slug": published.slug,
                "status": "published",
                "published_at": published.published_at.isoformat() if published.published_at else None,
                "message": f"Статья «{published.title}» опубликована",
            }, ensure_ascii=False)
        except ValueError as e:
            return json.dumps({"error": str(e)}, ensure_ascii=False)
        finally:
            db.close()

    @mcp_server.tool()
    @require_scope("schedule_article")
    def schedule_article(
        id_or_slug: str,
        publish_at: str,
        ctx: Context = None,
    ) -> str:
        """Запланировать публикацию статьи на указанную дату (ISO 8601). Дата должна быть в будущем."""
        from src.services.articles.admin import schedule_article as svc_schedule

        db = get_db()
        try:
            user, key = get_auth_from_ctx(ctx)
            article = get_article_by_id_or_slug(db, id_or_slug)

            if not article:
                return json.dumps({"error": "Статья не найдена"}, ensure_ascii=False)

            try:
                pub_dt = datetime.fromisoformat(publish_at).replace(tzinfo=timezone.utc)
            except ValueError:
                return json.dumps({"error": "Неверный формат даты. Используйте ISO 8601"}, ensure_ascii=False)

            scheduled = svc_schedule(db, article, pub_dt)
            log_mcp_action(db, user=user, api_key=key, tool_name="schedule_article",
                           resource_type="article", resource_id=scheduled.id,
                           arguments={"publish_at": publish_at})
            db.commit()
            return json.dumps({
                "id": str(scheduled.id),
                "status": "scheduled",
                "published_at": scheduled.published_at.isoformat(),
                "message": f"Публикация «{scheduled.title}» запланирована на {publish_at}",
            }, ensure_ascii=False)
        except ValueError as e:
            return json.dumps({"error": str(e)}, ensure_ascii=False)
        finally:
            db.close()

    @mcp_server.tool()
    @require_scope("delete_article")
    def delete_article(
        id_or_slug: str,
        permanent: bool = False,
        ctx: Context = None,
    ) -> str:
        """Удалить статью. По умолчанию — архивация (soft delete). permanent=true для полного удаления."""
        from src.services.articles.admin import delete_article as svc_delete

        db = get_db()
        try:
            user, key = get_auth_from_ctx(ctx)
            article = get_article_by_id_or_slug(db, id_or_slug)

            if not article:
                return json.dumps({"error": "Статья не найдена"}, ensure_ascii=False)

            title = article.title
            article_id = article.id
            svc_delete(db, article, permanent=permanent)
            log_mcp_action(db, user=user, api_key=key, tool_name="delete_article",
                           resource_type="article", resource_id=article_id,
                           arguments={"permanent": permanent})
            db.commit()
            action = "удалена" if permanent else "архивирована"
            return json.dumps({"message": f"Статья «{title}» {action}"}, ensure_ascii=False)
        except ValueError as e:
            return json.dumps({"error": str(e)}, ensure_ascii=False)
        finally:
            db.close()
