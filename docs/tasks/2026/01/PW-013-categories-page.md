# PW-013: Страница рубрик (каталог категорий)

## 📋 Информация о задаче

- **ID**: PW-013
- **Статус**: DONE
- **Создано**: 2026-01-16
- **Завершено**: 2026-01-18
- **Приоритет**: Normal 📋
- **Компонент**: ⚛️ Frontend
- **Теги**: #frontend #rubrics #categories #catalog #nextjs #seo

## 🎯 Постановка задачи

### Описание

Разработать страницу рубрик (`/categories`) — каталог всех категорий проекта. Страница должна отображать все доступные
категории в удобном формате с возможностью перехода на страницу каждой категории. В меню нужно обновить ссылку на
`/categories` (сейчас может быть `/rubrics`).

**Контекст:** Пользователи должны иметь возможность просмотреть все доступные рубрики в одном месте, чтобы быстро найти
интересующую категорию и перейти к статьям по ней.

**Важно:** Разработка ведётся на фронтенде с использованием mock-данных, так как бекенд API ещё не реализован. Функция
`getAllCategories()` уже существует в `lib/mock-api.ts` и будет использована для получения списка категорий.

### Цель

- Создать страницу `/categories` с каталогом всех категорий
- Отобразить категории в удобном и визуально привлекательном формате
- Реализовать навигацию на страницы отдельных категорий
- Обеспечить SEO-оптимизацию страницы
- Переиспользовать существующие компоненты и стили

### Критерии приемки

**Маршрутизация:**

- [ ] Создан статический роут `app/categories/page.tsx`
- [ ] Страница доступна по URL `/categories`
- [ ] Ссылка в меню (`AppBarMenuSidebar`) обновлена на `/categories` и работает корректно

**Отображение категорий:**

- [ ] Все категории отображаются на странице
- [ ] Каждая категория содержит: название, описание, количество статей
- [ ] Категории кликабельны и ведут на страницу категории (`/${category.slug}`)
- [ ] Визуальное оформление соответствует дизайн-системе проекта

**Компоненты:**

- [ ] Создан компонент `AppCategoriesPage` (Client Component)
- [ ] Создан компонент `CategoriesPageHeader` для шапки страницы
- [ ] Создан компонент `CategoryCard` в минималистичном стиле (без рамок, как ArticleCard)
- [ ] Переиспользованы компоненты: `AppPageWrapper`, `AppBar`, `AppFooter`
- [ ] Layout соответствует стандартной структуре страниц проекта (как в `AppHomePage`, `AppCategoryPage`)
- [ ] `AppFooter` отображается с иконками социальных сетей (уже встроено в компонент)

**Стилизация:**

- [ ] Адаптивная верстка (desktop, tablet, mobile)
- [ ] Поддержка светлой и темной темы
- [ ] Плавные анимации появления (Framer Motion)
- [ ] Эффект маркера при hover (анимированное подчёркивание, как в ArticleCard)
- [ ] Минималистичный дизайн без рамок и карточек

**SEO:**

- [ ] Реализована генерация метаданных (`generateMetadata`)
- [ ] Добавлена Schema.org разметка `CollectionPage` или `ItemList`
- [ ] Добавлена Schema.org разметка `BreadcrumbList` (JSON-LD)
- [ ] Оптимизированы title и description

**Mock-данные:**

- [ ] Обновлен тип `Category` — добавлено поле `subtitle?: string`
- [ ] Обновлены mock-данные категорий с полем `subtitle` (краткое описание)
- [ ] Поле `description` используется для полного описания (HTML)
- [ ] Используется функция `getAllCategories()` из `lib/mock-api.ts`
- [ ] Данные корректно отображаются на странице

### Зависимости

- [ ] Тип `Category` из `packages/types/category.ts` (нужно добавить поле `subtitle?: string`)
- [x] Функция `getAllCategories()` из `lib/mock-api.ts` (уже существует)
- [ ] Mock-данные категорий из `lib/mock-data/categories.ts` (нужно обновить: добавить `subtitle`, использовать
      `description` для полного описания)
