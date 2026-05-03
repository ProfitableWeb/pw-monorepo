# AGENTS.md — ProfitableWeb

Портативный entrypoint для любого AI-инструмента, поддерживающего `AGENTS.md` (Codex, OpenCode, Aider, Cline, Continue,
Gemini-CLI fallback и т. д.). Здесь — высокосигнальный слой: стек, команды, переносимые правила и ссылки на детали в
tool-specific форматах.

> Cursor читает `.cursor/rules/*.mdc` (granular, с `globs`). Claude Code читает `.claude/CLAUDE.md` и `apps/*/CLAUDE.md`
> (nested). Этот файл — общий знаменатель.

## Проект

ProfitableWeb — Turborepo-монорепо, исследовательский блог о трансформации труда через ИИ-автоматизацию.

- `apps/web` — Next.js 16, App Router, React 19, **SCSS-модули** (без Tailwind, без CSS-in-JS)
- `apps/admin` — Vite SPA, React 19, **Tailwind CSS**, Radix UI, **Zustand** (не Next.js, не SCSS)
- `apps/api` — FastAPI, **синхронный** SQLAlchemy 2.0 + psycopg2, PostgreSQL, Alembic
- `packages/types` — общие TypeScript-типы (`@profitable-web/types`)

Пакетные менеджеры: **Bun ≥ 1.2.17** (JS) и **uv** (Python). MCP-сервер интегрирован в FastAPI на пути `/mcp`.

Подробный архитектурный обзор: `.claude/CLAUDE.md` (раздел «Архитектура»). Решения: `docs/architecture/decisions/`.

## Команды

```bash
# Монорепо (из корня)
bun turbo dev                                  # все приложения
bun turbo dev --filter=@profitable-web/web     # web (3000)
bun turbo dev --filter=@profitable-web/admin   # admin (3001)
bun turbo dev --filter=@profitable-web/api     # api (8000)
bun turbo build | lint | type-check | test
bun run format                                 # Prettier

# Backend (apps/api)
cd apps/api
uv sync
uv run pytest
uv run ruff check --fix
uv run mypy .
uv run alembic upgrade head
uv run alembic revision --autogenerate -m "описание"
```

## Переносимые правила

Эти правила одинаково применимы во всех инструментах. Tool-specific нюансы (например, frontmatter `globs` для Cursor)
живут в соответствующих файлах.

### Git-коммиты

Формат: `type(PW-XXXX): описание на русском` (повелительное наклонение, строчные).

- Типы: `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `chore`, `ci`
- `PW-XXXX` должен существовать в `docs/tasks/`
- **Не добавлять** `Co-Authored-By:` или другие строки авторства
- Два remote: `origin` (GitVerse, основной) + `github` (зеркало). Алиас `git pushall` пушит в оба.

Канонический файл: `.cursor/rules/git-commit-format.mdc`.

### Создание задач

- Путь: `docs/tasks/{год}/{месяц}/PW-XXX/PW-XXX.md`
- Дата в пути и в поле «Создано» — **сегодняшняя**, сверять с системной, не копировать из соседних файлов
- Номер `PW-XXX` — следующий после максимального в `docs/tasks/KANBAN.md` (раздел «Статистика»)
- Шаблон и якорь (прецедент PW-064/065/066/067): `.cursor/rules/task-creation.mdc`

### Язык

- Документация, задачи, коммиты, пользовательский UI — **русский**
- Код, команды, имена файлов, API-поля, технические идентификаторы — не переводить
- Диаграммы — Mermaid, не ASCII-art

### Контекст-хедеры в коде

- Для важных модулей (orchestrators, stores, providers, API clients, query-key factories, MCP tools, сложные hooks,
  backend-сервисы с бизнес-правилами) — короткая шапка-комментарий: роль, границы, связи.
- Не добавлять для UI-примитивов, очевидных utils, автогенерируемого кода.
- Шаблоны: `docs/templates/frontend/context-header.ts.md`, `docs/templates/backend/context-header.py.md`.
- Подробности: `docs/agentic-development.md` и `.cursor/rules/code-context-headers.mdc`.

### API-конвенции

- Backend отдаёт **snake_case** (Pydantic). Фронтенд-`api-client.ts` авто-маппит в **camelCase** на лету — не
  дублировать маппинг вручную в компонентах.
- Авторизация — JWT в httpOnly-куках (access 15 мин, refresh 7 дней). Авто-рефреш встроен в `api-client.ts`.
- Роли: `admin`, `editor`, `author`, `viewer`. Зависимости FastAPI: `get_current_user`, `get_current_admin`,
  `get_optional_user` в `apps/api/src/auth/dependencies.py`.

## Карта агентного контекста

| Слой      | Файл / каталог                    | Кому                | Когда читать                          |
| --------- | --------------------------------- | ------------------- | ------------------------------------- |
| Tier 0    | `AGENTS.md` (этот)                | любой AI-инструмент | всегда (portable вход)                |
| Tier 1    | `.cursor/rules/*.mdc`             | Cursor              | по `globs` или `alwaysApply`          |
| Tier 1    | `.claude/CLAUDE.md`               | Claude Code         | всегда (root entrypoint)              |
| Tier 1    | `.github/copilot-instructions.md` | GitHub Copilot      | всегда (короткий pointer)             |
| Tier 2    | `apps/*/CLAUDE.md`                | Claude Code         | при работе в подпроекте               |
| Reference | `docs/architecture/decisions/`    | все                 | при архитектурных решениях            |
| Reference | `docs/architecture/runbooks/`     | все                 | при операционных задачах              |
| Reference | `docs/agentic-development.md`     | все                 | про сам процесс работы с AI           |
| Reference | `docs/templates/`                 | все                 | при создании README / context headers |

Подробное обоснование структуры: `docs/architecture/decisions/ADR-004-agent-rules-portability.md`.

## Workspace facts

- ProfitableWeb использует **GitVerse `origin`** как основной репозиторий и **GitHub `github`** как зеркало.
- Деплой — Docker на одной VM Cloud.ru, nginx :80 проксирует web :3000, admin :3001, api :8000, uploads/ (статика).
  CI/CD — GitHub Actions.
- Миграции Alembic применяются **автоматически** при деплое (`uv run alembic upgrade head` в workflow).
- MCP-сервер: `.mcp.json` описывает три окружения — `pw-local`, `pw-dev`, `pw-prod`. Авторизация — Bearer-токены
  `pw_mcp_*`, управление через админку или API `/api/admin/mcp-keys`.

## Learned user preferences

- Правила Cursor короткие: один файл — одна тема, ориентир ≤ 50 строк. Если правило растёт — дробить.
- Шаблоны context headers ориентированы и на TypeScript, и на Python — не считать TS единственным случаем.
