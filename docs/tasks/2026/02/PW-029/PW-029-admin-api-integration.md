# PW-029: Интеграция админ-панели с реальным API

## 📋 Информация о задаче

- **ID**: PW-029
- **Статус**: TODO
- **Создано**: 2026-02-15
- **Приоритет**: High ⚡
- **Компонент**: ⚙️ Admin (apps/admin)
- **Теги**: #admin #react-query #api-integration #vite

## 🎯 Постановка задачи

### Описание

Подключение админки (apps/admin) к Backend Content API (PW-027) для чтения данных. Замена inline mock-данных в
компонентах на React Query hooks. Только GET-операции. CRUD (создание/редактирование/удаление) — отдельная задача.

### Цель

Админка отображает реальные данные из PostgreSQL: списки статей, категорий, комментариев с пагинацией, фильтрацией и
поиском. React Query DevTools для отладки в dev-режиме.

### Критерии приемки

- [ ] @tanstack/react-query установлен и настроен
- [ ] QueryClientProvider обёрнут вокруг <App /> в main.tsx
- [ ] React Query DevTools подключены (dev mode)
- [ ] API-клиент создан (src/lib/api-client.ts)
- [ ] React Query hooks для всех GET-эндпоинтов:
  - [ ] useCategories() → GET /api/categories
  - [ ] useArticles(params) → GET /api/articles (пагинация + фильтры)
  - [ ] useArticle(slug) → GET /api/articles/{slug}
  - [ ] useArticleComments(slug) → GET /api/articles/{slug}/comments
  - [ ] useUserComments(userId) → GET /api/users/{id}/comments
- [ ] Компоненты обновлены:
  - [ ] categories-section.tsx — реальные категории
  - [ ] articles-section.tsx — реальные статьи + пагинация
  - [ ] posts-table.tsx — реальные данные
  - [ ] dashboard-section.tsx — актуальные stats
- [ ] Loading states (Skeleton) во всех компонентах
- [ ] Error states (retry / fallback UI)
- [ ] VITE_API_URL в .env.local
- [ ] bun run build проходит без ошибок

### Зависимости

- [x] PW-027: Backend Content API (завершена)
- [x] PW-024: BlogDash интеграция в admin (завершена)
- [ ] API сервер доступен на localhost:8000

### Что НЕ входит

- **CRUD операции** (POST/PUT/DELETE) → требует Admin CRUD API (будущая задача)
- **Авторизация** — mock-admin user, реальный auth позже
- **Файл-менеджер / медиа** — отдельная задача
- **Real-time обновления** (WebSocket) — React Query polling достаточно
- **Drag-n-drop сохранение** — DnD работает только в UI, без persist

## 🔧 Технические детали

### Особенности админки

- **React 19 + Vite** (не Next.js — нет SSR)
- **Zustand** для client state (navigation, auth, header)
- **@tanstack/react-query** НЕ установлен — нужно добавить
- **shadcn/ui** компоненты для UI
- Env через `import.meta.env.VITE_API_URL`

### Структура файлов

```
apps/admin/src/
├── lib/
│   ├── api-client.ts          # Fetch/axios wrapper
│   └── query-keys.ts          # Query key factories
├── hooks/
│   └── api/
│       ├── useCategories.ts
│       ├── useArticles.ts     # С пагинацией + фильтрами
│       ├── useArticle.ts
│       └── useComments.ts
├── providers/
│   └── QueryProvider.tsx      # QueryClientProvider + DevTools
└── app/
    └── components/
        ├── categories-section.tsx  # Обновить
        ├── articles-section.tsx    # Обновить
        ├── posts-table.tsx         # Обновить
        └── dashboard-section.tsx   # Обновить
```

### Mock Admin User (заглушка до auth)

```typescript
// Временный mock — заменится при реализации auth
const MOCK_ADMIN = { id: '1', name: 'Admin', role: 'admin' };
// useAuthStore.isAuthenticated = true по умолчанию
```

### Эндпоинты

| Hook                        | Метод | Эндпоинт                      | Параметры                                     |
| --------------------------- | ----- | ----------------------------- | --------------------------------------------- |
| useCategories()             | GET   | /api/categories               | —                                             |
| useArticles(params)         | GET   | /api/articles                 | page, limit, category, search, sort_by, order |
| useArticle(slug)            | GET   | /api/articles/{slug}          | —                                             |
| useArticleComments(slug)    | GET   | /api/articles/{slug}/comments | —                                             |
| useUserComments(id, params) | GET   | /api/users/{id}/comments      | query, limit, offset                          |

## ✅ Чеклист выполнения

### TODO → DOING

- [ ] Задача проанализирована
- [ ] Компоненты с mock-данными идентифицированы
- [ ] Зависимости проверены (API сервер запущен)

### DOING → TESTING

**Фаза 1: Установка и настройка React Query**

- [ ] bun add @tanstack/react-query @tanstack/react-query-devtools
- [ ] Создать QueryProvider.tsx
- [ ] Обернуть <App /> в main.tsx

**Фаза 2: API Client**

- [ ] Создать lib/api-client.ts
- [ ] Создать lib/query-keys.ts
- [ ] Настроить .env.local (VITE_API_URL)

**Фаза 3: React Query Hooks**

- [ ] useCategories.ts
- [ ] useArticles.ts (с пагинацией + фильтрами)
- [ ] useArticle.ts
- [ ] useComments.ts (article + user)

**Фаза 4: Интеграция компонентов**

- [ ] categories-section.tsx: заменить mock → useCategories()
- [ ] articles-section.tsx: заменить mock → useArticles()
- [ ] posts-table.tsx: заменить mock → useArticles({ limit: 5 })
- [ ] dashboard-section.tsx: stats из useArticles() + useCategories()

**Фаза 5: UI States**

- [ ] Loading Skeleton для всех секций
- [ ] Error states (retry + fallback)
- [ ] Empty states ("Нет данных")

### TESTING → CODEREVIEW & DOCS

- [ ] Все секции отображают реальные данные
- [ ] Пагинация работает
- [ ] React Query DevTools работают в dev
- [ ] bun run build проходит

### CODEREVIEW & DOCS → DONE

- [ ] Код соответствует стандартам
- [ ] TypeScript без ошибок
- [ ] .env.example обновлён

## 🔗 Связанные задачи

- **Зависит от**: PW-027 (Backend Content API) ✅
- **Связана с**: PW-028 (Web Frontend интеграция)
- **Блокирует**: Admin CRUD UI (будущая задача)

## 📝 Заметки

### История изменений

- 2026-02-15: Задача создана

---

**Статусы**: TODO → DOING → TESTING → CODEREVIEW & DOCS → DONE
