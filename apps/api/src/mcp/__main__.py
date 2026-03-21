"""
PW-061-B | stdio entry point для MCP-сервера.

Использование:
  python -m src.mcp          # запуск через stdio (для Claude Desktop, Cursor)

Конфигурация клиента (claude_desktop_config.json):
  {
    "mcpServers": {
      "profitableweb": {
        "command": "python",
        "args": ["-m", "src.mcp"],
        "cwd": "/path/to/apps/api"
      }
    }
  }

Примечание: stdio transport не использует auth middleware.
API-ключ не требуется при локальном подключении через stdio.
"""

from src.mcp.server import create_mcp_server


def main() -> None:
    mcp = create_mcp_server()
    mcp.run(transport="stdio")


if __name__ == "__main__":
    main()
