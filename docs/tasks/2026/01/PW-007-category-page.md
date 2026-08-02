# PW-007: Страница категории и единая маршрутизация

## 📋 Информация о задаче

- **ID**: PW-007
- **Статус**: DONE
- **Создано**: 2026-01-11
- **Завершено**: 2026-01-12
- **Приоритет**: Normal 📋
- **Компонент**: ⚛️ Frontend
- **Теги**: #frontend #category #routing #nextjs #seo

## 🎯 Постановка задачи

### Описание

Разработать страницу категории на основе главной страницы и реализовать единую маршрутизацию `/[slug]` для категорий и
статей. Страница категории должна быть практически идентична главной, но с упрощенной шапкой (заголовок, подзаголовок и
описание вместо сложной hero-секции). Статьи также должны использовать короткие URL на первом уровне вместо
`/articles/[slug]`.

**Важно:** Разработка ведётся на фронтенде с использованием mock-данных, так как бекенд API ещё не реализован. Все
функции получения данных (`getCategoryBySlug`, `getArticlesByCategory`, `getArticleBySlug`) должны быть реализованы с
mock-данными, которые в будущем будут заменены на реальные API-вызовы.

### Цель

- Создать динамическую страницу категории с маршрутизацией `/[slug]`
- Реализовать единую маршрутизацию `/[slug]` для категорий и статей (короткие URL)
- Переиспользовать компоненты главной страницы (MasonryGrid, AppPageWrapper, AppBar, AppFooter)
- Реализовать простую шапку категории с данными из типа `Category`
- Отображать только статьи выбранной категории в masonry-сетке
- Обновить все ссылки на статьи в существующих компонентах
- Гарантировать уникальность slug между категориями и статьями

### Архитектура маршрутизации

**Структура URL:**

- `/` → Главная страница (все статьи)
- `/[slug]` → Страница категории ИЛИ страница статьи (разрешение по приоритету)
- `/about` → Статическая страница (уже реализовано)

**Приоритет разрешения маршрутов в `app/[slug]/page.tsx`:**

1. Статические страницы (`/about`, `/contact`, etc.) - обрабатываются Next.js автоматически
2. Динамические категории `/[slug]` - проверка первой
3. Статьи `/[slug]` - проверка второй (если категория не найдена)

**Преимущества единой маршрутизации:**

- Короткие URL для лучшего SEO (`/react-tips` вместо `/articles/react-tips`)
- Единообразие структуры сайта
- Современная практика (Medium, dev.to используют такой подход)
- Ключевые слова ближе к домену для лучшей ранжируемости

### Критерии приемки

**Маршрутизация:**

- [ ] Создан динамический роут `app/[slug]/page.tsx` с логикой разрешения категорий и статей
- [ ] Реализована приоритетная проверка: сначала категория, затем статья
- [ ] Добавлена обработка 404 для несуществующих категорий и статей

**Страница категории:**

- [ ] Создан компонент `CategoryPageHeader` с заголовком и описанием
- [ ] Создан компонент `AppCategoryPage` (аналог `AppHomePage`)
- [ ] Страница категории отображает только статьи выбранной категории
- [ ] Шапка категории использует данные из типа `Category` (name, description)
- [ ] Переиспользованы компоненты: `MasonryGrid`, `AppPageWrapper`, `AppBar`, `AppFooter`

**Страница статьи (заглушка):**

- [ ] Создана базовая заглушка `ArticlePage` для тестирования маршрутизации
- [ ] Заглушка отображает заголовок и excerpt статьи

**Обновление существующих компонентов:**

- [ ] Обновлен `FeatureCategoryBlock` — ссылки на категории (`/${category.slug}`)
- [ ] Обновлен `ArticleCard` — ссылки на статьи (`/${article.slug}` вместо `/articles/${article.slug}`)
- [ ] Обновлен `MasonryGrid` — ссылки на статьи
- [ ] Обновлен `utils/seo.ts` — URL без `/articles/` в JSON-LD

**Mock-данные:**

