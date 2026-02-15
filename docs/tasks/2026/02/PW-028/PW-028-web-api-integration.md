# PW-028: Интеграция клиентского фронта с реальным API

## 📋 Информация о задаче

- **ID**: PW-028
- **Статус**: TODO
- **Создано**: 2026-02-15
- **Приоритет**: High ⚡
- **Компонент**: ⚛️ Frontend (apps/web)
- **Теги**: #frontend #nextjs #react-query #api-integration

## 🎯 Постановка задачи

### Описание

Замена mock-api.ts в apps/web реальными запросами к Backend Content API (PW-027). Next.js 15 App Router: Server
Components используют async/await fetch, Client Components — React Query. Авторизация не реализуется — форма
комментариев disabled.

### Цель

Клиентский сайт отображает реальные данные из PostgreSQL через FastAPI. mock-api.ts больше не используется. Все страницы
(категории, статьи, комментарии) работают с живым API.

### Критерии приемки

- [ ] API-клиент создан (src/lib/api-client.ts) с типизированными fetch-обёртками
- [ ] React Query Provider настроен (src/components/providers/)
- [ ] Все mock-api функции заменены реальными вызовами:
  - [ ] getAllCategories() → GET /api/categories
  - [ ] getCategoryBySlug() → GET /api/categories/{slug}
  - [ ] getAllArticles() → GET /api/articles
  - [ ] getArticleBySlug() → GET /api/articles/{slug}
  - [ ] getArticlesByCategory() → GET /api/categories/{slug}/articles
  - [ ] getArticleComments() → GET /api/articles/{slug}/comments
  - [ ] getUserComments() → GET /api/users/{id}/comments
- [ ] Server Components: прямые fetch-вызовы в page.tsx / layout.tsx
- [ ] Client Components: React Query hooks (комментарии, пагинация)
- [ ] Loading states (Skeleton UI) для всех страниц
- [ ] Error states (404, 500, network) с fallback UI
- [ ] Переменная окружения NEXT_PUBLIC_API_URL в .env.local
- [ ] mock-api.ts удалён или помечен как deprecated
- [ ] bun run build проходит без ошибок
- [ ] bun run type-check проходит без ошибок

### Зависимости

- [x] PW-027: Backend Content API (завершена)
- [ ] API сервер доступен на localhost:8000

### Что НЕ входит

- **Авторизация** — форма комментариев disabled, JWT → отдельная задача
- **Создание/редактирование контента** — только чтение (GET)
- **SSG/ISR оптимизация** — пока CSR + SSR, статическая генерация позже
- **Redis-кеширование** — серверный кеш позже

## 🔧 Технические детали

### Архитектура запросов

```
Server Components (page.tsx)     → fetch() напрямую к API (SSR)
Client Components (comments)     → React Query hooks (CSR)
```

### Структура файлов

```
apps/web/src/
├── lib/
│   ├── api-client.ts              # Типизированный fetch wrapper
│   ├── query-keys.ts              # React Query key factories
│   └── mock-api.ts                # УДАЛИТЬ после интеграции
├── hooks/
│   └── api/
│       ├── useArticleComments.ts   # React Query hook
│       └── useUserComments.ts      # React Query hook
├── components/
│   └── providers/
│       └── QueryProvider.tsx        # React Query Provider
└── app/
    └── [slug]/
        └── page.tsx                # Заменить mock на fetch
```

### API Client

```typescript
// apps/web/src/lib/api-client.ts
const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

// Типизированные функции, повторяющие контракт mock-api.ts
export async function getAllCategories(): Promise<ApiResponse<Category[]>>;
export async function getArticleBySlug(slug: string): Promise<ApiResponse<Article>>;
// ... и т.д.
```

### Гибридный подход SSR + CSR

- **SSR (Server Components)**: категории, статьи — fetch в page.tsx
- **CSR (Client Components)**: комментарии — React Query с polling/refetch
- **Prefetch**: комментарии можно prefetch на сервере → hydrate на клиенте

### Эндпоинты

| Функция mock-api        | Метод | Эндпоинт                        | Где используется           |
| ----------------------- | ----- | ------------------------------- | -------------------------- |
| getAllCategories()      | GET   | /api/categories                 | Навигация, страница рубрик |
| getCategoryBySlug()     | GET   | /api/categories/{slug}          | [slug]/page.tsx            |
| getAllArticles()        | GET   | /api/articles                   | Главная, masonry           |
| getArticleBySlug()      | GET   | /api/articles/{slug}            | [slug]/page.tsx            |
| getArticlesByCategory() | GET   | /api/categories/{slug}/articles | Страница категории         |
| getArticleComments()    | GET   | /api/articles/{slug}/comments   | Блок комментариев          |
| getUserComments()       | GET   | /api/users/{id}/comments        | Мои комментарии            |

## ✅ Чеклист выполнения

### TODO → DOING

- [ ] Задача проанализирована
- [ ] План реализации готов
- [ ] Зависимости проверены (API сервер запущен)

### DOING → TESTING

**Фаза 1: Инфраструктура**

- [ ] Создать api-client.ts (типизированный fetch wrapper)
- [ ] Настроить .env.local (NEXT_PUBLIC_API_URL)
- [ ] Установить @tanstack/react-query
- [ ] Создать QueryProvider + подключить в providers

**Фаза 2: Server Components**

- [ ] Заменить mock-вызовы в [slug]/page.tsx
- [ ] Обновить главную страницу (статьи, категории)
- [ ] Обновить страницу категории
- [ ] Обновить навигацию (список категорий)

**Фаза 3: Client Components**

- [ ] useArticleComments hook (React Query)
- [ ] Обновить ArticleCommentsBlock
- [ ] useUserComments hook (React Query)
- [ ] Обновить страницу "Мои комментарии"
- [ ] Форма комментариев → disabled (без auth)

**Фаза 4: UI States**

- [ ] Loading Skeleton для всех страниц
- [ ] Error fallback (404, 500, network)
- [ ] Empty states

### TESTING → CODEREVIEW & DOCS

- [ ] Все страницы отображают реальные данные
- [ ] Пагинация работает
- [ ] 404 для несуществующих slug
- [ ] bun run build проходит
- [ ] bun run type-check проходит

### CODEREVIEW & DOCS → DONE

- [ ] Код соответствует стандартам
- [ ] mock-api.ts удалён/deprecated
- [ ] .env.example обновлён

## 🔗 Связанные задачи

- **Зависит от**: PW-027 (Backend Content API) ✅
- **Связана с**: PW-029 (Admin API интеграция)
- **Блокирует**: интеграция авторизации на фронте (будущая задача)

## 📝 Заметки

### История изменений

- 2026-02-15: Задача создана

---

**Статусы**: TODO → DOING → TESTING → CODEREVIEW & DOCS → DONE
