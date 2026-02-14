"""
PW-027 | Seed: наполнение БД mock-данными из фронтенда (masonry + comments).
Запуск: cd apps/api && uv run python -m src.seed
Идемпотентный — пересоздаёт все таблицы при каждом запуске (drop_all + create_all).
"""

import uuid
from datetime import datetime
from typing import Any

from sqlalchemy.orm import Session

from src.core.database import SessionLocal, engine
from src.models import Base
from src.models.article import Article, ArticleLayout, ArticleStatus
from src.models.category import Category
from src.models.comment import Comment
from src.models.user import User, UserRole

# ---------- Data ----------

CATEGORIES: list[dict[str, str]] = [
    {
        "name": "Экономика внимания",
        "slug": "attention-economy",
        "subtitle": "Как привлекать и удерживать внимание аудитории",
        "description": "В цифровую эпоху внимание стало самым ценным ресурсом. В этом разделе мы исследуем стратегии привлечения и удержания внимания аудитории через контент, дизайн и технологии.",
    },
    {
        "name": "ИИ-автоматизация",
        "slug": "ai-automation",
        "subtitle": "Использование ИИ для автоматизации рутинных задач",
        "description": "Искусственный интеллект открывает новые возможности для автоматизации. Мы разбираем практические сценарии применения ИИ в продуктовой разработке и бизнес-процессах.",
    },
    {
        "name": "UI/UX дизайн",
        "slug": "ui-ux-design",
        "subtitle": "Принципы создания удобных и красивых интерфейсов",
        "description": "Дизайн влияет на восприятие продукта и эффективность взаимодействия. Здесь собраны материалы о пользовательских исследованиях, прототипировании и визуальной системе.",
    },
    {
        "name": "Взгляд в будущее",
        "slug": "future-vision",
        "subtitle": "Тренды и прогнозы развития технологий и общества",
        "description": "Новые технологии меняют рынок и привычки людей. Мы обсуждаем сценарии будущего, влияние ИИ и перспективы цифровой экономики.",
    },
    {
        "name": "Редакторская деятельность",
        "slug": "editorial-work",
        "subtitle": "Искусство создания и редактирования контента",
        "description": "Контент-стратегия, редактура и стиль — ключ к доверию аудитории. Разбираем подходы к созданию сильных текстов и контентных систем.",
    },
    {
        "name": "Продуктовая разработка",
        "slug": "product-development",
        "subtitle": "Создание продуктов, которые решают реальные проблемы",
        "description": "От идеи до запуска: изучаем процессы создания цифровых продуктов, работу с метриками, итеративную разработку и подходы к валидации гипотез.",
    },
]