- [ ] Созданы mock-категории с реальными slug
- [ ] Добавлено поле `category` в mock-статьи для связи
- [ ] Созданы mock-функции: `getCategoryBySlug`, `getArticlesByCategory`, `getArticleBySlug`

**SEO:**

- [ ] Реализована генерация метаданных (`generateMetadata`) для категорий и статей
- [ ] Добавлена Schema.org разметка `CollectionPage` для категорий
- [ ] Добавлена Schema.org разметка `BreadcrumbList` (JSON-LD, не UI-компонент)
- [ ] Гарантирована уникальность slug в mock-данных

### Зависимости

- [ ] Тип `Category` из `packages/types/category.ts` (уже существует)
- [ ] Тип `Article` из `packages/types/article.ts` (уже существует)
- [ ] Компонент `MasonryGrid` из `components/common/masonry` (уже существует)
- [ ] Mock-данные статей из `components/common/masonry/data.ts` (уже существует)

### Scope задачи

**Входит в scope:**

- Страница категории (`AppCategoryPage`, `CategoryPageHeader`)
- Единая маршрутизация `/[slug]` с логикой разрешения
- Mock-функции для получения данных
- Обновление ссылок в существующих компонентах
- SEO-оптимизация для категорий

**НЕ входит в scope (отдельные задачи):**

- Полноценная страница статьи (`ArticlePage`) — будет создана базовая заглушка для тестирования маршрутизации
- Реальное API — используются mock-данные
- Бекенд и база данных

**Текущий статус бекенда:**

- ⚠️ **Бекенд API ещё не реализован** - разработка ведётся только на фронтенде
- ⚠️ Все функции получения данных должны использовать **mock-данные**
- ⚠️ В будущем mock-функции будут заменены на реальные API-вызовы:
  - `getCategoryBySlug(slug)` → API endpoint `/api/categories/[slug]`
  - `getArticlesByCategory(categoryId)` → API endpoint `/api/categories/[id]/articles`
  - `getArticleBySlug(slug)` → API endpoint `/api/articles/[slug]`

## 🛠️ Техническая часть

### Структура файлов

```
apps/web/src/
├── app/
│   ├── [slug]/
│   │   └── page.tsx                    # НОВЫЙ: Server Component с логикой разрешения
│   ├── page.tsx                        # Главная (уже существует)
│   └── about/
│       └── page.tsx                    # Статическая страница (уже существует)
├── components/
│   ├── app-layout/
│   │   ├── app-home-page/              # Главная страница (уже существует)
│   │   ├── app-category-page/          # НОВЫЙ: Страница категории
│   │   │   ├── AppCategoryPage.tsx
│   │   │   ├── index.ts
│   │   │   └── category-page-header/
│   │   │       ├── CategoryPageHeader.tsx
│   │   │       ├── CategoryPageHeader.scss
│   │   │       ├── CategoryPageHeader.animations.ts
│   │   │       └── index.ts
│   │   └── app-article-page/           # НОВЫЙ: Заглушка страницы статьи
│   │       ├── ArticlePage.tsx
│   │       └── index.ts
│   └── common/
│       ├── feature-category-block/
│       │   └── FeatureCategoryBlock.tsx # ОБНОВИТЬ: ссылки на категории
│       └── masonry/
│           ├── ArticleCard.tsx          # ОБНОВИТЬ: ссылки на статьи
│           ├── MasonryGrid.tsx          # ОБНОВИТЬ: ссылки на статьи
│           └── data.ts                  # ОБНОВИТЬ: добавить поле category
├── lib/
│   ├── mock-api.ts                     # НОВЫЙ: Mock-функции для получения данных
│   └── mock-data/
│       └── categories.ts               # НОВЫЙ: Mock-категории
└── utils/
    └── seo.ts                           # ОБНОВИТЬ: URL в JSON-LD
```

### Компоненты

#### 1. `app/[slug]/page.tsx` (Server Component)

Единый роут с логикой разрешения категорий и статей:

```typescript
import { notFound } from 'next/navigation';
import { AppCategoryPage } from '@/components/app-layout/app-category-page';
// ПРИМЕЧАНИЕ: ArticlePage - заглушка, полноценная страница статьи будет реализована в отдельной задаче
import { ArticlePage } from '@/components/app-layout/app-article-page';
// ВАЖНО: Используются mock-функции до реализации бекенда
import {
  getCategoryBySlug,
  getArticlesByCategory,
  getArticleBySlug
} from '@/lib/mock-api';

// Список статических страниц (обрабатываются Next.js автоматически)
const STATIC_PAGES = ['about', 'contact', 'privacy', 'terms'];

export default async function DynamicPage({
  params
}: {
  params: { slug: string }
}) {
  const { slug } = params;

  // Проверка на статические страницы (на всякий случай)
  if (STATIC_PAGES.includes(slug)) {
    notFound();
  }

  // Приоритет 1: Проверка категории
  const category = await getCategoryBySlug(slug);
  if (category) {
    const articles = await getArticlesByCategory(category.id);
    return <AppCategoryPage category={category} articles={articles} />;
  }

  // Приоритет 2: Проверка статьи
  const article = await getArticleBySlug(slug);
  if (article) {
    return <ArticlePage article={article} />;
  }

  // Если ничего не найдено - 404
  notFound();
}

// Генерация метаданных для SEO
export async function generateMetadata({
  params
}: {
  params: { slug: string }
}) {
  const { slug } = params;

  // Проверка категории
  const category = await getCategoryBySlug(slug);
  if (category) {
    return {
      title: category.name,
      description: category.description || `Статьи по категории ${category.name}`,
      openGraph: {
        type: 'website',
        url: `https://profitableweb.ru/${category.slug}`,
        title: category.name,
        description: category.description,
      },
    };
  }

  // Проверка статьи
  const article = await getArticleBySlug(slug);
  if (article) {
    return {
      title: article.title,
      description: article.excerpt,
      openGraph: {
        type: 'article',
        url: `https://profitableweb.ru/${article.slug}`,
        title: article.title,
        description: article.excerpt,
        publishedTime: article.publishedAt.toISOString(),
      },
    };
  }

  return {
    title: 'Страница не найдена',
  };
}
```

#### 2. `CategoryPageHeader` (Client Component)

Упрощенная версия `AppHomeHeroHeader`:

- Заголовок (H1) с названием категории (`category.name`)
- Описание категории (`category.description`) — если есть
- Опционально: иконка категории (`category.icon`) и цветовой акцент (`category.color`)
- Без блоков категорий и сложных параграфов (как на главной)
- Анимации появления (Framer Motion) аналогично `AppHomeHeroHeader`

**Пропсы компонента:**

```typescript
interface CategoryPageHeaderProps {
  category: Category;
  className?: string;
}
```

#### 3. `AppCategoryPage` (Client Component)

Аналог `AppHomePage`, но:

- Использует `CategoryPageHeader` вместо `AppHomeHeroHeader`
- Принимает пропсы: `category: Category` и `articles: Article[]`
- Передает отфильтрованные статьи в `MasonryGrid`

**Пропсы компонента:**

```typescript
interface AppCategoryPageProps {
  category: Category;
  articles: Article[];
}
```

#### 4. `ArticlePage` (заглушка для тестирования)

Базовая заглушка для проверки маршрутизации статей. Полноценная реализация — отдельная задача.

```typescript
// apps/web/src/components/app-layout/app-article-page/ArticlePage.tsx
interface ArticlePageProps {
  article: Article;
}

const ArticlePage: React.FC<ArticlePageProps> = ({ article }) => {
  return (
    <div>
      <AppBar />
      <AppPageWrapper>
        <main>
          <h1>{article.title}</h1>
          <p>{article.excerpt}</p>
          {/* Заглушка: полноценная реализация в отдельной задаче */}
        </main>
        <AppFooter />
      </AppPageWrapper>
    </div>
  );
};
```

### Данные

**Тип Category** (уже существует в `packages/types/category.ts`):

```typescript
interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  icon?: string;
  color?: string;
  articleCount?: number;
}
```

**Mock данные** (используются до реализации бекенда):

**1. Категории** — создать `apps/web/src/lib/mock-data/categories.ts`:

```typescript
import { Category } from '@/types';