- [x] Компонент `AppPageWrapper` (уже существует)
- [x] Компонент `AppBar` (уже существует)
- [x] Компонент `AppFooter` (уже существует, содержит иконки соцсетей)

### Scope задачи

**Входит в scope:**

- Страница категорий (`AppCategoriesPage`, `CategoriesPageHeader`)
- Компонент для отображения категорий в минималистичном стиле (без рамок)
- Обновление типа `Category` — добавление поля `subtitle`
- Обновление mock-данных категорий с полем `subtitle`
- SEO-оптимизация страницы
- Интеграция с существующей навигацией

**НЕ входит в scope (отдельные задачи):**

- Фильтрация или поиск по категориям
- Сортировка категорий
- Пагинация (если категорий будет много)
- Реальное API — используются mock-данные

**Текущий статус бекенда:**

- ⚠️ **Бекенд API ещё не реализован** - разработка ведётся только на фронтенде
- ⚠️ Используется функция `getAllCategories()` с **mock-данными**
- ⚠️ В будущем функция будет заменена на реальный API-вызов:
  - `getAllCategories()` → API endpoint `/api/categories`

## 🛠️ Техническая часть

### Структура файлов

```
apps/web/src/
├── app/
│   └── categories/
│       └── page.tsx                    # НОВЫЙ: Server Component для страницы категорий
├── components/
│   └── app-layout/
│       └── app-categories-page/           # НОВЫЙ: Страница категорий
│           ├── AppCategoriesPage.tsx
│           ├── AppCategoriesPage.scss
│           ├── index.ts
│           ├── categories-page-header/   # НОВЫЙ: Шапка страницы
│           │   ├── CategoriesPageHeader.tsx
│           │   ├── CategoriesPageHeader.scss
│           │   └── index.ts
│           └── category-card/         # НОВЫЙ: Карточка категории
│               ├── CategoryCard.tsx
│               ├── CategoryCard.scss
│               └── index.ts
└── lib/
    └── mock-api.ts                     # ИСПОЛЬЗУЕТСЯ: getAllCategories()
```

### Компоненты

#### 1. `app/categories/page.tsx` (Server Component)

Server Component для страницы категорий:

```typescript
import { Metadata } from 'next';
import AppCategoriesPage from '@/components/app-layout/app-categories-page';
import { getAllCategories } from '@/lib/mock-api';
import {
  generateCategoriesJsonLd,
  generateCategoriesBreadcrumbJsonLd,
} from '@/utils/seo';

/**
 * Страница рубрик - каталог всех категорий
 *
 * @returns Компонент страницы рубрик
 */
export default async function CategoriesPage() {
  const categories = await getAllCategories();

  const categoriesJsonLd = generateCategoriesJsonLd(categories);
  const breadcrumbJsonLd = generateCategoriesBreadcrumbJsonLd();

  return (
    <>
      <script
        type='application/ld+json'
        dangerouslySetInnerHTML={{ __html: JSON.stringify(categoriesJsonLd) }}
      />
      <script
        type='application/ld+json'
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <AppCategoriesPage categories={categories} />
    </>
  );
}

/**
 * Генерация метаданных для SEO
 */
export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Рубрики | ProfitableWeb',
    description:
      'Каталог всех рубрик и категорий статей проекта ProfitableWeb. Найдите интересующую тему и изучите материалы по экономике внимания, ИИ-автоматизации, UI/UX дизайну и другим темам.',
    openGraph: {
      type: 'website',
      url: 'https://profitableweb.ru/categories',
      title: 'Рубрики | ProfitableWeb',
      description:
        'Каталог всех рубрик и категорий статей проекта ProfitableWeb',
    },
  };
}
```

#### 2. `CategoriesPageHeader` (Client Component)

Шапка страницы категорий:

```typescript
'use client';

import React from 'react';
import { motion } from 'framer-motion';
import './CategoriesPageHeader.scss';

/**
 * CategoriesPageHeader - шапка страницы категорий
 *
 * Отображает заголовок и описание страницы
 */
export const CategoriesPageHeader: React.FC = () => {
  return (
    <motion.header
      className='categories-page-header'
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h1 className='categories-page-header__title'>Рубрики</h1>
      <p className='categories-page-header__description'>
        Исследуйте все категории статей и найдите интересующую вас тему
      </p>
    </motion.header>
  );
};

export default CategoriesPageHeader;
```

