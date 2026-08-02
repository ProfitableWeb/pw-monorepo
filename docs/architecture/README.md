# Архитектура ProfitableWeb

Исследовательский блог о трансформации труда через AI-автоматизацию.

## Обзор системы

```
                          nginx :80 (хост VM)
                                 │
        ┌────────────────────────┴────────────────────────┐
   profitableweb.ru / IP                          dev.profitableweb.ru
        │                                                  │
   PROD-контур (Docker)                              DEV-контур (Docker)
   web :3000 · api :8000                             web :3100 · api :8100
   admin :3001                                       admin :3101
        │                                                  │
   postgres :5432                                    postgres :5433
```

**VM**: Cloud.ru, `213.171.25.187` **Оркестрация**: Docker Compose (`docker-compose.{prod,dev}.yml`) **Reverse proxy**:
nginx на хосте (только :80, HTTPS пока не настроен) **CI/CD**: GitHub Actions (`deploy.yml` master → prod,
`deploy-dev.yml` develop → dev)

> `docker-compose.infra.yml` (Gitea для self-hosted git-зеркала, `git.profitableweb.ru` → :3300) **описан, но не
> развёрнут** — PW-043-F отложена. Контейнеров Gitea на VM нет, порт 3300 не слушается.

## Приложения

| Приложение   | Порт | Стек                         | Описание                 |
| ------------ | ---- | ---------------------------- | ------------------------ |
| `apps/web`   | 3000 | Next.js 16, React 19, SCSS   | Публичный блог           |
| `apps/admin` | 3001 | Vite SPA, React 19, Tailwind | Панель администрирования |
| `apps/api`   | 8000 | FastAPI, SQLAlchemy 2.0      | REST API + MCP-сервер    |

## Навигация

### [Решения (ADR)](./decisions/)

- [TEMPLATE](./decisions/TEMPLATE.md) — шаблон для новых решений
- [ADR-001: База данных](./decisions/ADR-001-database.md) — PostgreSQL на VM
- [ADR-002: Аутентификация](./decisions/ADR-002-auth.md) — JWT + OAuth
- [ADR-003: Файловое хранилище](./decisions/ADR-003-file-storage.md) — локальный диск или S3 (Cloud.ru), переключение
  через `STORAGE_BACKEND=local|s3`
- [ADR-004: Переносимость агентных правил](./decisions/ADR-004-agent-rules-portability.md) — tiered shared +
  tool-specific модель

### [Инфраструктура](./infrastructure/)

- [Окружения](./infrastructure/environments.md) — local, dev, prod
- [Деплой](./infrastructure/deployment.md) — Docker Compose + GitHub Actions
- [Секреты](./infrastructure/secrets.md) — переменные окружения

### [База данных](./database/)

- [Обзор](./database/overview.md) — модели и схема
- [Миграции](./database/migrations.md) — Alembic workflow
- [Синхронизация](./database/sync-strategy.md) — обмен данными между окружениями

### [Аутентификация](./auth/)

- [Обзор](./auth/overview.md) — JWT flow и роли
- [OAuth-провайдеры](./auth/oauth-providers.md) — Yandex, Telegram

### [Runbooks](./runbooks/)

- [Деплой](./runbooks/deploy.md) — ручной и автоматический
- [Синхронизация БД](./runbooks/db-sync.md) — dump/restore/seed
- [Назначение админа](./runbooks/promote-admin.md) — промоушен пользователя
