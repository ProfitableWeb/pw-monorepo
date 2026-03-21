"""
PW-061-B | Создание и конфигурация MCP-сервера.

Два способа запуска:
  1. Streamable HTTP — монтируется на FastAPI как ASGI sub-app (/mcp)
  2. stdio — для локального использования (Claude Desktop, Cursor)
"""

from mcp.server.fastmcp import FastMCP

from src.mcp.auth import McpAuthMiddleware
from src.mcp.config import MCP_INSTRUCTIONS, MCP_SERVER_NAME


def create_mcp_server(*, streamable_http_path: str = "/mcp") -> FastMCP:
    """Создаёт и настраивает FastMCP-сервер со всеми tools и resources."""
    mcp = FastMCP(
        name=MCP_SERVER_NAME,
        instructions=MCP_INSTRUCTIONS,
        streamable_http_path=streamable_http_path,
    )

    # Register all tools
    from src.mcp.tools import articles, categories, content, media, seo, system, tags

    articles.register(mcp)
    categories.register(mcp)
    tags.register(mcp)
    media.register(mcp)
    seo.register(mcp)
    system.register(mcp)
    content.register(mcp)

    # Register resources
    from src.mcp import resources

    resources.register(mcp)

    return mcp


def create_mcp_asgi_app() -> tuple["McpAuthMiddleware", FastMCP]:
    """Создаёт ASGI-приложение для монтирования на FastAPI.

    Оборачивает Streamable HTTP transport в auth middleware.
    Монтируется на /mcp в FastAPI, поэтому внутренний путь = "/" чтобы
    итоговый endpoint был /mcp (а не /mcp/mcp).

    Возвращает (asgi_app, mcp_server) — mcp_server нужен для lifespan
    (session_manager.run() должен вызываться из lifespan FastAPI,
    т.к. FastAPI не пробрасывает lifespan в mounted raw ASGI apps).
    """
    mcp = create_mcp_server(streamable_http_path="/")
    # FastMCP предоставляет streamable HTTP app через .streamable_http_app()
    mcp_app = mcp.streamable_http_app()
    # Оборачиваем в auth middleware
    return McpAuthMiddleware(mcp_app), mcp