ARTICLES: list[dict[str, Any]] = [
    {"title": "Психоинженерия — новое направление эпохи software 3.0", "subtitle": "Область на стыке психологии, когнитивных наук, нейронаук, дизайна человеко-машинных интерфейсов и разработки ИИ", "slug": "youtube-monetization-guide", "category": "attention-economy", "read_time": 12, "summary": "<p>Бурное развитие ИИ активно оптимизирует существующие профессии, а также создаёт новые.</p>", "published_at": "2025-10-15T10:00:00Z"},
    {"title": "Telegram-боты как источник дохода", "subtitle": "Разработка и масштабирование бизнеса", "slug": "telegram-bots-business", "category": "ai-automation", "read_time": 8, "summary": "<p>Telegram-боты открывают огромные возможности для автоматизации бизнеса и создания пассивного дохода.</p>", "published_at": "2025-10-14T14:30:00Z"},
    {"title": "NFT для художников: практическое руководство", "subtitle": "Как создать и продать свою первую коллекцию", "slug": "nft-artists-guide", "category": "future-vision", "read_time": 15, "summary": "<p>NFT-революция изменила арт-индустрию навсегда.</p>", "published_at": "2025-10-13T09:15:00Z"},
    {"title": "Подкасты в 2025: оборудование и софт", "subtitle": "Что нужно для профессионального звука", "slug": "podcast-equipment-2025", "category": "editorial-work", "read_time": 10, "summary": "<p>Качество звука — главный фактор успеха подкаста.</p>", "published_at": "2025-10-12T16:45:00Z"},
    {"title": "Email-маркетинг: построение базы подписчиков", "subtitle": "От 0 до 10 000 лояльных читателей", "slug": "email-marketing-growth", "category": "attention-economy", "read_time": 9, "summary": "<p>Email остаётся самым ROI-эффективным каналом маркетинга.</p>", "published_at": "2025-10-11T11:20:00Z"},
    {"title": "Notion для продуктивности: полный гайд", "subtitle": "Как организовать свою жизнь и проекты", "slug": "notion-productivity-guide", "category": "ai-automation", "read_time": 11, "summary": "<p>Notion — это not-only-заметки, но и полноценная операционная система для личной продуктивности.</p>", "published_at": "2025-10-10T08:00:00Z"},
    {"title": "Figma для веб-дизайнеров", "subtitle": "От прототипа до передачи в разработку", "slug": "figma-web-designers", "category": "ui-ux-design", "read_time": 13, "summary": "<p>Figma стала индустриальным стандартом для UI/UX дизайна.</p>", "published_at": "2025-10-09T13:30:00Z"},
    {"title": "Instagram Reels: алгоритм 2025", "subtitle": "Как попасть в рекомендации", "slug": "instagram-reels-algorithm", "category": "attention-economy", "read_time": 7, "summary": "<p>Алгоритм Instagram Reels постоянно меняется.</p>", "published_at": "2025-10-08T15:15:00Z"},
    {"title": "Пассивный доход на онлайн-курсах", "subtitle": "Платформы, цены и маркетинг", "slug": "online-courses-passive-income", "category": "future-vision", "read_time": 14, "summary": "<p>Создание онлайн-курса — один из лучших способов монетизации экспертности.</p>", "published_at": "2025-10-07T10:45:00Z"},
    {"title": "Фриланс vs. Продуктовый бизнес", "subtitle": "Когда пора переходить от услуг к продуктам", "slug": "freelance-vs-product-business", "category": "ai-automation", "read_time": 10, "summary": "<p>Фриланс даёт быстрые деньги, но ограничивает масштабирование.</p>", "published_at": "2025-10-06T12:00:00Z"},
    {"title": "TikTok для бизнеса: органический охват", "subtitle": "Без рекламы и накруток", "slug": "tiktok-organic-reach", "category": "attention-economy", "read_time": 8, "summary": "<p>TikTok — единственная платформа где можно набрать миллионы просмотров органически.</p>", "published_at": "2025-10-05T09:30:00Z"},
    {"title": "API интеграции для автоматизации", "subtitle": "Zapier, Make, n8n — что выбрать?", "slug": "api-automation-tools", "category": "ai-automation", "read_time": 12, "summary": "<p>Автоматизация рутинных задач экономит десятки часов в месяц.</p>", "published_at": "2025-10-04T14:20:00Z"},
    {"title": "Копирайтинг для соцсетей", "subtitle": "Формулы для вирусных постов", "slug": "copywriting-social-media", "category": "attention-economy", "read_time": 9, "summary": "<p>Хороший текст может увеличить вовлечённость в 5-10 раз.</p>", "published_at": "2025-10-03T11:15:00Z"},
    {"title": "Блог на Ghost vs WordPress", "subtitle": "Технический сравнительный анализ", "slug": "ghost-vs-wordpress-blog", "category": "editorial-work", "read_time": 11, "summary": "<p>WordPress — мощный, но сложный. Ghost — минималистичный и быстрый.</p>", "published_at": "2025-10-02T16:00:00Z"},
    {"title": "Личный бренд в LinkedIn", "subtitle": "Стратегия для B2B-специалистов", "slug": "linkedin-personal-brand", "category": "attention-economy", "read_time": 10, "summary": "<p>LinkedIn — главная площадка для нетворкинга и поиска клиентов в B2B-сегменте.</p>", "published_at": "2025-10-01T08:45:00Z"},
    {"title": "Midjourney для контент-мейкеров", "subtitle": "Создание визуалов с помощью AI", "slug": "midjourney-content-creators", "category": "ai-automation", "read_time": 13, "summary": "<p>Midjourney генерирует изображения профессионального уровня за секунды.</p>", "published_at": "2025-09-30T13:00:00Z"},
    {"title": "SEO в 2025: что изменилось", "subtitle": "Новые правила ранжирования Google", "slug": "seo-2025-changes", "category": "attention-economy", "read_time": 15, "summary": "<p>Google постоянно обновляет алгоритмы.</p>", "published_at": "2025-09-29T10:30:00Z"},
    {"title": "Notion AI: автоматизация контента", "subtitle": "От идеи до готовой статьи за минуты", "slug": "notion-ai-content-automation", "category": "ai-automation", "read_time": 8, "summary": "<p>Notion AI помогает писать быстрее без потери качества.</p>", "published_at": "2025-09-28T15:45:00Z"},
    {"title": "Twitch стриминг: оборудование и настройка", "subtitle": "Гайд для начинающих стримеров", "slug": "twitch-streaming-setup", "category": "attention-economy", "read_time": 12, "summary": "<p>Стриминг — это не только игры.</p>", "published_at": "2025-09-27T12:15:00Z"},
    {"title": "Дропшиппинг без вложений", "subtitle": "Реальные стратегии и подводные камни", "slug": "dropshipping-no-budget", "category": "future-vision", "read_time": 14, "summary": "<p>Можно ли начать дропшиппинг без бюджета?</p>", "published_at": "2025-09-26T09:00:00Z"},
    {"title": "ChatGPT для блоггеров", "subtitle": "30 промптов для ежедневного использования", "slug": "chatgpt-bloggers-prompts", "category": "ai-automation", "read_time": 9, "summary": "<p>ChatGPT — ассистент который никогда не устаёт.</p>", "published_at": "2025-09-25T14:30:00Z"},
    {"title": "GitHub Copilot: стоит ли платить?", "subtitle": "Честный обзор от разработчика", "slug": "github-copilot-review", "category": "ai-automation", "read_time": 11, "summary": "<p>GitHub Copilot обещает ускорить разработку в 2-3 раза.</p>", "published_at": "2025-09-24T11:45:00Z"},
    {"title": "Substack vs Medium: где писать в 2025", "subtitle": "Монетизация и аудитория", "slug": "substack-vs-medium-2025", "category": "editorial-work", "read_time": 10, "summary": "<p>Две главные платформы для независимых авторов.</p>", "published_at": "2025-09-23T08:20:00Z"},
    {"title": "Pinterest для бизнеса: трафик на сайт", "subtitle": "Бесплатный источник целевых посетителей", "slug": "pinterest-website-traffic", "category": "attention-economy", "read_time": 12, "summary": "<p>Pinterest часто недооценивают, но он генерирует огромный трафик.</p>", "published_at": "2025-09-22T16:00:00Z"},
    {"title": "Obsidian: знания как граф", "subtitle": "Система персонального управления знаниями", "slug": "obsidian-knowledge-management", "category": "ai-automation", "read_time": 13, "summary": "<p>Obsidian превращает заметки в связанную сеть идей.</p>", "published_at": "2025-09-21T13:15:00Z"},
    {"title": "Gumroad: продажа цифровых продуктов", "subtitle": "От электронных книг до софта", "slug": "gumroad-digital-products", "category": "future-vision", "read_time": 9, "summary": "<p>Gumroad — платформа для инди-создателей.</p>", "published_at": "2025-09-20T10:00:00Z"},
    {"title": "Discord сообщества: монетизация", "subtitle": "Платные каналы и эксклюзивный контент", "slug": "discord-community-monetization", "category": "attention-economy", "read_time": 11, "summary": "<p>Discord эволюционировал от игровой платформы до мощного инструмента для построения комьюнити.</p>", "published_at": "2025-09-19T15:30:00Z"},
    {"title": "Tailwind CSS: быстрая вёрстка", "subtitle": "Utility-first подход в действии", "slug": "tailwind-css-fast-development", "category": "ui-ux-design", "read_time": 10, "summary": "<p>Tailwind CSS ускоряет разработку интерфейсов в 2-3 раза.</p>", "published_at": "2025-09-18T12:45:00Z"},
    {"title": "Patreon: поддержка от фанатов", "subtitle": "Модель подписки для креативных проектов", "slug": "patreon-creator-guide", "category": "future-vision", "read_time": 12, "summary": "<p>Patreon позволяет фанатам напрямую поддерживать любимых авторов.</p>", "published_at": "2025-09-17T09:30:00Z"},
    {"title": "Vercel vs Netlify: хостинг для фронтенда", "subtitle": "Сравнение CI/CD и производительности", "slug": "vercel-vs-netlify-hosting", "category": "ui-ux-design", "read_time": 13, "summary": "<p>Vercel и Netlify — лидеры в Jamstack-хостинге.</p>", "published_at": "2025-09-16T14:00:00Z"},
    {"title": "Canva Pro: дизайн без дизайнера", "subtitle": "Шаблоны и инструменты для всех", "slug": "canva-pro-design-guide", "category": "ui-ux-design", "read_time": 8, "summary": "<p>Canva демократизировала дизайн.</p>", "published_at": "2025-09-15T11:15:00Z"},
    {"title": "Webflow: сайты без кода", "subtitle": "Визуальная разработка на профессиональном уровне", "slug": "webflow-no-code-websites", "category": "ui-ux-design", "read_time": 14, "summary": "<p>Webflow — это не конструктор, а полноценный инструмент для создания кастомных сайтов.</p>", "published_at": "2025-09-14T16:30:00Z"},
]


