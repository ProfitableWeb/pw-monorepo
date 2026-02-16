# Архитектура ProfitableWeb

Исследовательский блог о трансформации труда через AI-автоматизацию.

## Обзор системы

```
                        nginx (:80/:443)
                             │
              ┌──────────────┼──────────────┐
              │              │              │
         web :3000      admin :3001     api :8000
        (Next.js 15)   (Next.js 15)   (FastAPI)
              │              │              │
              └──────────────┴──────┬───────┘
                                    │
                             PostgreSQL :5432
```

**VM**: Cloud.ru, `213.171.25.187` **Процесс-менеджер**: PM2 (`ecosystem.config.js`) **Reverse proxy**: nginx **CI/CD**:
GitVerse Workflows

## Приложения

| Приложение   | Порт | Стек                       | Описание                 |
| ------------ | ---- | -------------------------- | ------------------------ |
| `apps/web`   | 3000 | Next.js 15, React 19, SCSS | Публичный блог           |
| `apps/admin` | 3001 | Next.js 15                 | Панель администрирования |
| `apps/api`   | 8000 | FastAPI, SQLAlchemy 2.0    | REST API                 |

## Навигация

### [Решения (ADR)](./decisions/)

- [TEMPLATE](./decisions/TEMPLATE.md) — шаблон для новых решений
- [ADR-001: База данных](./decisions/ADR-001-database.md) — PostgreSQL на VM
- [ADR-002: Аутентификация](./decisions/ADR-002-auth.md) — JWT + OAuth
- [ADR-003: Файловое хранилище](./decisions/ADR-003-file-storage.md) — локально на VM (nginx статика), абстракция для S3
  на будущее

### [Инфраструктура](./infrastructure/)

- [Окружения](./infrastructure/environments.md) — local, test, prod
- [Деплой](./infrastructure/deployment.md) — CI/CD через GitVerse
- [Секреты](./infrastructure/secrets.md) — переменные окружения

### [База данных](./database/)

- [Обзор](./database/overview.md) — модели и схема
- [Миграции](./database/migrations.md) — Alembic workflow
- [Синхронизация](./database/sync-strategy.md) — обмен данными между окружениями

### [Аутентификация](./auth/)

- [Обзор](./auth/overview.md) — JWT flow и роли
- [OAuth-провайдеры](./auth/oauth-providers.md) — Yandex, Google, Telegram

### [Runbooks](./runbooks/)

- [Деплой](./runbooks/deploy.md) — ручной и автоматический
- [Синхронизация БД](./runbooks/db-sync.md) — dump/restore/seed
- [Назначение админа](./runbooks/promote-admin.md) — промоушен пользователя
