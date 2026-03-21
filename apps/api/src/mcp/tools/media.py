"""
PW-061-B | MCP tools: Медиа (4 tools).
"""

import json
import uuid

from mcp.server.fastmcp import Context

from src.mcp.dependencies import get_auth_from_ctx, get_db, log_mcp_action, require_scope


def register(mcp_server: object) -> None:
    """Регистрирует media tools на MCP-сервере."""

    @mcp_server.tool()
    @require_scope("list_media")
    def list_media(
        page: int = 1,
        limit: int = 20,
        file_type: str | None = None,
        ctx: Context = None,
    ) -> str:
        """Список медиафайлов с фильтрацией по типу (image/document/video/audio). Поддерживает пагинацию."""
        from src.services.media import list_media as svc_list_media

        db = get_db()
        try:
            user, key = get_auth_from_ctx(ctx)
            files, total = svc_list_media(db, page=page, limit=limit, file_type=file_type)
            data = [
                {
                    "id": str(f.id),
                    "filename": f.original_filename,
                    "mime_type": f.mime_type,
                    "size": f.file_size,
                    "url": f.url,
                    "alt": f.alt_text,
                    "created_at": f.created_at.isoformat() if f.created_at else None,
                }
                for f in files
            ]
            log_mcp_action(db, user=user, api_key=key, tool_name="list_media",
                           arguments={"page": page, "limit": limit, "file_type": file_type})
            db.commit()
            return json.dumps({"files": data, "total": total, "page": page}, ensure_ascii=False)
        finally:
            db.close()

    @mcp_server.tool()
    @require_scope("get_media")
    def get_media(
        media_id: str,
        ctx: Context = None,
    ) -> str:
        """Получить метаданные и URL медиафайла по ID."""
        from src.services.media import get_media as svc_get_media

        db = get_db()
        try:
            user, key = get_auth_from_ctx(ctx)
            try:
                mid = uuid.UUID(media_id)
            except ValueError:
                return json.dumps({"error": "media_id должен быть UUID"}, ensure_ascii=False)

            f = svc_get_media(db, mid)
            if not f:
                return json.dumps({"error": "Файл не найден"}, ensure_ascii=False)

            log_mcp_action(db, user=user, api_key=key, tool_name="get_media",
                           resource_type="media", resource_id=mid)
            db.commit()
            return json.dumps({
                "id": str(f.id),
                "filename": f.original_filename,
                "mime_type": f.mime_type,
                "size": f.file_size,
                "url": f.url,
                "alt": f.alt_text,
                "caption": getattr(f, "caption", None),
                "width": getattr(f, "width", None),
                "height": getattr(f, "height", None),
                "created_at": f.created_at.isoformat() if f.created_at else None,
            }, ensure_ascii=False)
        finally:
            db.close()

    @mcp_server.tool()
    @require_scope("upload_media")
    def upload_media(
        filename: str,
        content_base64: str,
        alt_text: str | None = None,
        ctx: Context = None,
    ) -> str:
        """Загрузить медиафайл (base64-encoded). Максимум 10MB. Поддерживает JPEG, PNG, WebP, GIF, SVG, PDF."""
        import base64
        import mimetypes

        from src.services.media import upload_media as svc_upload_media
        from src.services.storage import storage

        db = get_db()
        try:
            user, key = get_auth_from_ctx(ctx)

            try:
                file_bytes = base64.b64decode(content_base64)
            except Exception:
                return json.dumps({"error": "Невалидный base64"}, ensure_ascii=False)

            if len(file_bytes) > 10 * 1024 * 1024:
                return json.dumps({"error": "File size exceeds 10MB limit"}, ensure_ascii=False)

            if user is None:
                return json.dumps({"error": "Загрузка медиа требует аутентификации"}, ensure_ascii=False)

            content_type = mimetypes.guess_type(filename)[0] or "application/octet-stream"

            media = svc_upload_media(
                db, storage, data=file_bytes, filename=filename,
                content_type=content_type, user_id=user.id,
            )

            if alt_text and media:
                media.alt_text = alt_text

            log_mcp_action(db, user=user, api_key=key, tool_name="upload_media",
                           resource_type="media", resource_id=media.id,
                           arguments={"filename": filename, "size": len(file_bytes)})
            db.commit()
            return json.dumps({
                "id": str(media.id),
                "url": media.url,
                "filename": media.original_filename,
                "message": f"Файл «{filename}» загружен",
            }, ensure_ascii=False)
        except ValueError as e:
            return json.dumps({"error": str(e)}, ensure_ascii=False)
        finally:
            db.close()

    @mcp_server.tool()
    @require_scope("update_media_metadata")
    def update_media_metadata(
        media_id: str,
        alt_text: str | None = None,
        caption: str | None = None,
        ctx: Context = None,
    ) -> str:
        """Обновить alt-текст и/или caption медиафайла."""
        from src.services.media import get_media as svc_get_media

        db = get_db()
        try:
            user, key = get_auth_from_ctx(ctx)
            try:
                mid = uuid.UUID(media_id)
            except ValueError:
                return json.dumps({"error": "media_id должен быть UUID"}, ensure_ascii=False)

            f = svc_get_media(db, mid)
            if not f:
                return json.dumps({"error": "Файл не найден"}, ensure_ascii=False)

            if alt_text is not None:
                f.alt_text = alt_text
            if caption is not None and hasattr(f, "caption"):
                f.caption = caption

            log_mcp_action(db, user=user, api_key=key, tool_name="update_media_metadata",
                           resource_type="media", resource_id=mid,
                           arguments={"alt_text": alt_text, "caption": caption})
            db.commit()
            return json.dumps({"message": "Метаданные обновлены"}, ensure_ascii=False)
        finally:
            db.close()
