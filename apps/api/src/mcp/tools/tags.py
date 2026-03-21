"""
PW-061-B | MCP tools: Теги (4 tools).
"""

import json
import uuid

from mcp.server.fastmcp import Context

from src.mcp.dependencies import get_auth_from_ctx, get_db, log_mcp_action, require_scope


def register(mcp_server: object) -> None:
    """Регистрирует tag tools на MCP-сервере."""

    @mcp_server.tool()
    @require_scope("list_tags")
    def list_tags(ctx: Context = None) -> str:
        """Все теги блога с количеством статей в каждом."""
        from src.services.tag import get_all_tags_with_counts

        db = get_db()
        try:
            user, key = get_auth_from_ctx(ctx)
            rows = get_all_tags_with_counts(db)
            tags = [
                {
                    "id": str(tag.id),
                    "name": tag.name,
                    "slug": tag.slug,
                    "color": tag.color,
                    "group": tag.group,
                    "article_count": count,
                }
                for tag, count in rows
            ]
            log_mcp_action(db, user=user, api_key=key, tool_name="list_tags")
            db.commit()
            return json.dumps({"tags": tags, "total": len(tags)}, ensure_ascii=False)
        finally:
            db.close()

    @mcp_server.tool()
    @require_scope("create_tag")
    def create_tag(
        name: str,
        slug: str | None = None,
        color: str | None = None,
        group: str | None = None,
        ctx: Context = None,
    ) -> str:
        """Создать новый тег. Slug генерируется автоматически."""
        from src.schemas.admin_tag import TagCreateRequest
        from src.services.tag import create_tag as svc_create

        db = get_db()
        try:
            user, key = get_auth_from_ctx(ctx)
            req = TagCreateRequest(name=name, slug=slug, color=color, group=group)
            tag = svc_create(db, req)
            log_mcp_action(db, user=user, api_key=key, tool_name="create_tag",
                           resource_type="tag", resource_id=tag.id,
                           arguments={"name": name})
            db.commit()
            return json.dumps({
                "id": str(tag.id), "name": tag.name, "slug": tag.slug,
                "message": f"Тег «{name}» создан",
            }, ensure_ascii=False)
        except ValueError as e:
            return json.dumps({"error": str(e)}, ensure_ascii=False)
        finally:
            db.close()

    @mcp_server.tool()
    @require_scope("update_tag")
    def update_tag(
        tag_id: str,
        name: str | None = None,
        slug: str | None = None,
        color: str | None = None,
        group: str | None = None,
        ctx: Context = None,
    ) -> str:
        """Обновить тег: имя, slug, цвет, группу."""
        from src.schemas.admin_tag import TagUpdateRequest
        from src.services.tag import update_tag as svc_update

        db = get_db()
        try:
            user, key = get_auth_from_ctx(ctx)
            try:
                tag_uuid = uuid.UUID(tag_id)
            except ValueError:
                return json.dumps({"error": "tag_id должен быть UUID"}, ensure_ascii=False)

            req = TagUpdateRequest(name=name, slug=slug, color=color, group=group)
            updated = svc_update(db, tag_uuid, req)
            log_mcp_action(db, user=user, api_key=key, tool_name="update_tag",
                           resource_type="tag", resource_id=tag_uuid,
                           arguments={"name": name})
            db.commit()
            return json.dumps({
                "id": str(updated.id), "name": updated.name, "slug": updated.slug,
                "message": f"Тег «{updated.name}» обновлён",
            }, ensure_ascii=False)
        except ValueError as e:
            return json.dumps({"error": str(e)}, ensure_ascii=False)
        finally:
            db.close()

    @mcp_server.tool()
    @require_scope("delete_tag")
    def delete_tag(
        tag_id: str,
        ctx: Context = None,
    ) -> str:
        """Удалить тег. Связи со статьями будут удалены."""
        from src.services.tag import delete_tag as svc_delete

        db = get_db()
        try:
            user, key = get_auth_from_ctx(ctx)
            try:
                tag_uuid = uuid.UUID(tag_id)
            except ValueError:
                return json.dumps({"error": "tag_id должен быть UUID"}, ensure_ascii=False)

            svc_delete(db, tag_uuid)
            log_mcp_action(db, user=user, api_key=key, tool_name="delete_tag",
                           resource_type="tag", resource_id=tag_uuid)
            db.commit()
            return json.dumps({"message": "Тег удалён"}, ensure_ascii=False)
        except ValueError as e:
            return json.dumps({"error": str(e)}, ensure_ascii=False)
        finally:
            db.close()
