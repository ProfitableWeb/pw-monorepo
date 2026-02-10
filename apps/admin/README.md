# ProfitableWeb Admin

> 🎛️ Панель управления контентом для ProfitableWeb

## 📋 Обзор

Административная панель для управления блогом ProfitableWeb: статьи, категории, теги, медиа, аналитика, SEO и
AI-ассистент.

Дизайн создан в [Figma Make](https://www.figma.com/design/uNCNgquZOv719TpyNR1QGv/Blog-Management-Dashboard)

## 🛠️ Технологический стек

- **Runtime**: Bun
- **Build**: Vite 6
- **Framework**: React 18 (SPA)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4 + shadcn/ui + Radix UI
- **Icons**: Lucide React
- **State Management**: Zustand
- **Charts**: Recharts
- **Animations**: Motion (Framer Motion)
- **Theme**: next-themes (light/dark)

## 🚀 Quick Start

```bash
# Из корня монорепо
bun install
bun turbo dev --filter=@profitable-web/admin

# Или из apps/admin
bun run dev
```

Сервер запускается на **http://localhost:3001**

## 📁 Структура

```
src/
├── main.tsx                    # Точка входа
├── styles/
│   ├── index.css               # Главный CSS
│   ├── fonts.css               # Шрифты
│   ├── tailwind.css            # Tailwind v4 конфигурация
│   └── theme.css               # CSS-переменные темы
└── app/
    ├── App.tsx                 # Корневой компонент + роутинг
    ├── components/
    │   ├── ui/                 # 50 shadcn/ui компонентов
    │   ├── icons/              # Система иконок
    │   └── [feature]/          # Компоненты страниц
    ├── store/
    │   ├── navigation-store.ts # Навигация (Zustand)
    │   ├── ai-store.ts         # AI-чат (Zustand)
    │   └── header-store.ts     # Хедер (Zustand)
    └── utils/
        └── breadcrumbs-helper.ts
```

## 📄 Страницы

| Раздел       | Страницы                                                 |
| ------------ | -------------------------------------------------------- |
| **Главное**  | Dashboard, AI Center                                     |
| **Контент**  | Articles, Calendar, Categories, Tags, Media, Content Hub |
| **Редакция** | Editorial Hub, Manifest, Style, Formats, Socials         |
| **Система**  | Settings, Users, Promotion, Analytics, Ads, SEO          |

## 🎨 Тема

Light/dark режим через CSS-переменные (oklch). Переключение — `next-themes` с классом `.dark`.

## 📝 Скрипты

```bash
bun run dev       # Dev-сервер (порт 3001)
bun run build     # Production-сборка (dist/)
bun run preview   # Превью production-сборки
```
