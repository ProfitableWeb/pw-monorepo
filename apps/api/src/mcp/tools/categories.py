"""
PW-061-B | MCP tools: Категории (4 tools).
"""

import json
import uuid

from mcp.server.fastmcp import Context

from src.mcp.dependencies import get_auth_from_ctx, get_db, log_mcp_action, require_scope


def register(mcp_server: object) -> None:
    """Регистрирует category tools на MCP-сервере."""

    @mcp_server.tool()
    @require_scope("list_categories")
    def list_categories(ctx: Context = None) -> str:
        """Все категории блога с количеством опубликованных статей в каждой."""
        from src.services.category import get_all_categories_with_counts

        db = get_db()
        try:
            user, key = get_auth_from_ctx(ctx)
            rows = get_all_categories_with_counts(db)
            categories = [
                {
                    "id": str(cat.id),
                    "name": cat.name,
                    "slug": cat.slug,
                    "description": cat.description,
                    "parent_id": str(cat.parent_id) if cat.parent_id else None,
                    "order": cat.order,
                    "is_default": getattr(cat, "is_default", False),
                    "article_count": count,
                }
                for cat, count in rows
            ]
            log_mcp_action(db, user=user, api_key=key, tool_name="list_categories")
            db.commit()
            return json.dumps({"categories": categories, "total": len(categories)}, ensure_ascii=False)
        finally:
            db.close()

    @mcp_server.tool()
    @require_scope("create_category")
    def create_category(
        name: str,
        slug: str | None = None,
        description: str | None = None,
        parent_id: str | None = None,
        ctx: Context = None,
    ) -> str:
        """Создать новую категорию. Slug генерируется автоматически если не указан."""
        from src.schemas.admin_category import CategoryCreateRequest
        from src.services.category import create_category as svc_create

        db = get_db()
        try:
            user, key = get_auth_from_ctx(ctx)
            pid = None
            if parent_id:
                try:
                    pid = uuid.UUID(parent_id)
                except ValueError:
                    return json.dumps({"error": "parent_id должен быть UUID"}, ensure_ascii=False)

            req = CategoryCreateRequest(name=name, slug=slug, description=description, parent_id=pid)
            cat = svc_create(db, req)
            log_mcp_action(db, user=user, api_key=key, tool_name="create_category",
                           resource_type="category", resource_id=cat.id,
                           arguments={"name": name})
            db.commit()
            return json.dumps({
                "id": str(cat.id), "name": cat.name, "slug": cat.slug,
                "message": f"Категория «{name}» создана",
            }, ensure_ascii=False)
        except ValueError as e:
            return json.dumps({"error": str(e)}, ensure_ascii=False)
        finally:
            db.close()

    @mcp_server.tool()
    @require_scope("update_category")
    def update_category(
        category_id: str,
        name: str | None = None,
        slug: str | None = None,
        description: str | None = None,
        ctx: Context = None,
    ) -> str:
        """Обновить название, slug или описание категории."""
        from src.schemas.admin_category import CategoryUpdateRequest
        from src.services.category import get_category_by_id, update_category as svc_update

        db = get_db()
        try:
            user, key = get_auth_from_ctx(ctx)
            try:
                cat_uuid = uuid.UUID(category_id)
            except ValueError:
                return json.dumps({"error": "category_id должен быть UUID"}, ensure_ascii=False)

            cat = get_category_by_id(db, cat_uuid)
            if not cat:
                return json.dumps({"error": "Категория не найдена"}, ensure_ascii=False)

            req = CategoryUpdateRequest(name=name, slug=slug, description=description)
            updated = svc_update(db, cat_uuid, req)
            log_mcp_action(db, user=user, api_key=key, tool_name="update_category",
                           resource_type="category", resource_id=cat_uuid,
                           arguments={"name": name, "slug": slug})
            db.commit()
            return json.dumps({
                "id": str(updated.id), "name": updated.name, "slug": updated.slug,
                "message": f"Категория «{updated.name}» обновлена",
            }, ensure_ascii=False)
        except ValueError as e:
            return json.dumps({"error": str(e)}, ensure_ascii=False)
        finally:
            db.close()

    @mcp_server.tool()
    @require_scope("delete_category")
    def delete_category(
        category_id: str,
        ctx: Context = None,
    ) -> str:
        """Удалить категорию. Статьи будут перенесены в категорию по умолчанию."""
        from src.services.category import delete_category as svc_delete

        db = get_db()
        try:
            user, key = get_auth_from_ctx(ctx)
            try:
                cat_uuid = uuid.UUID(category_id)
            except ValueError:
                return json.dumps({"error": "category_id должен быть UUID"}, ensure_ascii=False)

            svc_delete(db, cat_uuid)
            log_mcp_action(db, user=user, api_key=key, tool_name="delete_category",
                           resource_type="category", resource_id=cat_uuid)
            db.commit()
            return json.dumps({"message": "Категория удалена"}, ensure_ascii=False)
        except ValueError as e:
            return json.dumps({"error": str(e)}, ensure_ascii=False)
        finally:
            db.close()