def _parse_dt(s: str) -> datetime:
    return datetime.fromisoformat(s.replace("Z", "+00:00"))


def seed(db: Session) -> None:
    # --- Check if already seeded ---
    if db.query(Category).first():
        print("Database already seeded, skipping.")
        return

    # --- Users ---
    author = User(
        id=uuid.uuid4(),
        name="Николай Егоров",
        email="nikolay@profitableweb.ru",
        avatar="/imgs/author/avatar.jpg",
        role=UserRole.AUTHOR,
    )
    db.add(author)

    comment_users: dict[str, User] = {}
    for uid, name in [
        ("u-1", "Алексей"),
        ("u-2", "Мария"),
        ("u-3", "Ольга"),
        ("u-4", "Дмитрий"),
        ("u-5", "Николай"),
        ("u-6", "Игорь"),
    ]:
        u = User(
            id=uuid.uuid5(uuid.NAMESPACE_DNS, uid),
            name=name,
            email=f"{uid}@profitableweb.ru",
            role=UserRole.VIEWER,
        )
        db.add(u)
        comment_users[uid] = u

    db.flush()

    # --- Categories ---
    cat_map: dict[str, Category] = {}
    for c in CATEGORIES:
        cat = Category(**c)
        db.add(cat)
        cat_map[c["slug"]] = cat
    db.flush()

    # --- Articles ---
    article_map: dict[str, Article] = {}
    for a in ARTICLES:
        cat = cat_map[a["category"]]
        art = Article(
            title=a["title"],
            slug=a["slug"],
            subtitle=a.get("subtitle", ""),
            content="",
            excerpt=a.get("subtitle", ""),
            summary=a.get("summary"),
            category_id=cat.id,
            author_id=author.id,
            reading_time=a.get("read_time"),
            layout=ArticleLayout.THREE_COLUMN,
            status=ArticleStatus.PUBLISHED,
            published_at=_parse_dt(a["published_at"]),
        )
        db.add(art)
        article_map[a["slug"]] = art
    db.flush()

    # --- One-column article for comments ---
    one_col = Article(
        title="Пример одноколоночной статьи",
        slug="one-column-article",
        subtitle="Демо-статья для одноколоночного макета",
        content="<p>Содержимое одноколоночной статьи.</p>",
        excerpt="Демо-статья для одноколоночного макета",
        category_id=cat_map["ai-automation"].id,
        author_id=author.id,
        layout=ArticleLayout.ONE_COLUMN,
        status=ArticleStatus.PUBLISHED,
        published_at=_parse_dt("2025-01-20T10:00:00Z"),
    )
    db.add(one_col)
    db.flush()
    article_map["one-column-article"] = one_col

    # --- Comments on one-column-article ---
    comment_data: list[dict[str, Any]] = [
        {"uid": "u-1", "content": "Статья полезная, но хотелось бы больше примеров по разделу X.", "dt": "2025-01-20T12:00:00Z", "parent": None},
        {"uid": "u-2", "content": "Согласна с предыдущим оратором. Ещё вопрос: поддерживается ли Y в текущей версии?", "dt": "2025-01-20T13:00:00Z", "parent": None},
        {"uid": "u-3", "content": "Да, с версии 2.1.", "dt": "2025-01-20T13:30:00Z", "parent": 1},
        {"uid": "u-4", "content": "Документация здесь: …", "dt": "2025-01-20T14:00:00Z", "parent": 1},
        {"uid": "u-2", "content": "Спасибо!", "dt": "2025-01-20T14:15:00Z", "parent": 1},
        {"uid": "u-5", "content": "Добавлю в статью ссылку.", "dt": "2025-01-20T14:30:00Z", "parent": 1},
        {"uid": "u-3", "content": "Отлично, буду ждать.", "dt": "2025-01-20T15:00:00Z", "parent": 1},
        {"uid": "u-6", "content": "Спасибо за материал.", "dt": "2025-01-20T16:00:00Z", "parent": None},
    ]

    created_comments: list[Comment] = []
    for cd in comment_data:
        parent_id = None
        if cd["parent"] is not None:
            parent_id = created_comments[cd["parent"]].id

        comment_obj = Comment(
            content=cd["content"],
            user_id=comment_users[cd["uid"]].id,
            article_id=one_col.id,
            parent_id=parent_id,
        )
        db.add(comment_obj)
        db.flush()
        created_comments.append(comment_obj)

    # --- User comments (Николай Егоров) ---
    user_comment_slugs = [
        ("ai-assistants-2025", "ИИ-ассистенты в 2025: эволюция возможностей"),
        ("future-of-work", "Будущий труд: как автоматизация изменит рынок"),
        ("prompt-engineering-guide", "Руководство по prompt engineering"),
        ("llm-architecture", "Архитектура больших языковых моделей"),
        ("ai-ethics", "Этика искусственного интеллекта"),
    ]
    user_comments_content = [
        "Отличная статья! Особенно понравилась концепция автоматизации рутинных задач.",
        "Интересный взгляд на проблему автоматизации.",
        "Практические примеры очень полезны!",
        "Наконец-то понятное объяснение attention mechanism!",
        "Важная тема. Особенно согласен с пунктом про прозрачность алгоритмов.",
    ]
    user_comments_dates = [
        "2025-01-20T14:30:00Z",
        "2025-01-19T10:15:00Z",
        "2025-01-18T16:45:00Z",
        "2025-01-15T09:20:00Z",
        "2025-01-10T12:00:00Z",
    ]

    nikolay_user = User(
        id=uuid.uuid5(uuid.NAMESPACE_DNS, "user-1"),
        name="Николай Егоров (читатель)",
        email="nikolay-reader@profitableweb.ru",
        avatar="/imgs/author/avatar.jpg",
        role=UserRole.VIEWER,
    )
    db.add(nikolay_user)
    db.flush()

    for i, (slug, title) in enumerate(user_comment_slugs):
        # Create stub articles for user comments if they don't exist
        if slug not in article_map:
            stub_article = Article(
                title=title,
                slug=slug,
                subtitle="",
                content="",
                excerpt=title,
                category_id=cat_map["ai-automation"].id,
                author_id=author.id,
                status=ArticleStatus.PUBLISHED,
                published_at=_parse_dt(user_comments_dates[i]),
            )
            db.add(stub_article)
            db.flush()
            article_map[slug] = stub_article

        user_comment = Comment(
            content=user_comments_content[i],
            user_id=nikolay_user.id,
            article_id=article_map[slug].id,
        )
        db.add(user_comment)

    db.commit()
    print(f"Seeded: {len(CATEGORIES)} categories, {len(article_map)} articles, {len(created_comments) + 5} comments")


def main() -> None:
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    try:
        seed(db)
    finally:
        db.close()


if __name__ == "__main__":
    main()