**Стили:** `CategoriesPageHeader.scss`

```scss
@import '@/styles/utils/variables';
@import '@/styles/utils/mixins';

.categories-page-header {
  text-align: center;
  margin-bottom: var(--space-xl);
  padding: var(--space-lg) 0;

  &__title {
    font-size: var(--font-size-3xl);
    font-weight: var(--font-weight-bold);
    color: var(--color-text-primary);
    margin-bottom: var(--space-md);
  }

  &__description {
    font-size: var(--font-size-lg);
    color: var(--color-text-secondary);
    max-width: 600px;
    margin: 0 auto;
    line-height: 1.6;
  }
}
```

#### 3. `CategoryCard` (Client Component)

Карточка категории для отображения в каталоге:

```typescript
'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Category } from '@/types';
import './CategoryCard.scss';

interface CategoryCardProps {
  category: Category;
  index: number;
}

/**
 * CategoryCard - минималистичное представление категории
 *
 * Отображает информацию о категории без рамок и карточек,
 * в стиле статей на главной странице (ArticleCard).
 * Название и подзаголовок с эффектом маркера, описание обычным текстом.
 */
export const CategoryCard: React.FC<CategoryCardProps> = ({
  category,
  index,
}) => {
  return (
    <motion.article
      className='category-card'
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
    >
      {/* Заголовок и подзаголовок - кликабельная область с эффектом маркера */}
      <Link
        href={`/${category.slug}`}
        className='category-card__header-link'
        aria-label={`Перейти к категории ${category.name}`}
      >
        <header>
          <h2 className='category-card__title'>{category.name}</h2>
          {category.subtitle && (
            <div className='category-card__subtitle-wrap'>
              <p className='category-card__subtitle'>{category.subtitle}</p>
            </div>
          )}
        </header>
      </Link>

      {/* Полное описание - обычным текстом (как summary в статьях) */}
      {category.description && (
        <div
          className='category-card__description'
          dangerouslySetInnerHTML={{ __html: category.description }}
        />
      )}
    </motion.article>
  );
};

export default CategoryCard;
```

**Стили:** `CategoryCard.scss`

Минималистичный дизайн в стиле `ArticleCard` - без рамок и фона:

