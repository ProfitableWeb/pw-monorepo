# ProfitableWeb Frontend

> ⚛️ Next.js 15+ frontend для исследовательского блога по монетизации хобби

## 📋 Обзор

Публичный веб-сайт платформы ProfitableWeb - исследовательского проекта, документирующего insights о генерации
финансового капитала из личных хобби.

## 🛠️ Технологический стек

- **Runtime**: Bun (superior TypeScript support & dev performance)
- **Framework**: Next.js 15+ (App Router)
- **Language**: TypeScript
- **Styling**: SCSS (гибридная методология, чистая разметка)
- **Animations**: Framer Motion (минимально, SEO-friendly)
- **State Management**: React Query + Zustand
- **Testing**: Vitest (unit/component) + Cypress (E2E)
- **Code Quality**: ESLint, Prettier, TypeScript
- **Deployment**: Vercel/Static hosting

## 🚀 Quick Start

```bash
# Установка зависимостей
bun install

# Запуск development сервера
bun run dev

# Сборка для production
bun run build

# Статический экспорт
bun run export

# Тестирование
bun run test              # Запустить тесты
bun run test:watch        # Тесты в watch режиме
bun run test:ui           # UI для тестов
bun run test:coverage     # Покрытие кода

# Проверки кода
bun run lint
bun run type-check
```

## 📁 Структура страниц

```
app/
├── page.tsx                 # Главная страница
├── [slug]/page.tsx          # Статьи (прямо из корня)
├── categories/
│   └── [category]/page.tsx  # Страницы категорий
├── about/page.tsx           # О проекте
└── sitemap.xml              # Автогенерируемая sitemap
```

## 🧑‍🔬 Тестирование

### 🎯 Testing Stack

- **Unit/Component Tests**: Vitest + React Testing Library (fast, jsdom)
- **E2E Tests**: Cypress (real browser, visual testing)
- **Component Testing**: Cypress Component Testing (isolated components)
- **Coverage**: V8 coverage provider + Cypress code coverage
- **UI Testing**: Vitest UI + Cypress Test Runner

### ⚙️ Test Configuration

- **Vitest Setup**: `src/test/setup.ts` + `vitest.config.ts` with path aliases
- **Cypress Setup**: `cypress.config.ts` + support files with custom commands
- **Mocks**: Next.js router/navigation mocks + API mocks
- **Coverage**: HTML + JSON reports for both unit and E2E tests
- **Custom Commands**: ProfitableWeb-specific testing utilities

### 📝 Writing Tests

```typescript
// Component test example
import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import ArticleCard from '@/components/ArticleCard'

describe('ArticleCard', () => {
  it('should render article information', () => {
    const mockArticle = {
      title: 'How to Monetize Photography Hobby',
      excerpt: 'Learn proven strategies...'
    }

    render(<ArticleCard article={mockArticle} />)
    expect(screen.getByText(mockArticle.title)).toBeInTheDocument()
  })
})
```

### 🚀 Testing Commands

```bash
bun run test          # Run all tests
bun run test:watch    # Watch mode for development
bun run test:ui       # Visual test interface
bun run test:coverage # Generate coverage report

# Cypress E2E Testing
bun run cypress       # Open Cypress GUI (interactive)
bun run cypress:run   # Run E2E tests headless
bun run test:e2e      # Build + start + run E2E tests
```

### 🌐 Cypress Browser Testing

**How Cypress Works:**

- 🖥️ Uses your **local browsers** (Chrome, Firefox, Edge, Electron)
- 👀 Opens real browser window for visual testing
- ⚡ Watch tests execute in real-time
- 📸 Automatic screenshots and videos on failures
- 🔗 Network request interception and mocking

**ProfitableWeb Custom Commands:**

```typescript
// SEO validation
cy.checkSEO('Page Title', 'Meta description');
cy.checkJSONLD('Article'); // Validates structured data

// Performance testing
cy.checkPerformance(); // Core Web Vitals validation
cy.waitForPageLoad(); // Wait for complete page load

// Navigation helpers
cy.navigateToArticle('article-slug');
cy.navigateToCategory('category-name');

// API mocking
cy.mockApiResponse('/api/articles', mockData);

// Accessibility checks
cy.checkAccessibility(); // Basic a11y validation
```

## 📱 SEO Features

- **JSON-LD разметка** для AI-агентов
- **Static Site Generation** для статей
- **Meta tags управление**
- **Sitemap автогенерация**
- **Core Web Vitals оптимизация**
- **Semantic HTML структура**

## 🎨 Styling Philosophy

- **Чистая разметка**: Никаких hash-классов, CSS Modules или Tailwind спама
- **Семантические классы**: `article-header`, `nav-primary`, `content-section`
- **SCSS нesting**: Компонентная изоляция через вложенность
- **Гибридная методология**: Короткие семантические классы + utility классы для состояний

### 🎨 SCSS Architecture

```scss
// Пример чистой SCSS архитектуры без модулей
.article {
  &-header {
    margin-bottom: 2rem;

    &.featured {
      border-left: 4px solid var(--accent-color);
    }
  }

  &-content {
    line-height: 1.6;

    &.loading {
      opacity: 0.7;
    }
  }
}

.nav {
  &-primary {
    display: flex;
    gap: 1rem;
  }

  &-link {
    text-decoration: none;

    &:hover {
      color: var(--primary-color);
    }

    &.active {
      font-weight: 600;
    }
  }
}
```

## 🔧 Development

- [Development Plan](./docs/development_plan.md) - План разработки
- [Central Documentation](https://github.com/ProfitableWeb/profitable-web-docs) - Центральная документация проекта

## 🔗 Links

- **Central Docs**: [profitable-web-docs](https://github.com/ProfitableWeb/profitable-web-docs)
- **Backend API**: [profitable-web-backend](https://github.com/ProfitableWeb/profitable-web-backend)
- **Admin Panel**: [profitable-web-admin](https://github.com/ProfitableWeb/profitable-web-admin)
- **Live Site**: [ProfitableWeb.ru](https://profitableweb.ru) (текущий WordPress)

---

_Frontend для исследования монетизации хобби_ 💰
