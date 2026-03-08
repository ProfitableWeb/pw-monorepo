# CLAUDE.md

Инструкции для Claude Code при работе с кодовой базой этого репозитория.

## Обзор проекта

ProfitableWeb — **Turborepo-монорепо**, исследовательский блог о трансформации труда через ИИ-автоматизацию.

- `apps/web` — Next.js 15 фронтенд (App Router, React 19, SCSS-модули)
- `apps/admin` — Vite SPA админ-панель (React 19, Radix UI, Tailwind CSS)
- `apps/api` — FastAPI Python бэкенд (синхронный SQLAlchemy, PostgreSQL)
- `packages/types` — Общие TypeScript-типы (`@profitable-web/types`)

**Пакетные менеджеры**: Bun (>=1.2.17) для JavaScript, uv для Python

## Основные команды

### Монорепо (из корня)

```bash
bun turbo dev                                  # Запуск всех приложений
bun turbo dev --filter=@profitable-web/web     # Только web (порт 3000)
bun turbo dev --filter=@profitable-web/admin   # Только admin (порт 3001)
bun turbo dev --filter=@profitable-web/api     # Только api (порт 8000)
bun turbo build                                # Сборка всех
bun turbo lint                                 # Линтинг всех
bun turbo type-check                           # Проверка типов всех
bun turbo test                                 # Тесты всех
bun run format                                 # Prettier-форматирование
```

### Фронтенд (apps/web)

```bash
bun --cwd apps/web run lint:fix       # Автоисправление линтера
bun --cwd apps/web run test           # Запуск Vitest
bun --cwd apps/web run test:coverage  # Отчёт покрытия
bun --cwd apps/web run test:watch     # Watch-режим
```

### Бэкенд (apps/api)

```bash
cd apps/api
uv sync                                # Установка зависимостей
uv run pytest                          # Все тесты
uv run pytest tests/test_specific.py   # Один файл тестов
uv run ruff check                      # Линтинг
uv run ruff check --fix                # Автоисправление линтера
uv run mypy .                          # Проверка типов
uv run alembic upgrade head            # Применить миграции
uv run alembic revision --autogenerate -m "описание"  # Создать миграцию
```

## Архитектура

### apps/web — Next.js 15

**Роутинг**: единый динамический маршрут `[slug]/page.tsx` определяет тип контента по приоритету: статические страницы →
категории (`getCategoryBySlug`) → статьи (`getArticleBySlug`) → 404.

**Стили**: только SCSS-модули (`component.module.scss`). Система тем в `styles/themes/{light,dark}/` с переопределениями
на уровне компонентов. Миксины в `styles/utils/`. Без Tailwind, без CSS-in-JS.

**Состояние**: TanStack React Query для серверного состояния. React Context для авторизации
(`contexts/auth/AuthContext.tsx`) и темы (`contexts/ThemeContext.tsx`). Фабрики ключей запросов в `lib/query-keys.ts`.

**Стек провайдеров** (`components/providers/Providers.tsx`): QueryProvider → ThemeProvider → AuthProvider →
ToastProvider.

**API-клиент** (`lib/api-client.ts`): обёртка над fetch с `credentials: 'include'` для httpOnly-кук. Автоматический
маппинг snake_case → camelCase ответов API. Авто-рефреш при 401 (одна повторная попытка через `authRefresh()`). SSR
использует абсолютный URL (`http://localhost:8000/api`), клиент — относительный `/api` (через nginx-прокси).

**SEO**: `generateMetadata()` + JSON-LD структурированные данные на каждой контентной странице. Хелперы в
`utils/seo.ts`.

### apps/admin — Vite SPA

**Отличается от web по стеку**: Vite (не Next.js), Tailwind CSS (не SCSS), компоненты Radix UI, Zustand-сторы (не React
Context).

**Роутинг**: клиентский через Zustand `navigation-store.ts` (без файлового роутинга). Базовый путь: `/admin/`.

**Стор авторизации**: `store/auth-store.ts` — `useAuthStore` с login, logout, checkAuth, OAuth.