export const mockCategories: Category[] = [
  {
    id: '1',
    name: 'Экономика внимания',
    slug: 'attention-economy',
    description: 'Как привлекать и удерживать внимание аудитории в цифровую эпоху',
    articleCount: 5,
  },
  {
    id: '2',
    name: 'ИИ-автоматизация',
    slug: 'ai-automation',
    description: 'Использование искусственного интеллекта для автоматизации рутинных задач',
    articleCount: 3,
  },
  {
    id: '3',
    name: 'UI/UX дизайн',
    slug: 'ui-ux-design',
    description: 'Принципы создания удобных и красивых интерфейсов',
    articleCount: 4,
  },
  // ... другие категории из FeatureCategoryBlock
];
```

**2. Статьи** — использовать существующие `mockArticles` из `apps/web/src/components/common/masonry/data.ts`, добавив
поле `category` (slug категории) для связи.

**3. Mock-функции** — создать `apps/web/src/lib/mock-api.ts`:

```typescript
import { Category, Article } from '@/types';
import { mockCategories } from './mock-data/categories';
import { mockArticles } from '@/components/common/masonry/data';

export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  return mockCategories.find(c => c.slug === slug) || null;
}

export async function getArticlesByCategory(categoryId: string): Promise<Article[]> {
  const category = mockCategories.find(c => c.id === categoryId);
  if (!category) return [];
  return mockArticles.filter(a => a.category === category.slug);
}

export async function getArticleBySlug(slug: string): Promise<Article | null> {
  return mockArticles.find(a => a.slug === slug) || null;
}
```

**Важно:**

- Функции возвращают `Promise` для совместимости с будущими API-вызовами
- Slug категорий и статей должны быть уникальными (не пересекаться)
- В будущем эти функции будут заменены на реальные API-вызовы без изменения интерфейса

### Стилизация

- `CategoryPageHeader.scss` - стили для шапки категории
- Переиспользовать стили из `AppHomeHeroHeader.scss` где возможно
- Адаптивность под мобильные устройства

### Обновления существующих компонентов

**FeatureCategoryBlock.tsx:**

- Обновить `categoryBasePath` по умолчанию с `/categories` на пустую строку `''`
- Использовать `category.slug` для генерации ссылок: `/${category.slug}`
- Обновить логику маппинга категорий (если используется массив строк, перейти на массив `Category`)

**ArticleCard.tsx:**

- Изменить ссылку с `/articles/${article.slug}` на `/${article.slug}`
- Обновить мета-тег `itemProp='url'` с `/articles/${article.slug}` на `/${article.slug}`

**MasonryGrid.tsx:**

- Обновить все ссылки на статьи с `/articles/${article.slug}` на `/${article.slug}`

**utils/seo.ts:**

- Обновить функцию `generateArticleJsonLd`:
  - Изменить `url: \`https://profitableweb.ru/articles/${article.slug}\``
  - На `url: \`https://profitableweb.ru/${article.slug}\``

### Schema.org разметка

**Для категорий (CollectionPage):**

```typescript
const categoryJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'CollectionPage',
  name: category.name,
  description: category.description,
  url: `${baseUrl}/${category.slug}`,
  mainEntity: {
    '@type': 'ItemList',
    itemListElement: articles.map((article, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      item: {
        '@type': 'BlogPosting',
        headline: article.title,
        url: `${baseUrl}/${article.slug}`,
      },
    })),
  },
};
```

**Для статей (BlogPosting):**

