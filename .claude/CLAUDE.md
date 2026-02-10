# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

ProfitableWeb is a **Turborepo monorepo** with three applications:

- `apps/web` - Next.js 15 frontend (research blog about AI-automated labor transformation)
- `apps/admin` - Next.js 15 admin panel
- `apps/api` - FastAPI Python backend

**Package Manager**: Bun (>=1.2.17) for JavaScript, uv for Python

## Common Commands

### Development

```bash
# Run all applications
bun turbo dev

# Run specific app only
bun turbo dev --filter=@profitable-web/web
bun turbo dev --filter=@profitable-web/admin
bun turbo dev --filter=@profitable-web/api
```

### Build & Quality

```bash
bun turbo build          # Build all apps
bun turbo lint           # Lint all apps
bun turbo type-check     # Type check all apps
bun turbo test           # Run all tests
bun run format           # Format with Prettier
```

### Frontend-specific (apps/web)

```bash
bun run dev              # Start Next.js dev server (port 3000)
bun run build            # Production build
bun run lint:fix         # Auto-fix lint issues
bun run type-check       # TypeScript check without emit
bun run test:ui          # Vitest UI
bun run test:coverage    # Coverage report
bun run test:watch       # Watch mode
```

### Backend-specific (apps/api)

```bash
cd apps/api
uv sync                  # Install Python dependencies
uv run pytest            # Run all tests
uv run pytest tests/test_specific.py  # Run single test file
uv run ruff check        # Lint
uv run ruff check --fix  # Auto-fix lint issues
uv run mypy .            # Type check
```

## Architecture

### Monorepo Structure

- **Turborepo** orchestrates builds with dependency awareness
- **Bun Workspaces** links packages (e.g., `@profitable-web/types`)
- Shared types in `packages/types/` used by both frontends

### Frontend (apps/web)

#### Tech Stack

- Next.js 15 with App Router (React 19)
- TypeScript (strict mode)
- SCSS modules (NO UI framework - clean CSS only)
- TanStack React Query for server state
- Zustand for client state
- Framer Motion for animations

#### Routing Architecture

**Single dynamic route** `[slug]/page.tsx` handles multiple content types:

1. Static pages (about, contact, etc.) - handled by Next.js automatically
2. Categories - checked first via `getCategoryBySlug()`
3. Articles - checked second via `getArticleBySlug()`
4. 404 fallback

#### Component Organization

```
src/components/
├── app-layout/     # Page layouts (ArticlePage, CategoryPage)
├── common/         # Reusable UI components (Button, Card, Modal)
└── providers/      # Context providers (Auth, Theme)
```

#### CSS Architecture

- **SCSS modules** only - import styles as `import styles from './component.module.scss'`
- **Theme system**: `styles/themes/{light,dark}/` with separate files for buttons, cards, forms, etc.
- **Utility mixins**: `styles/utils/` for animations, breakpoints, colors, spacing, typography
- No Tailwind, no CSS-in-JS

#### State Management

- **Server State**: TanStack React Query
- **Client State**: Zustand stores
- **Auth/Theme**: React Context with localStorage persistence

### Backend (apps/api)

- **FastAPI** with async/await
- **SQLAlchemy 2.0** with async support
- **Pydantic** for validation
- **Alembic** for migrations
- **Python 3.11+** required

## Mock-First Development

The frontend uses mock data for development (`src/lib/mock-api.ts`). API calls return simulated data, allowing frontend
work without backend dependency. Real API integration happens later by replacing mock implementations.

## SEO Architecture

All content pages use unified SEO pattern:

- Dynamic metadata via `generateMetadata()` in page files
- JSON-LD structured data (Category, Article, Breadcrumb schemas)
- OpenGraph and Twitter cards
- Helper functions in `src/utils/seo.ts`

## Type Safety

- **Strict TypeScript** enabled in all frontend apps
- Shared types package: `@profitable-web/types`
- Python uses type hints with mypy enforcement
- All API contracts should be typed in shared package

## Git Workflow

**Dual repository hosting**:

- Primary: GitVerse (`origin`)
- Secondary: GitHub (`github`)

```bash
git push          # Push to GitVerse only
git push github   # Push to GitHub only
git pushall       # Push to both (custom alias)
```

**Commit message format** (REQUIRED):

- Format: `type(PW-XXXX): subject` (на русском языке)
- Task number `(PW-XXXX)` must exist in `docs/tasks/`
- Types: `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `chore`, `ci`
- Subject: lowercase, imperative mood, in Russian
- **НЕ добавлять** `Co-Authored-By:` или другие строки авторства

Examples:

- ✅ `feat(PW-011): рефакторинг и оптимизация`
- ✅ `fix(PW-016): исправление высоты инпута`
- ❌ `feat: add component` (missing task number)
- ❌ `feat(PW-016): add input component` (not in Russian)
- ❌ `feat(PW-016): описание\n\nCo-Authored-By: ...` (no authorship lines)

## Testing

- **Frontend**: Vitest + Testing Library
- **Backend**: pytest + httpx for async tests
- Tests located in `__tests__/` directories or `*.test.ts` files
- Run coverage reports with `bun run test:coverage`

## Content Language

Primary content language is **Russian**. All user-facing text, comments, and documentation should be in Russian unless
technical terms require English.

## Key Files

- `turbo.json` - Turborepo task configuration
- `apps/web/src/app/[slug]/page.tsx` - Unified dynamic route handler (categories + articles + 404)
- `apps/web/src/lib/mock-api.ts` - Mock data layer for frontend-first development
- `apps/web/src/utils/seo.ts` - JSON-LD structured data generators
- `apps/web/src/styles/themes/` - Light/dark theme definitions
- `packages/types/` - Shared TypeScript types