```scss
@import '@/styles/utils/variables';
@import '@/styles/utils/breakpoints';
@import '@/styles/utils/mixins';

.category-card {
  background: transparent;
  padding-bottom: 30px;
  width: 100%;
  overflow: clip;

  // На мобильных убираем padding-bottom, так как gap в колонке уже создаёт отступ
  @include max-md {
    padding-bottom: 0;
  }

  &__header-link {
    display: block;
    text-decoration: none;
    color: inherit;
    transition: var(--transition-opacity);
  }

  &__title {
    font-family: 'Inter', sans-serif;
    font-weight: 700;
    font-size: 20px;
    line-height: 1.2;
    color: var(--masonry-title-color);
    padding-bottom: 6px;
    margin: 0;
    display: inline;

    // Двойной gradient для анимации подчёркивания (эффект маркера)
    // Техника: https://nickymeuleman.netlify.app/blog/css-animated-wrapping-underline
    background:
      linear-gradient(to right, transparent, transparent),
      linear-gradient(to right, var(--masonry-marker-bg), var(--masonry-marker-bg));
    background-size:
      100% 0.6em,
      0 0.6em; // Толстая линия как у маркера
    background-position:
      0 100%,
      0 100%; // Немного выше низа
    background-repeat: no-repeat;
    transition: background-size var(--duration-fast) ease-in-out; // Быстрое исчезновение при уходе курсора
  }

  // Анимация подчёркивания при hover
  &__header-link:hover &__title {
    color: var(--masonry-marker-text);
    background-size:
      0 2em,
      100% 2em; // Маркер появляется слева направо
    transition:
      background-size var(--duration-medium) ease-in-out,
      color 0.3s ease-in-out;
  }

  &__subtitle-wrap {
    margin-top: 4px;
    line-height: 22px;
  }

  &__subtitle {
    font-family: 'Inter', sans-serif;
    font-weight: var(--font-weight-subheading);
    font-size: 16px;
    color: var(--masonry-subtitle-color);
    margin: 0;
    display: inline;

    // Аналогичное подчёркивание маркером с задержкой
    background:
      linear-gradient(to right, transparent, transparent),
      linear-gradient(to right, var(--masonry-marker-bg), var(--masonry-marker-bg));
    background-size:
      100% 1em,
      0 1em; // Чуть меньше чем у заголовка
    background-position:
      0 100%,
      0 100%;
    background-repeat: no-repeat;
    transition: background-size var(--duration-fast) ease-in-out; // Быстрое исчезновение при уходе курсора
  }

  // Анимация подзаголовка при hover
  &__header-link:hover &__subtitle {
    color: var(--masonry-marker-text);
    background-size:
      0 2em,
      100% 2em;
    transition:
      background-size var(--duration-medium) ease-in-out var(--delay-medium),
      color var(--duration-slow) ease-in-out var(--delay-medium);
  }

  &__description {
    font-family: 'Inter', sans-serif;
    font-weight: 400;
    font-size: 15px;
    line-height: 1.5;
    color: var(--masonry-paragraph-color);
    margin-top: 16px;

    // Стили для ссылок в HTML контенте
    a {
      color: var(--masonry-link-color);
      text-decoration: underline;
      text-decoration-color: var(--masonry-link-underline);
      text-underline-offset: 2px;
      transition:
        color 0.2s ease-in-out,
        text-decoration-color 0.2s ease-in-out;

      &:hover {
        color: var(--masonry-link-hover);
        text-decoration-color: var(--masonry-link-underline-hover);
      }

      &:visited {
        color: var(--masonry-link-visited);
      }
    }

    blockquote {
      font-size: 13px;
      margin: 14px 0;
      padding-left: 14px;
      border-left: 2px solid var(--masonry-blockquote-border);
    }

    p {
      margin: 0;
      margin-bottom: 14px;

      &:last-child {
        margin-bottom: 0;
      }
    }
  }
}

// Accessibility: уменьшенные анимации
@media (prefers-reduced-motion: reduce) {
  .category-card {
    transition: none;

    &:hover {
      transform: none;
    }
  }
}
```

#### 4. `AppCategoriesPage` (Client Component)

Основной компонент страницы категорий:

```typescript
'use client';

import React from 'react';
import AppBar from '@/components/app-layout/app-bar/AppBar';
import AppPageWrapper from '@/components/app-layout/app-page-wrapper';
import AppFooter from '@/components/app-layout/app-footer';
import CategoriesPageHeader from './categories-page-header';
import CategoryCard from './category-card';
import { Category } from '@/types';
import './AppCategoriesPage.scss';

interface AppCategoriesPageProps {
  categories: Category[];
}

/**
 * AppCategoriesPage - страница категорий (каталог)
 *
 * Отображает все доступные категории в минималистичном стиле,
 * аналогично статьям на главной странице (без рамок и карточек).
 * Использует masonry-сетку и стандартный layout проекта.
 */
const AppCategoriesPage: React.FC<AppCategoriesPageProps> = ({ categories }) => {
  return (
    <div className='categories-page'>
      <AppBar />
      <AppPageWrapper>
        <main>
          <CategoriesPageHeader />
          <section className='categories-page__content'>
            <div className='categories-page__grid'>
              {categories.map((category, index) => (
                <CategoryCard
                  key={category.id}
                  category={category}
                  index={index}
                />
              ))}
            </div>
          </section>
        </main>
        <AppFooter />
      </AppPageWrapper>
    </div>
  );
};

export default AppCategoriesPage;
```

**Стили:** `AppCategoriesPage.scss`

Используем masonry-сетку как на главной странице (аналогично `MasonryGrid`):

