# Masonry Grid Component

    - Реализовано в рамках задачи: PW-005
    - Дата: 26.10.2025

Компонент для отображения карточек статей в адаптивной masonry-сетке. Автоматически распределяет контент по колонкам (от
1 до 6) в зависимости от ширины экрана, используя алгоритм "shortest column first" для сбалансированной высоты.

Полностью автономный модуль со всеми зависимостями внутри: типы, хуки, утилиты, данные и стили. Можно скопировать в
любой проект на Next.js.

Оптимизирован для SEO с серверным рендерингом, Schema.org разметкой и плавными анимациями появления через Framer Motion.

## 📑 Содержание

- [📊 Схемы](#-схемы)
  - [Визуализация Masonry Grid](#визуализация-masonry-grid)
  - [Архитектура компонентов](#архитектура-компонентов)
  - [Поток данных](#поток-данных)
  - [Responsive Breakpoints Flow](#responsive-breakpoints-flow)
  - [Hydration Mismatch Prevention](#hydration-mismatch-prevention)
- [🎯 Особенности](#-особенности)
- [📦 Структура](#-структура)
- [🚀 Использование](#-использование)
  - [С кастомными данными](#с-кастомными-данными)
- [🏗️ Архитектура](#️-архитектура)
  - [Server Component](#server-component)
  - [Client Components](#client-components)
  - [Responsive Columns](#responsive-columns)
  - [Алгоритм распределения](#алгоритм-распределения)
  - [Hydration Mismatch Prevention](#hydration-mismatch-prevention-1)
  - [Анимации (Framer Motion)](#анимации-framer-motion)
  - [Hover-эффекты](#hover-эффекты)
- [🎨 Адаптивность](#-адаптивность)
- [♿ Accessibility](#-accessibility)
- [🔧 Технологии](#-технологии)
- [📝 Кастомизация](#-кастомизация)
- [🐛 Troubleshooting](#-troubleshooting)

## 📊 Схемы

### Визуализация Masonry Grid

```
Desktop (3 колонки):              Mobile (1 колонка):
┌────────┬────────┬────────┐      ┌──────────────────┐
│ Card 1 │ Card 2 │ Card 3 │      │     Card 1       │
│        ├────────┤        │      ├──────────────────┤
│        │ Card 5 │        │      │     Card 2       │
├────────┤        ├────────┤      ├──────────────────┤
│ Card 4 │        │ Card 6 │      │     Card 3       │
│        ├────────┤        │      ├──────────────────┤
│        │ Card 8 │        │      │     Card 4       │
├────────┤        ├────────┤      ├──────────────────┤
│ Card 7 │        │ Card 9 │      │     Card 5       │
└────────┴────────┴────────┘      └──────────────────┘

Shortest Column First:
Карточка всегда добавляется в самую короткую колонку
```

### Архитектура компонентов

```
┌─────────────────────────────────────────────┐
│          page.tsx (Server)                  │
│  ┌───────────────────────────────────────┐  │
│  │   AppHomePage (Client Wrapper)        │  │
│  │  ┌─────────────────────────────────┐  │  │
│  │  │  MasonryGrid (Server Component) │  │  │
│  │  │  - SEO разметка                 │  │  │
│  │  │  - <noscript> fallback          │  │  │
│  │  │  ┌───────────────────────────┐  │  │  │
│  │  │  │ ArticleList (Client)      │  │  │  │
│  │  │  │ - useState (displayCount) │  │  │  │
│  │  │  │ - useResponsiveColumns    │  │  │  │
│  │  │  │ - distributeArticles()    │  │  │  │
│  │  │  │ - Framer Motion           │  │  │  │
│  │  │  │  ┌─────────────────────┐  │  │  │  │
│  │  │  │  │ ArticleCard (×N)    │  │  │  │  │
│  │  │  │  │ - useMediaQuery     │  │  │  │  │
│  │  │  │  │ - Hover анимации    │  │  │  │  │
│  │  │  │  │ - Schema.org        │  │  │  │  │
│  │  │  │  └─────────────────────┘  │  │  │  │
│  │  │  │  ┌─────────────────────┐  │  │  │  │
│  │  │  │  │ LoadMoreButton      │  │  │  │  │
│  │  │  │  └─────────────────────┘  │  │  │  │
│  │  │  └───────────────────────────┘  │  │  │
│  │  └─────────────────────────────────┘  │  │
│  └───────────────────────────────────────┘  │
└─────────────────────────────────────────────┘
```

### Поток данных

```
┌──────────────┐
│ mockArticles │ (данные)
└──────┬───────┘
       │
       ▼
┌──────────────────┐
│  MasonryGrid     │ (Server Component)
│  - Получает      │
│    articles[]    │
└──────┬───────────┘
       │
       ▼
┌──────────────────┐
│  ArticleList     │ (Client Component)
│  - displayCount  │ ◄──── useState (12 → 24 → 36...)
│  - columnCount   │ ◄──── useResponsiveColumns(window.innerWidth)
└──────┬───────────┘
       │
       ▼
┌──────────────────────────────┐
│  distributeArticles()         │
│  - Алгоритм распределения    │
│  - Оценка высоты карточек    │
│  - Shortest column first     │
└──────┬───────────────────────┘
       │
       ▼
┌──────────────────────────────┐
│  columns: Article[][]         │
│  [[card1, card4, card7],     │
│   [card2, card5, card8],     │
│   [card3, card6, card9]]     │
└──────┬───────────────────────┘
       │
       ▼
┌──────────────────────────────┐
│  Рендер колонок + карточек   │
│  + Framer Motion анимации    │
└──────────────────────────────┘
```

### Responsive Breakpoints Flow

```
Window Width ──────────────┐
                           │
      ┌────────────────────▼────────────────────┐
      │    useResponsiveColumns(debounce)       │
      │    - Отслеживает resize                 │
      │    - Debounce 100ms                     │
      └────────────────────┬────────────────────┘
                           │
      ┌────────────────────▼────────────────────┐
      │         getColumnCount(width)           │
      ├─────────────────────────────────────────┤
      │  < 768px         → 1 колонка            │
      │  768px - 1199px  → 2 колонки            │
      │  1200px - 1799px → 3 колонки            │
      │  1800px - 2399px → 4 колонки            │
      │  2400px - 3199px → 5 колонок            │
      │  ≥ 3200px        → 6 колонок            │
      └────────────────────┬────────────────────┘
                           │
      ┌────────────────────▼────────────────────┐
      │   Пересчёт distributeArticles()         │
      │   Плавная Layout анимация               │
      └─────────────────────────────────────────┘
```

### Hydration Mismatch Prevention

```
SSR (Server)                    CSR (Client)
─────────────                   ────────────

columnCount = 3 (default)       ┌─ isMounted = false
       │                        │  columnCount = 3
       ▼                        │  effectiveColumnCount = 3
Рендер HTML                     │
с 3 колонками ───────────────► Гидратация ✅
       │                        └─ HTML совпадает
       │
       │                        ┌─ useEffect(() => {
       │                        │    setIsMounted(true)
       │                        │  })
       │                        │
       │                        ▼
       │                        isMounted = true
       │                        columnCount = реальное (1-6)
       │                        effectiveColumnCount = реальное
       │                        │
       │                        ▼
       │                        Пересчёт + Layout анимация
```

## 🎯 Особенности

- **6 брейкпоинтов**: 1-6 колонок в зависимости от разрешения (mobile → ultra-wide)
- **Shortest Column First**: алгоритм распределения для сбалансированной высоты колонок
- **Staggered анимации**: плавное появление карточек с эффектом волны
- **SSR-friendly**: предотвращение hydration mismatch
- **SEO-оптимизация**: Schema.org разметка, семантический HTML, fallback для ботов
- **Accessibility**: поддержка `prefers-reduced-motion`
- **Lazy loading**: отложенная загрузка изображений (кроме первых двух)
- **"Загрузить ещё"**: постепенная подгрузка статей

## 📦 Структура

```
masonry/
├── types/          # TypeScript типы (Article)
├── data/           # Mock-данные для разработки
├── hooks/          # React хуки (responsive, media query, reduced motion)
├── utils/          # Утилиты (алгоритм распределения)
├── *.tsx           # Компоненты (MasonryGrid, ArticleList, ArticleCard, LoadMoreButton)
├── *.scss          # Стили компонентов
└── index.ts        # Публичный API модуля
```

## 🚀 Использование

```tsx
import { MasonryGrid } from '@/components/common/masonry';
import { mockArticles } from '@/components/common/masonry/data';

export default function Page() {
  return <MasonryGrid articles={mockArticles} />;
}
```

### С кастомными данными

```tsx
import { MasonryGrid, Article } from '@/components/common/masonry';

const articles: Article[] = [
  {
    id: '1',
    title: 'Заголовок',
    subtitle: 'Подзаголовок',
    createdAt: '2025-10-15T10:00:00Z',
    summary: '<p>HTML-контент</p>',
    slug: 'article-slug',
    imageUrl: '/images/article.jpg', // опционально
    category: 'Технологии',
    readTime: 10,
  },
  // ...
];

<MasonryGrid articles={articles} />;
```

## 🏗️ Архитектура

### Server Component

- **MasonryGrid** — корневой компонент, рендерится на сервере для SEO

### Client Components

- **ArticleList** — управляет состоянием, анимациями и распределением по колонкам
- **ArticleCard** — карточка статьи с hover-эффектами (маркер-подчёркивание)
- **LoadMoreButton** — кнопка постепенной загрузки

### Responsive Columns

| Разрешение      | Колонки | Breakpoint |
| --------------- | ------- | ---------- |
| < 768px         | 1       | Mobile     |
| 768px - 1199px  | 2       | Tablet     |
| 1200px - 1799px | 3       | Desktop    |
| 1800px - 2399px | 4       | Large      |
| 2400px - 3199px | 5       | XL         |
| ≥ 3200px        | 6       | Ultra-Wide |

### Алгоритм распределения

**Shortest Column First** — каждая статья добавляется в колонку с минимальной текущей высотой:

1. Оценка высоты карточки (заголовок + изображение + аннотация)
2. Поиск самой короткой колонки
3. Добавление статьи в эту колонку
4. Обновление высоты колонки

### Hydration Mismatch Prevention

На сервере всегда используется **3 колонки** для предсказуемого SSR. После mount на клиенте происходит пересчёт под
реальное разрешение с плавной анимацией.

```tsx
const effectiveColumnCount = isMounted ? columnCount : 3;
```

### Анимации (Framer Motion)

- **Staggered entrance**: задержка 0.015s между карточками
- **Overlapping timing**: анимации начинаются внахлёст, не последовательно
- **Layout animations**: плавное перестроение при resize
- **AnimatePresence**: корректная анимация новых элементов при "Загрузить ещё"

### Hover-эффекты

**Двойной gradient** для multi-line подчёркивания заголовка и подзаголовка:

```scss
background: linear-gradient(transparent, transparent), linear-gradient(var(--mark-green-bg), var(--mark-green-bg));
background-size:
  100% 0.6em,
  0 0.6em;

&:hover {
  background-size:
    0 2em,
    100% 2em; // Маркер слева направо
}
```

- Заголовок: анимация 0.3s
- Подзаголовок: анимация 0.3s с задержкой 0.35s
- Обратная анимация: 0.15s (быстрее)

## 🎨 Адаптивность

### Desktop/Tablet

Показывает все элементы: заголовок, подзаголовок, дата, изображение, аннотация

### Mobile (< 768px)

Скрывает изображение и аннотацию для компактности

## ♿ Accessibility

- Semantic HTML (`<article>`, `<header>`, `<time>`)
- Schema.org микроразметка (JSON-LD)
- `prefers-reduced-motion` поддержка
- `<noscript>` fallback для ботов
- ARIA-атрибуты

## 🔧 Технологии

- **React 18+** (Server/Client Components)
- **Next.js 14+** (App Router)
- **TypeScript**
- **Framer Motion** (анимации)
- **SCSS Modules** (стили)

## 📝 Кастомизация

Все стили используют CSS-переменные из темы:

```scss
--color-background-primary
--color-text-primary
--color-text-secondary
--color-text-tertiary
--mark-green-bg
```

Для изменения анимаций:

```tsx
// ArticleList.tsx
const cardTransition = {
  duration: 0.25, // Скорость анимации
  ease: [0.25, 0.46, 0.45, 0.94], // Easing
};
```

## 🐛 Troubleshooting

**Hydration mismatch** — убедитесь, что `isMounted` state работает корректно  
**Неравномерные колонки** — проверьте функцию `estimateArticleHeight`  
**Нет анимации** — проверьте `prefers-reduced-motion` в системных настройках
