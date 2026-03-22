# ProfitableWeb — Обзор проекта

## Миссия

Исследовательская платформа, изучающая трансформацию труда через AI-автоматизацию. Создание модели для генерации
финансового капитала из личных компетенций и призвания через исследования, документирование инсайтов и построение
автономной цифровой экосистемы.

## Архитектура

Turborepo-монорепозиторий с тремя приложениями и пакетом общих типов:

| Приложение       | Стек                                       | Порт |
| ---------------- | ------------------------------------------ | ---- |
| `apps/web`       | Next.js 16, React 19, SCSS-модули          | 3000 |
| `apps/admin`     | Vite SPA, React 19, Tailwind CSS, Radix UI | 3001 |
| `apps/api`       | FastAPI, SQLAlchemy 2.0 (sync), PostgreSQL | 8000 |
| `packages/types` | Shared TypeScript types                    | —    |

## Технологический стек

**Frontend (apps/web):**

- Next.js 16 (App Router, React 19)
- SCSS-модули, система тем (светлая/тёмная)
- TanStack React Query, React Context (auth, theme)
- Shiki (подсветка синтаксиса), Framer Motion (анимации)

**Admin Panel (apps/admin):**

- Vite SPA, React 19, TypeScript
- Tailwind CSS, Radix UI, Zustand
- TipTap (WYSIWYG-редактор), Monaco Editor
- react-resizable-panels (docking workspace)

**Backend (apps/api):**

- FastAPI, Python 3.11+
- SQLAlchemy 2.0 (синхронный, psycopg2), PostgreSQL
- JWT + OAuth (Яндекс, Google, Telegram)
- Alembic (миграции), structlog (логирование)
- MCP-сервер для AI-интеграций

**DevOps:**

- Turborepo + Bun Workspaces
- PM2 (process manager), nginx (reverse proxy)
- GitHub Actions (CI/CD), Cloud.ru (VM hosting)
- GitVerse (основной) + GitHub (зеркало)

## Пакетные менеджеры

- **Bun** (>=1.2.17) — JavaScript/TypeScript
- **uv** — Python
