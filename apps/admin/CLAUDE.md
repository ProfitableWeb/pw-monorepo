# CLAUDE.md — apps/admin

Инструкции для Claude Code, специфичные для админ-панели.

## Что это

Админ-панель ProfitableWeb — редакционный интерфейс для управления контентом исследовательского блога.

Часть Turborepo-монорепо наряду с:

- `apps/web` — публичный фронтенд (Next.js 15, SSR, SCSS-модули)
- `apps/api` — бэкенд (FastAPI, PostgreSQL)
- `packages/types` — общие TypeScript-типы (`@profitable-web/types`)

**Интеграция с экосистемой:**

- **API**: все данные — через `lib/api-client.ts` → `apps/api` (переменная `VITE_API_URL`)
- **Iframe-превью**: редактор статей загружает `apps/web` в iframe для живого предпросмотра (postMessage-протокол:
  `preview:ready` → `preview:update` → `preview:scroll/click/theme/resize`)
- **Общие типы**: импорт из `@profitable-web/types` для консистентности между admin и web
- **Деплой**: nginx проксирует `/admin/` → Vite SPA на порту 3001

**Зависимости при запуске:**

Админка не работает изолированно — ей нужны API и (для превью) web-приложение.

```bash
# Всё сразу (из корня монорепо)
bun turbo dev

# Или по отдельности (минимум admin + api)
bun turbo dev --filter=@profitable-web/admin   # порт 3001
bun turbo dev --filter=@profitable-web/api     # порт 8000 — авторизация, данные
bun turbo dev --filter=@profitable-web/web     # порт 3000 — iframe-превью статей
```

- Без `api` — не пройдёт авторизация, не загрузятся статьи/категории
- Без `web` — редактор работает, но iframe-превью статей и карточек будет недоступно

## Стек

Vite + React 19 + Tailwind CSS + Radix UI + Zustand. **Не Next.js**, **не SCSS**.

## Организация кода

### Атомарная декомпозиция

Цель — **ни один файл не должен быть монолитом**. Каждый файл решает одну задачу. Если файл растёт выше ~300 строк или
содержит >3 логических блока — декомпозировать.

**Порядок декомпозиции** (от простого к сложному):

1. Константы → `{feature}.constants.ts`
2. Утилиты / чистые функции → `{feature}.utils.ts`
3. Типы (если >5 и специфичны для модуля) → `{feature}.types.ts`
4. Подкомпоненты (>100 строк JSX или >2 использований) → отдельный файл
5. Кастомные хуки (>50 строк логики или нужна изоляция для тестов) → `use{Name}.ts`

### Иерархия вложенности

```
feature/
├── FeatureName.tsx          # Оркестратор: импорты, state, композиция подкомпонентов
├── index.ts                 # Barrel-экспорт (единственная точка входа)
├── feature.types.ts         # Типы модуля
├── feature.constants.ts     # Константы модуля
├── feature.utils.ts         # Чистые утилиты
├── SubComponentA.tsx        # Подкомпонент (UI)
├── SubComponentB.tsx        # Подкомпонент (UI)
├── useFeatureLogic.ts       # Кастомный хук (бизнес-логика)
├── README.md                # Для сложных модулей: структура, паттерны, протоколы
│
├── sub-feature/             # Вложенная директория — только если ≥3 связанных файлов
│   ├── SubFeature.tsx
│   ├── sub-feature.types.ts
│   └── index.ts
│
└── shared/                  # Компоненты, переиспользуемые внутри feature (не глобально)
    ├── SharedWidget.tsx
    └── index.ts
```

**Правила вложенности:**

- Максимум 3 уровня (`feature/sub-feature/component.tsx`)
- Вложенная директория — только от 3 связанных файлов, иначе файлы остаются на уровне родителя
- Каждая директория — `index.ts` с barrel-экспортом
- Группировка по функциональности (tabs/, preview/), не по типу (components/, hooks/, utils/)

### Именование файлов

- `{feature}.types.ts` — не `types.ts` (уникальность при поиске по имени)
- `{feature}.constants.ts` — не `constants.ts`
- `{feature}.utils.ts` — не `utils.ts`
- Компоненты — PascalCase (`EditorToolbar.tsx`)
- Хуки — camelCase с `use` (`useIframeMessaging.ts`)

### JSDoc и комментарии

- Язык: **русский** (и комментарии, и JSDoc)
- JSDoc — только где реально нужен: протоколы, архитектурные решения, неочевидная логика
- Не добавлять JSDoc «чтобы было» — каждый комментарий должен экономить время читателю
- `@see` — для связей между модулями (принимающая/отправляющая сторона протокола, переиспользование)
- Inline JSDoc у констант, если назначение неочевидно из имени

### Переиспользуемые паттерны

- Общие утилиты компонента → директория `shared/` внутри feature (не глобальный shared)
- Общие хуки/компоненты между несколькими feature → выделить в `{feature-group}-shared/`
- Barrel-экспорт: `export { Component } from './Component'` — не `export * from`

## Роутинг

Клиентский через Zustand `navigation-store.ts` (без файлового роутинга). Базовый путь: `/admin/`.

## Состояние

- **Zustand** для глобального состояния (авторизация, навигация, редактор статей)
- **react-hook-form** для форм (register/watch/setValue прокидываются в подкомпоненты)
- Локальный `useState` для UI-состояния компонента

## API-клиент

Тот же паттерн, что и в web (`lib/api-client.ts`), но использует `import.meta.env.VITE_API_URL`.