```scss
@import '@/styles/utils/variables';
@import '@/styles/utils/breakpoints';
@import '@/styles/utils/mixins';

.categories-page {
  &__content {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 var(--space-md);
  }

  &__grid {
    // Используем columns layout как в MasonryGrid для статей
    column-count: 3;
    column-gap: 30px;
    margin-bottom: var(--space-xl);

    // Tablet: 2 колонки
    @include max-lg {
      column-count: 2;
    }

    // Mobile: 1 колонка
    @include max-md {
      column-count: 1;
      column-gap: 0;
    }
  }
}

// Для правильного отображения в columns layout
.category-card {
  break-inside: avoid;
  page-break-inside: avoid;
}
```

### SEO утилиты

**Обновить:** `utils/seo.ts`

Добавить функции для генерации JSON-LD разметки страницы категорий:

```typescript
/**
 * Генерирует JSON-LD разметку для страницы категорий
 */
export function generateCategoriesJsonLd(categories: Category[]) {
  const baseUrl = 'https://profitableweb.ru';

  return {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Рубрики',
    description: 'Каталог всех рубрик и категорий статей проекта ProfitableWeb',
    url: `${baseUrl}/categories`,
    mainEntity: {
      '@type': 'ItemList',
      itemListElement: categories.map((category, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        item: {
          '@type': 'CollectionPage',
          name: category.name,
          description: category.description,
          url: `${baseUrl}/${category.slug}`,
        },
      })),
    },
  };
}

/**
 * Генерирует JSON-LD разметку BreadcrumbList для страницы категорий
 */
export function generateCategoriesBreadcrumbJsonLd() {
  const baseUrl = 'https://profitableweb.ru';

  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Главная',
        item: baseUrl,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Рубрики',
        item: `${baseUrl}/rubrics`,
      },
    ],
  };
}
```

### Дизайн и структура страницы

**Предлагаемая структура:**

1. **Шапка страницы** (`CategoriesPageHeader`)
   - Заголовок "Рубрики" (H1)
   - Описание: "Исследуйте все категории статей и найдите интересующую вас тему"
   - Центрированное расположение

2. **Основной контент** - masonry-сетка категорий
   - Колоночный layout: 3 колонки (desktop) → 2 колонки (tablet) → 1 колонка (mobile)
   - Плавное появление категорий с задержкой (stagger effect)
   - Минималистичный дизайн без рамок и карточек, как статьи на главной

**Варианты дизайна карточек:**

**Дизайн: Максимальный функциональный минимализм**

Категории отображаются в том же стиле, что и статьи на главной странице:

- **Без рамок и карточек** - только текст на прозрачном фоне
- **Эффект маркера при hover** - анимированное подчёркивание заголовка и описания
- **Masonry-сетка** - колоночный layout (3 → 2 → 1 колонка)
- **Минималистичная типографика** - заголовок, описание, количество статей
- **Консистентность** - идентичный стиль с `ArticleCard` для единообразия UX

**Визуальная структура страницы:**

```
┌─────────────────────────────────────────┐
│           AppBar (шапка сайта)          │
├─────────────────────────────────────────┤
│                                         │
│         CategoriesPageHeader            │
│         ┌───────────────────┐          │
│         │     Рубрики       │          │
│         │                   │          │
│         │ Исследуйте все... │          │
│         └───────────────────┘          │
│                                         │
│    Кат. 1    │    Кат. 2    │    Кат. 3    │
│    Кат. 4    │    Кат. 5    │              │
│              │              │              │
│  (текст без рамок, как статьи)            │
│                                         │
├─────────────────────────────────────────┤
│      AppFooter (с иконками соцсетей)    │
└─────────────────────────────────────────┘
```

**Структура категории (минималистично, как статьи):**

```
Название категории (H2)
  ↓ (эффект маркера при hover)

Подзаголовок (P) - краткое описание
  ↓ (эффект маркера при hover)

Полное описание (HTML) - обычным текстом
(как summary в статьях, без эффекта маркера)
```

**Сравнение со статьями:**

| Статья (ArticleCard)            | Категория (CategoryCard)            |
| ------------------------------- | ----------------------------------- |
| `title` (H2, с маркером)        | `name` (H2, с маркером)             |
| `subtitle` (P, с маркером)      | `subtitle` (P, с маркером)          |
| `date` (time)                   | — (убрано)                          |
| `summary` (HTML, обычный текст) | `description` (HTML, обычный текст) |

**Структура данных:**

Нужно обновить тип `Category`:

