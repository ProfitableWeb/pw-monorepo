# GitHub Copilot — ProfitableWeb

ProfitableWeb — Turborepo-монорепо: `apps/web` (Next.js 16, SCSS-модули), `apps/admin` (Vite + React + Tailwind +
Radix + Zustand), `apps/api` (FastAPI + SQLAlchemy + PostgreSQL), `packages/types` (общие TS-типы).

**Источник правды для агентного контекста — `AGENTS.md` в корне репозитория.** Там описаны стек, команды, переносимые
правила (формат коммитов, создание задач, язык документации, API-конвенции) и карта остального агентного контекста.

Дополнительно:

- `.cursor/rules/*.mdc` — granular-правила Cursor с `globs` (используются как справочный источник)
- `.claude/CLAUDE.md` — обзор для Claude Code
- `apps/*/CLAUDE.md` — nested-контекст конкретного app
- `docs/agentic-development.md` — принципы работы агента, context headers
- `docs/architecture/decisions/ADR-004-agent-rules-portability.md` — архитектура агентных правил

## Кратко по правилам

- Коммиты: `type(PW-XXXX): описание на русском` (`feat`/`fix`/`docs`/`refactor`/`perf`/`test`/`chore`/`ci`), без
  `Co-Authored-By:`.
- Документация, задачи, UI — на русском; код, команды, идентификаторы — без перевода.
- Фронтенд `api-client.ts` авто-маппит snake_case → camelCase, не дублировать вручную.
- Backend синхронный (SQLAlchemy + psycopg2), не предлагать `async`/`await` в сервисах без явной задачи.