**API-клиент**: тот же паттерн, что и в web (`lib/api-client.ts`), но использует `import.meta.env.VITE_API_URL`.

**Организация кода**: подробные правила в `apps/admin/CLAUDE.md` — структура `components/`, атомарная декомпозиция,
иерархия вложенности секций, именование файлов. Эталон паттерна — `sections/ai-center/` (с README.md внутри). Шаблон
README для секций — `docs/templates/section-readme-template.md`.

### apps/api — FastAPI

**База данных**: синхронный PostgreSQL через SQLAlchemy 2.0 + psycopg2 (осознанный выбор, не async). UUID-первичные
ключи. `TimestampMixin` для created_at/updated_at.

**Паттерн сервисного слоя**: роутеры (`api/`) → сервисы (`services/`) → модели (`models/`). Pydantic-схемы в `schemas/`
(snake_case).

**Организация кода — доменные пакеты внутри слоёв**: когда домен разрастается до 3+ файлов, файлы группируются в пакет.
1-2 файла — остаются плоскими. Утилиты, используемые несколькими доменами, остаются в корне слоя.

- `services/articles/` — queries (публичные), admin (CRUD), revisions, reading_time
- `schemas/articles/` — public (ArticleResponse), admin (ArticleCreateRequest, ArticleAdminResponse...)
- `services/slug.py` — общая утилита (статьи + теги), в корне services/
- `models/` — всегда плоский (Alembic auto-discovery через `__init__.py`)

**Авторизация**: JWT access-токен (15 мин, Path=/api) + refresh-токен (7 дней, Path=/api/auth) в httpOnly-куках. OAuth:
Яндекс, Google, Telegram Login Widget. FastAPI-зависимости: `get_current_user`, `get_current_admin`, `get_optional_user`
в `auth/dependencies.py`.

**Роли пользователей**: admin, editor, author, viewer.

**Хранение файлов**: локальный диск, раздача через nginx. Абстракция сервиса в `services/storage.py`.

**Миграции**: Alembic, автоприменение при деплое через CI/CD.

### Деплой

nginx :80 проксирует: web :3000 (Next.js SSR), admin :3001 (Vite), api :8000 (uvicorn), uploads/ (статика). PM2
управляет всеми процессами (`ecosystem.config.js`). Cloud.ru VM, CI/CD через GitHub Actions.

## Git Workflow

**Два репозитория**: GitVerse (`origin`, основной) + GitHub (`github`, зеркало).

```bash
git push            # Только GitVerse
git push github     # Только GitHub
git pushall         # Оба (кастомный алиас)
```

**Формат коммитов** (ОБЯЗАТЕЛЬНО): `type(PW-XXXX): описание на русском`

- Номер задачи должен существовать в `docs/tasks/`
- Типы: `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `chore`, `ci`
- **НЕ добавлять** `Co-Authored-By:` или другие строки авторства

**Pre-commit хуки**: Husky запускает lint-staged — файлы `apps/web` проходят lint:fix + prettier + type-check,
`apps/admin` — только prettier.

## Язык контента

Основной язык — **русский**. Весь пользовательский текст, коммиты и документация на русском, если технические термины не
требуют английского.

## Ключевые файлы

- `apps/web/src/app/[slug]/page.tsx` — единый динамический маршрут
- `apps/web/src/lib/api-client.ts` — API-клиент фронтенда (fetch-обёртка, авто-рефреш, snake→camel)
- `apps/web/src/contexts/auth/AuthContext.tsx` — контекст авторизации с OAuth
- `apps/web/src/styles/themes/` — определения SCSS-тем (светлая/тёмная)
- `apps/api/src/core/config.py` — настройки бэкенда (Pydantic Settings из .env)
- `apps/api/src/auth/` — JWT, OAuth-провайдеры, FastAPI-зависимости авторизации
- `packages/types/` — общие TypeScript-типы для обоих фронтендов
- `docs/architecture/decisions/` — ADR (база данных, авторизация, хранение файлов)
- `docs/architecture/runbooks/` — операционные гайды (деплой, синхронизация БД, назначение админа)
