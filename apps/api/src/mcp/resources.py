"""
PW-061-B | MCP resources: статические ресурсы для контекста AI-клиентов.
"""

import json

from src.mcp.dependencies import get_db


def register(mcp_server: object) -> None:
    """Регистрирует MCP resources на сервере."""

    @mcp_server.resource("blog://style-guide")
    def editorial_style_guide() -> str:
        """Редакционный гайд: стиль написания статей, форматирование, тон."""
        return json.dumps({
            "title": "Редакционный гайд ProfitableWeb",
            "content_format": "markdown",
            "guidelines": {
                "tone": "Профессиональный, но доступный. Без канцелярита.",
                "structure": [
                    "Заголовок (H1) — один на статью, 30-60 символов",
                    "Подзаголовки (H2-H3) — для структуризации, каждые 200-300 слов",
                    "Вступление — первые 2-3 предложения объясняют суть",
                    "Основная часть — аргументы, примеры, данные",
                    "Заключение — итог и call-to-action",
                ],
                "formatting": [
                    "Абзацы 3-5 предложений",
                    "Списки для перечислений (3+ пунктов)",
                    "Выделение жирным ключевых терминов",
                    "Блоки кода с указанием языка",
                ],
                "seo": [
                    "Meta title: 30-60 символов, включает ключевое слово",
                    "Meta description: 120-160 символов",
                    "Фокусное слово — в title, первом абзаце и подзаголовке",
                    "Alt-текст у всех изображений",
                ],
                "word_count": {
                    "minimum": 300,
                    "recommended": "800-1500",
                    "long_form": "2000+",
                },
            },
        }, ensure_ascii=False)

    @mcp_server.resource("blog://content-formats")
    def content_formats() -> str:
        """Поддерживаемые форматы контента и их особенности."""
        return json.dumps({
            "formats": {
                "html": {
                    "description": "HTML-контент. Основной формат.",
                    "editor": "TipTap (WYSIWYG)",
                    "features": ["Изображения", "Таблицы", "Блоки кода", "Вложенные списки"],
                },
                "markdown": {
                    "description": "Markdown-контент. Конвертируется в HTML при отображении.",
                    "features": ["GFM-совместимый", "Таблицы", "Блоки кода с подсветкой"],
                },
            },
            "article_types": {
                "article": "Стандартная статья блога",
                "page": "Статическая страница (О нас, Контакты и т.д.)",
            },
            "statuses": {
                "draft": "Черновик — не виден на сайте",
                "published": "Опубликована — доступна всем",
                "scheduled": "Запланирована — опубликуется автоматически",
                "archived": "Архивирована — скрыта, но не удалена",
            },
        }, ensure_ascii=False)

    @mcp_server.resource("blog://categories")
    def categories_tree() -> str:
        """Актуальное дерево категорий блога с количеством статей."""
        from src.services.category import get_all_categories_with_counts

        db = get_db()
        try:
            rows = get_all_categories_with_counts(db)
            categories = [
                {
                    "id": str(cat.id),
                    "name": cat.name,
                    "slug": cat.slug,
                    "description": cat.description,
                    "parent_id": str(cat.parent_id) if cat.parent_id else None,
                    "order": cat.order,
                    "article_count": count,
                }
                for cat, count in rows
            ]
            return json.dumps({"categories": categories, "total": len(categories)}, ensure_ascii=False)
        finally:
            db.close()

    @mcp_server.resource("blog://stats")
    def site_stats() -> str:
        """Текущая статистика сайта: количество контента по типам."""
        from sqlalchemy import func, select

        from src.models.article import Article
        from src.models.category import Category
        from src.models.media_file import MediaFile
        from src.models.tag import Tag

        db = get_db()
        try:
            article_rows = db.execute(
                select(Article.status, func.count()).group_by(Article.status)
            ).all()
            by_status = {str(s): c for s, c in article_rows}

            return json.dumps({
                "articles": {
                    "total": sum(by_status.values()),
                    "by_status": by_status,
                },
                "categories": db.scalar(select(func.count()).select_from(Category)) or 0,
                "tags": db.scalar(select(func.count()).select_from(Tag)) or 0,
                "media_files": db.scalar(select(func.count()).select_from(MediaFile)) or 0,
            }, ensure_ascii=False)
        finally:
            db.close()
