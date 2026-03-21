"""
PW-061-B | Конфигурация MCP-сервера: scope-модель, tool permissions.
"""

from src.models.mcp_api_key import McpKeyScope, SCOPE_HIERARCHY

# Mapping: tool name → required permission level
TOOL_SCOPES: dict[str, str] = {
    # Articles — read
    "list_articles": "read",
    "get_article": "read",
    "search_articles": "read",
    "get_article_stats": "read",
    # Articles — write
    "create_article": "write",
    "update_article": "write",
    "publish_article": "write",
    "schedule_article": "write",
    # Articles — admin
    "delete_article": "admin",
    # Categories — read
    "list_categories": "read",
    # Categories — write
    "create_category": "write",
    "update_category": "write",
    # Categories — admin
    "delete_category": "admin",
    # Tags — read
    "list_tags": "read",
    # Tags — write
    "create_tag": "write",
    "update_tag": "write",
    # Tags — admin
    "delete_tag": "admin",
    # Media — read
    "list_media": "read",
    "get_media": "read",
    # Media — write
    "upload_media": "write",
    "update_media_metadata": "write",
    # SEO — read
    "get_seo_settings": "read",
    "analyze_article_seo": "read",
    # SEO — admin
    "update_seo_settings": "admin",
    # System — read
    "get_site_analytics": "read",
    # System — admin
    "get_system_health": "admin",
    "get_audit_log": "admin",
    # Content helpers — read
    "get_content_brief": "read",
    # Content helpers — write
    "generate_slug": "write",
}

MCP_SERVER_NAME = "ProfitableWeb Blog"

MCP_INSTRUCTIONS = """MCP-сервер для управления блогом ProfitableWeb.

Доступные операции зависят от scope вашего API-ключа:
- read: просмотр статей, категорий, тегов, медиа, SEO-настроек
- write: read + создание/редактирование контента, загрузка медиа
- admin: write + удаление, управление SEO-настройками, аудит-лог

Статьи создаются как черновики (draft). Для публикации используйте publish_article.
Slug генерируется автоматически из заголовка при создании.
"""


def check_scope(key_scope: McpKeyScope, required: str) -> bool:
    """Проверяет, достаточен ли scope ключа для операции."""
    permissions = SCOPE_HIERARCHY.get(key_scope, set())
    return required in permissions