```typescript
const articleJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'BlogPosting',
  headline: article.title,
  description: article.excerpt,
  datePublished: article.publishedAt.toISOString(), // ISO 8601 формат
  url: `${baseUrl}/${article.slug}`, // БЕЗ /articles/
  author: {
    '@type': 'Organization',
    name: 'ProfitableWeb',
  },
  // ... остальные поля из существующей функции generateArticleJsonLd
};
```

**Breadcrumbs (BreadcrumbList)** — только JSON-LD разметка для SEO, UI-компонент breadcrumbs — отдельная задача:

```typescript
// Для категории
const categoryBreadcrumbJsonLd = {
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
      name: category.name,
      item: `${baseUrl}/${category.slug}`,
    },
  ],
};

// Для статьи (с категорией)
const articleBreadcrumbJsonLd = {
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
      name: article.category, // название категории
      item: `${baseUrl}/${article.category}`, // slug категории
    },
    {
      '@type': 'ListItem',
      position: 3,
      name: article.title,
      item: `${baseUrl}/${article.slug}`,
    },
  ],
};
```

### Гарантия уникальности slug

**Важно:** Необходимо гарантировать, что slug категорий и статей не пересекаются.

**Варианты реализации:**

1. **На уровне БД:** Уникальный индекс на slug в таблице категорий и статей
2. **На уровне валидации:** Проверка при создании/обновлении категории/статьи
3. **На уровне API:** Валидация slug перед сохранением
4. **Документация:** Четко указать в документации, что slug должны быть уникальными

**Рекомендация:** Использовать префиксы или суффиксы для категорий (например, `cat-programming`), но это ухудшит SEO.
Лучше - строгая валидация уникальности.

## ✅ Чеклист выполнения

### TODO → DOING

- [ ] Задача проанализирована
- [ ] План реализации готов
- [ ] Структура файлов определена
- [ ] Зависимости проверены (типы, компоненты)

### DOING → TESTING

**Маршрутизация:**

- [ ] Создан роут `app/[slug]/page.tsx` с логикой разрешения
- [ ] Приоритетная проверка работает (категория → статья → 404)

**Компоненты:**

- [ ] Создан `CategoryPageHeader` с анимациями (Framer Motion)
- [ ] Создан `AppCategoryPage` с переиспользованием существующих компонентов
- [ ] Создана заглушка `ArticlePage` для тестирования

**Обновления:**

- [ ] `FeatureCategoryBlock` — ссылки на категории обновлены
- [ ] `ArticleCard` — ссылки на статьи обновлены (убран `/articles/`)
- [ ] `MasonryGrid` — ссылки на статьи обновлены
- [ ] `utils/seo.ts` — URL в JSON-LD обновлены

**Mock-данные:**

- [ ] Созданы mock-категории (`lib/mock-data/categories.ts`)
- [ ] Добавлено поле `category` в существующие mock-статьи
- [ ] Созданы mock-функции (`lib/mock-api.ts`)

**SEO:**

- [ ] `generateMetadata` для категорий и статей
- [ ] Schema.org `CollectionPage` для категорий
- [ ] Schema.org `BreadcrumbList` (JSON-LD)

**Стилизация:**

- [ ] `CategoryPageHeader.scss` — стили для шапки
- [ ] Адаптивность проверена (desktop + tablet + mobile)

### TESTING → CODEREVIEW & DOCS

**Функциональность:**

- [ ] Страница категории корректно отображается (`/attention-economy`, `/ai-automation`, etc.)
- [ ] Заглушка страницы статьи отображается (`/[article-slug]`)
- [ ] Фильтрация статей по категории работает правильно
- [ ] Навигация: клик на категорию → страница категории
- [ ] Навигация: клик на статью → страница статьи (заглушка)
- [ ] Приоритет маршрутизации: категория > статья > 404
- [ ] 404 для несуществующих slug

**Адаптивность:**

- [ ] Desktop (1920px, 1440px, 1280px)
- [ ] Tablet (1024px, 768px)
- [ ] Mobile (425px, 375px, 320px)

**SEO:**