```typescript
export interface Category {
  id: string;
  name: string;
  slug: string;
  subtitle?: string; // НОВОЕ: краткое описание (с маркером)
  description?: string; // полное описание в HTML (обычный текст)
  icon?: string;
  color?: string;
  articleCount?: number; // не используется в отображении
}
```

**Использование полей:**

- `name` — название категории (H2, с эффектом маркера при hover)
- `subtitle` — краткое описание (P, с эффектом маркера при hover)
- `description` — полное описание в HTML (обычный текст, как `summary` в статьях)

**Пример обновленных mock-данных:**

```typescript
export const mockCategories: Category[] = [
  {
    id: '1',
    name: 'Экономика внимания',
    slug: 'attention-economy',
    subtitle: 'Как привлекать и удерживать внимание аудитории',
    description:
      '<p>В цифровую эпоху внимание стало самым ценным ресурсом. В этом разделе мы исследуем стратегии привлечения и удержания внимания аудитории через контент, дизайн и технологии.</p>',
    articleCount: 5,
  },
  {
    id: '2',
    name: 'ИИ-автоматизация',
    slug: 'ai-automation',
    subtitle: 'Использование искусственного интеллекта для автоматизации',
    description:
      '<p>Искусственный интеллект открывает новые возможности для автоматизации рутинных задач. Изучаем практические применения ИИ в различных сферах деятельности.</p>',
    articleCount: 3,
  },
  // ...
];
```

### Стилизация

**Принципы:**

- Использовать CSS переменные из `styles/utils/variables.scss`
- Поддержка светлой и темной темы через `[data-theme]` атрибуты
- Адаптивная сетка: 3 колонки на desktop, 2 на tablet, 1 на mobile
- Плавные анимации появления карточек (stagger effect)
- Hover-эффекты для интерактивности
- Консистентность с существующими компонентами (`ArticleCard`, `FeatureCategoryBlock`)

## ✅ Чеклист выполнения

### TODO → DOING

- [ ] Задача проанализирована
- [ ] План реализации готов
- [ ] Структура файлов определена
- [ ] Зависимости проверены (типы, компоненты, mock-функции)

### DOING → TESTING

**Маршрутизация:**

- [ ] Создан роут `app/categories/page.tsx`
- [ ] Страница доступна по URL `/categories`
- [ ] Ссылка в меню работает корректно

**Компоненты:**

- [ ] Создан `CategoriesPageHeader` с анимациями
- [ ] Обновлен тип `Category` — добавлено поле `subtitle`
- [ ] Обновлены mock-данные категорий с полем `subtitle`
- [ ] Создан `CategoryCard` с эффектом маркера для названия и подзаголовка
- [ ] Полное описание (`description`) отображается обычным текстом (как `summary` в статьях)
- [ ] Количество статей не отображается
- [ ] Создан `AppCategoriesPage` с masonry-сеткой категорий
- [ ] Все компоненты интегрированы

**Стилизация:**

- [ ] `CategoriesPageHeader.scss` — стили для шапки
- [ ] `CategoryCard.scss` — минималистичные стили без рамок (как ArticleCard)
- [ ] `AppCategoriesPage.scss` — masonry-сетка для категорий
- [ ] Адаптивность проверена (desktop + tablet + mobile)
- [ ] Поддержка тем (light/dark)

**SEO:**

- [ ] `generateMetadata` для страницы категорий
- [ ] Schema.org `CollectionPage` для категорий
- [ ] Schema.org `BreadcrumbList` (JSON-LD)
- [ ] Функции добавлены в `utils/seo.ts`

**Mock-данные:**

- [ ] Обновлен тип `Category` — добавлено поле `subtitle?: string`
- [ ] Обновлены mock-данные категорий:
  - Добавлено поле `subtitle` (краткое описание)
  - Поле `description` используется для полного описания (HTML)
- [ ] Используется функция `getAllCategories()` из `lib/mock-api.ts`
- [ ] Все категории отображаются корректно

### TESTING → CODEREVIEW & DOCS

**Функциональность:**

