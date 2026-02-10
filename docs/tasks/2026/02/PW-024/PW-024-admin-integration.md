# PW-024: Интеграция BlogDash в apps/admin

## 📋 Информация о задаче

- **ID**: PW-024
- **Статус**: ✅ DONE
- **Создано**: 2026-02-10
- **Завершено**: 2026-02-10
- **Приоритет**: High 🔥
- **Компонент**: ⚛️ Frontend (Admin)
- **Теги**: #admin #integration #tailwind #shadcn
- **Оценка времени**: 2-4 часа

## 🎯 Постановка задачи

### Описание

Интегрировать готовую админку из `F:\_GITHUB-APPS\BlogDash` в `apps/admin` монорепо.

**Исходник (BlogDash):**

- Vite + React 18
- Tailwind CSS + shadcn/ui + Radix UI + MUI
- Zustand для state management
- Собственный роутинг на основе состояния

**Цель (apps/admin):**

- Next.js 15 + React 19
- Сохранить дизайн-систему shadcn/ui (Tailwind)
- Заменить роутинг на Next.js App Router
- Интегрировать в монорепо (Bun workspaces, turbo)

### Цель

Быстро получить MVP админки с профессиональным UI/UX, разработанным в Figma Make.

### Критерии приемки

- [ ] `apps/admin` работает на Next.js 15
- [ ] Tailwind CSS настроен и работает
- [ ] Все компоненты из BlogDash перенесены
- [ ] Роутинг переписан на Next.js App Router
- [ ] Zustand store работает корректно
- [ ] Админка запускается через `bun turbo dev --filter=@profitable-web/admin`
- [ ] Нет ошибок TypeScript и ESLint
- [ ] UI соответствует оригиналу из BlogDash

## 📋 План выполнения

### Этап 1: Подготовка apps/admin

- [ ] Очистить существующий скелет `/admin` (если нужно)
- [ ] Удалить SCSS конфигурацию (если есть)
- [ ] Обновить `package.json` с зависимостями из BlogDash
- [ ] Настроить Tailwind CSS для Next.js

### Этап 2: Перенос компонентов

- [ ] Скопировать `src/app/components/` из BlogDash в `apps/admin/src/components/`
- [ ] Перенести Zustand store в `apps/admin/src/store/`
- [ ] Перенести утилиты в `apps/admin/src/utils/`

### Этап 3: Адаптация под Next.js

- [ ] Создать структуру роутов в `apps/admin/src/app/`:
  - `/page.tsx` → Dashboard
  - `/articles/page.tsx` → Articles
  - `/categories/page.tsx` → Categories
  - `/tags/page.tsx` → Tags
  - `/media/page.tsx` → Media
  - `/ai/page.tsx` → AI Center
  - `/editorial/page.tsx` → Editorial Hub
  - `/content/page.tsx` → Content Hub
  - `/formats/page.tsx` → Formats
  - `/socials/page.tsx` → Socials
  - `/settings/page.tsx` → Settings
  - `/users/page.tsx` → Users
  - `/promotion/page.tsx` → Promotion
  - `/analytics/page.tsx` → Analytics
  - `/ads/page.tsx` → Ads
  - `/seo/page.tsx` → SEO
- [ ] Заменить state-based роутинг на Next.js App Router
- [ ] Создать layout с SidebarNav + Header

### Этап 4: Конфигурация

- [ ] Настроить `tsconfig.json` с path aliases (`@/*`)
- [ ] Настроить `tailwind.config.ts`
- [ ] Обновить `next.config.js` если нужно
- [ ] Добавить в `turbo.json` задачи для `/admin`

### Этап 5: Тестирование

- [ ] Проверить все страницы админки
- [ ] Проверить навигацию между разделами
- [ ] Проверить мобильную адаптивность
- [ ] Проверить тему (dark/light)

## 🔗 Связанные задачи

- **Блокируется**: PW-022 (дизайн админки завершен)
- **Блокирует**: Интеграция с backend API (будущие задачи)

## 📝 Заметки

### Зависимости из BlogDash

Основные зависимости для переноса:

```json
{
  "dependencies": {
    "@emotion/react": "11.14.0",
    "@emotion/styled": "11.14.1",
    "@mui/material": "7.3.5",
    "@mui/icons-material": "7.3.5",
    "@radix-ui/react-*": "latest",
    "cmdk": "1.1.1",
    "date-fns": "3.6.0",
    "lucide-react": "0.487.0",
    "motion": "12.23.24",
    "next-themes": "0.4.6",
    "react-hook-form": "7.55.0",
    "recharts": "2.15.2",
    "sonner": "2.0.3",
    "vaul": "1.1.2",
    "zustand": "^5.0.11"
  }
}
```

### Tailwind конфигурация

```js
// apps/admin/tailwind.config.ts
import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      // TODO: скопировать из BlogDash
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
```

### Риски

- **Различие React версий**: BlogDash на React 18, admin будет на React 19
- **MUI + Next.js**: Возможны проблемы с SSR, нужно тестировать
- **State-based роутинг**: Требуется полная переписка на App Router

### Техдолг

После завершения задачи будет техдолг:

- Дублирование UI систем (Tailwind в admin, SCSS в web)
- MUI — тяжёлые зависимости
- В будущем: рефакторинг на единую дизайн-систему

---

**Статусы**: TODO → DOING → TESTING → DONE