- [ ] Мета-теги (title, description) для категорий
- [ ] Мета-теги (title, description) для статей
- [ ] Schema.org разметка валидна (Google Rich Results Test)
- [ ] JSON-LD корректен для категорий и статей

**Performance:**

- [ ] Lighthouse score > 90 для категории
- [ ] Нет лишних ререндеров

### CODEREVIEW & DOCS → DONE

- [ ] Код соответствует стандартам проекта
- [ ] Компоненты переиспользуемы и документированы
- [ ] TypeScript типы корректны
- [ ] Документация обновлена (если требуется)
- [ ] Задача полностью протестирована

## 🔗 Связанные задачи

- **Связана с**: Главная страница (использует те же компоненты)
- **Заменяет**: Старые маршруты `/articles/[slug]` (если существовали)
- **Связана с**: API endpoints для категорий и статей (будут реализованы в будущем)
- **Требует**: Валидацию уникальности slug на уровне API/БД (при реализации бекенда)
- **Примечание**: На текущем этапе разработка ведётся с mock-данными, бекенд API ещё не реализован

## 📝 Заметки и комментарии

### История изменений

- 2026-01-11: Задача создана

### Особенности реализации

- **Единая маршрутизация**: Используется динамический роут `[slug]` на первом уровне для категорий И статей. Это
  позволяет иметь короткие URL типа `/programming` (категория) и `/react-tips` (статья) вместо `/category/programming` и
  `/articles/react-tips`.
- **Разрешение конфликтов**: Реализована приоритетная проверка - сначала проверяется категория, затем статья. Если slug
  совпадает, приоритет у категории. **Важно:** Необходимо гарантировать уникальность slug на уровне БД/валидации.
- **Переиспользование**: Максимальное переиспользование компонентов главной страницы для консистентности UI/UX.
- **SEO**:
  - Шапка категории содержит семантический H1 с названием категории
  - Schema.org разметка `CollectionPage` для категорий
  - Schema.org разметка `BlogPosting` для статей
  - Breadcrumbs для улучшения навигации и SEO
  - Короткие URL с ключевыми словами ближе к домену
- **Обновление ссылок**: Все существующие ссылки на статьи (`/articles/[slug]`) должны быть обновлены на `/[slug]` в
  компонентах `ArticleCard`, `MasonryGrid`, `utils/seo.ts`.

### Возможные риски

- ⚠️ **Конфликты slug**: Если категория и статья имеют одинаковый slug, приоритет у категории. Необходима строгая
  валидация уникальности на уровне БД/API.
- ⚠️ **Статические страницы**: Нужно убедиться, что slug категорий и статей не конфликтуют со статическими страницами
  (`/about`, `/contact`, etc.). Next.js автоматически обработает статические роуты, но лучше вести список
  зарезервированных slug.
- ⚠️ **Масштабируемость**: Если в будущем появятся другие типы контента на первом уровне (теги, авторы), может
  потребоваться middleware для разрешения маршрутов или пересмотр архитектуры.
- ⚠️ **Миграция**: Если уже есть статьи с маршрутами `/articles/[slug]`, нужно настроить редиректы (301) на новые URL
  для сохранения SEO.
- ⚠️ **Обратная совместимость**: Если есть внешние ссылки на старые URL (`/articles/[slug]`), нужно настроить редиректы.

### Рекомендации

**Для текущей задачи:**

- Использовать Next.js `generateStaticParams` для статических категорий (если они известны на этапе сборки)
- Создать список зарезервированных slug для статических страниц (`about`, `contact`, etc.)

**Для будущих задач:**

- UI-компонент Breadcrumbs для навигации (Главная → Категория → Статья)
- Полноценная страница статьи (вместо заглушки)
- Настроить редиректы (301) с `/articles/[slug]` на `/[slug]` если старые URL существуют
- Валидация уникальности slug на уровне API/БД
- Обновить sitemap.xml с новыми URL структурами
- E2E тесты для проверки логики разрешения маршрутов

---

**Статусы**: TODO → DOING → TESTING → CODEREVIEW & DOCS → DONE