- [ ] Страница категорий отображается корректно (`/rubrics`)
- [ ] Все категории видны на странице
- [ ] Клик на категорию ведет на страницу категории (`/${category.slug}`)
- [ ] Навигация работает правильно
- [ ] Анимации плавные и не мешают UX
- [ ] Layout соответствует другим страницам (AppBar сверху, AppFooter снизу с соцсетями)
- [ ] Футер отображает иконки социальных сетей корректно

**Адаптивность:**

- [ ] Desktop (1920px, 1440px, 1280px) — 3 колонки
- [ ] Tablet (1024px, 768px) — 2 колонки
- [ ] Mobile (425px, 375px, 320px) — 1 колонка

**SEO:**

- [ ] Мета-теги (title, description) корректны
- [ ] Schema.org разметка валидна (Google Rich Results Test)
- [ ] JSON-LD корректен для страницы категорий

**Performance:**

- [ ] Lighthouse score > 90
- [ ] Нет лишних ререндеров
- [ ] Анимации оптимизированы (will-change, transform)

### CODEREVIEW & DOCS → DONE

- [ ] Код соответствует стандартам проекта
- [ ] Компоненты переиспользуемы и документированы
- [ ] TypeScript типы корректны
- [ ] Нет linter errors
- [ ] SCSS организован правильно
- [ ] Документация обновлена (если требуется)
- [ ] Задача полностью протестирована

## 🔗 Связанные задачи

- **Связана с**: PW-007 (Страница категории) — использует те же типы и mock-данные
- **Использует**: Компоненты `AppPageWrapper`, `AppBar`, `AppFooter`
- **Использует**: Функцию `getAllCategories()` из `lib/mock-api.ts`
- **Связана с**: API endpoint `/api/categories` (будет реализован в будущем)
- **Примечание**: На текущем этапе разработка ведётся с mock-данными, бекенд API ещё не реализован

## 📝 Заметки и комментарии

### История изменений

- 2026-01-16: Задача создана

### Особенности реализации

- **Каталог категорий**: Страница отображает все доступные категории в виде сетки карточек для удобной навигации
- **Переиспользование**: Максимальное переиспользование существующих компонентов и стилей для консистентности UI/UX
- **Layout**: Использует стандартную структуру страниц проекта:
  - `AppBar` - шапка сайта
  - `AppPageWrapper` - обертка для контента с адаптивной шириной
  - `AppFooter` - футер с иконками социальных сетей (уже содержит FooterSocialIcons)
- **SEO**:
  - Schema.org разметка `CollectionPage` для страницы рубрик
  - Schema.org разметка `ItemList` для списка категорий
  - Breadcrumbs для улучшения навигации и SEO
- **Адаптивность**: Сетка автоматически подстраивается под размер экрана (3 → 2 → 1 колонка)
- **Анимации**: Плавное появление карточек с задержкой (stagger effect) для лучшего UX

### Возможные улучшения (будущие задачи)

- **Поиск по категориям**: Добавить поле поиска для фильтрации категорий
- **Сортировка**: Добавить возможность сортировки по названию, количеству статей
- **Фильтрация**: Фильтр по тегам или другим критериям
- **Пагинация**: Если категорий станет много, добавить пагинацию
- **Статистика**: Показать общее количество категорий и статей
- **Иконки категорий**: Использовать поле `icon` из типа `Category` для визуального оформления

### Возможные риски

- ⚠️ **Производительность**: Если категорий станет очень много (100+), может потребоваться виртуализация или пагинация
- ⚠️ **Масштабируемость**: При добавлении новых полей в тип `Category` нужно обновить `CategoryCard`
- ⚠️ **Консистентность**: Нужно убедиться, что стили карточек категорий соответствуют общему дизайну проекта

### Рекомендации

**Для текущей задачи:**

- Использовать существующие CSS переменные для консистентности
- Следовать паттернам анимаций из других компонентов проекта
- Обеспечить доступность (ARIA labels, keyboard navigation)

**Для будущих задач:**

- Рассмотреть возможность добавления превью статей в карточки категорий
- Добавить возможность группировки категорий по темам
- Реализовать страницу "Популярные рубрики" с сортировкой по количеству статей

---

**Статусы**: TODO → DOING → TESTING → CODEREVIEW & DOCS → DONE
