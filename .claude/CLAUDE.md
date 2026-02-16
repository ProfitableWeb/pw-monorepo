# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

ProfitableWeb is a **Turborepo monorepo** — a research blog about AI-automated labor transformation.

- `apps/web` — Next.js 15 frontend (App Router, React 19, SCSS modules)
- `apps/admin` — Vite SPA admin panel (React 19, Radix UI, Tailwind CSS)
- `apps/api` — FastAPI Python backend (sync SQLAlchemy, PostgreSQL)
- `packages/types` — Shared TypeScript types (`@profitable-web/types`)

**Package managers**: Bun (>=1.2.17) for JavaScript, uv for Python

## Common Commands

### Monorepo (from root)

```bash
bun turbo dev                                  # Run all apps
bun turbo dev --filter=@profitable-web/web     # Web only (port 3000)
bun turbo dev --filter=@profitable-web/admin   # Admin only (port 3001)
bun turbo dev --filter=@profitable-web/api     # API only (port 8000)
bun turbo build                                # Build all
bun turbo lint                                 # Lint all
bun turbo type-check                           # Type-check all
bun turbo test                                 # Test all
bun run format                                 # Prettier format
```

### Frontend (apps/web)

```bash
bun --cwd apps/web run lint:fix       # Auto-fix lint issues
bun --cwd apps/web run test           # Run Vitest
bun --cwd apps/web run test:coverage  # Coverage report
bun --cwd apps/web run test:watch     # Watch mode
```

### Backend (apps/api)

```bash
cd apps/api
uv sync                                # Install dependencies
uv run pytest                          # All tests
uv run pytest tests/test_specific.py   # Single test file
uv run ruff check                      # Lint
uv run ruff check --fix                # Auto-fix lint
uv run mypy .                          # Type check
uv run alembic upgrade head            # Apply migrations
uv run alembic revision --autogenerate -m "description"  # Create migration
```

## Architecture

### apps/web — Next.js 15

**Routing**: Single dynamic route `[slug]/page.tsx` resolves content type by priority: static pages → categories
(`getCategoryBySlug`) → articles (`getArticleBySlug`) → 404.

**Styling**: SCSS modules only (`component.module.scss`). Theme system in `styles/themes/{light,dark}/` with
component-level overrides. Utility mixins in `styles/utils/`. No Tailwind, no CSS-in-JS.

**State**: TanStack React Query for server state. React Context for auth (`contexts/auth/AuthContext.tsx`) and theme
(`contexts/ThemeContext.tsx`). Query key factories in `lib/query-keys.ts`.

**Provider stack** (in `components/providers/Providers.tsx`): QueryProvider → ThemeProvider → AuthProvider →
ToastProvider.

**API client** (`lib/api-client.ts`): Fetch wrapper with `credentials: 'include'` for httpOnly cookies. Automatic
snake_case→camelCase mapping of API responses. Auto-refresh on 401 (one retry via `authRefresh()`). SSR uses absolute
URL (`http://localhost:8000/api`), client uses relative `/api` (nginx proxy).

**SEO**: `generateMetadata()` + JSON-LD structured data in every content page. Helpers in `utils/seo.ts`.

### apps/admin — Vite SPA

**Different stack from web**: Vite (not Next.js), Tailwind CSS (not SCSS), Radix UI components, Zustand stores (not
React Context).

**Routing**: Client-side via Zustand `navigation-store.ts` (no file-based routing). Base path: `/admin/`.

**Auth store**: `store/auth-store.ts` — `useAuthStore` with login, logout, checkAuth, OAuth.

**API client**: Same pattern as web (`lib/api-client.ts`) but uses `import.meta.env.VITE_API_URL`.

### apps/api — FastAPI

**Database**: Sync PostgreSQL via SQLAlchemy 2.0 + psycopg2 (deliberate choice, not async). UUID primary keys.
`TimestampMixin` for created_at/updated_at.

**Service layer pattern**: Routers (`api/`) → Services (`services/`) → Models (`models/`). Pydantic schemas in
`schemas/` (snake_case).

**Auth**: JWT access token (15min, Path=/api) + refresh token (7d, Path=/api/auth) in httpOnly cookies. OAuth: Yandex,
Google, Telegram Login Widget. FastAPI dependencies: `get_current_user`, `get_current_admin`, `get_optional_user` in
`auth/dependencies.py`.

**User roles**: admin, editor, author, viewer.

**File storage**: Local disk uploads served by nginx. Service abstraction in `services/storage.py`.

**Migrations**: Alembic, auto-applied on deploy via CI/CD.

### Deployment

nginx :80 proxies to: web :3000 (Next.js SSR), admin :3001 (Vite), api :8000 (uvicorn), uploads/ (static). PM2 manages
all processes (`ecosystem.config.js`). Cloud.ru VM, CI/CD via GitHub Actions.

## Git Workflow

**Dual repository**: GitVerse (`origin`, primary) + GitHub (`github`, mirror).

```bash
git push            # GitVerse only
git push github     # GitHub only
git pushall         # Both (custom alias)
```

**Commit format** (REQUIRED): `type(PW-XXXX): описание на русском`

- Task number must exist in `docs/tasks/`
- Types: `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `chore`, `ci`
- **НЕ добавлять** `Co-Authored-By:` или другие строки авторства

**Pre-commit hooks**: Husky runs lint-staged — `apps/web` files get lint:fix + prettier + type-check, `apps/admin` gets
prettier only.

## Content Language

Primary language is **Russian**. All user-facing text, commit messages, and documentation in Russian unless technical
terms require English.

## Key Files

- `apps/web/src/app/[slug]/page.tsx` — Unified dynamic route handler
- `apps/web/src/lib/api-client.ts` — Frontend API client (fetch wrapper, auth refresh, snake→camel)
- `apps/web/src/contexts/auth/AuthContext.tsx` — Auth context with OAuth support
- `apps/web/src/styles/themes/` — Light/dark SCSS theme definitions
- `apps/api/src/core/config.py` — Backend settings (Pydantic Settings from .env)
- `apps/api/src/auth/` — JWT, OAuth providers, FastAPI auth dependencies
- `packages/types/` — Shared TypeScript types for both frontends
- `docs/architecture/decisions/` — ADRs (database, auth, file storage)
- `docs/architecture/runbooks/` — Operational guides (deploy, db-sync, promote-admin)
