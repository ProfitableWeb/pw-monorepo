# ProfitableWeb Research Lab

<br/>
  <img src="./docs/assets/imgs/ProfitableWEB_icon512x512-transparent.png" alt="ProfitableWeb Logo" width="256" height="256">
<br/>

> Открытая лаборатория по исследованию трансформации труда в эпоху AI-автоматизации

## Миссия

ProfitableWeb — исследовательский проект, изучающий механизмы преобразования личных компетенций и призвания в автономные
цифровые активы в контексте перехода к post-labor экономике.

Здесь исследуется, как AI-инструменты и системный подход к автоматизации могут освободить творческий труд от
капиталистического отчуждения, превращая вынужденную занятость в форму самореализации и творческого призвания.

## Архитектура проекта

Монорепозиторий на базе **Turborepo** с тремя приложениями:

```
ProfitableWeb/
├── apps/
│   ├── web/          # Next.js 15 Frontend (порт 3000)
│   ├── admin/        # Next.js 15 Admin Panel (порт 3001)
│   └── api/          # FastAPI Backend (порт 8000)
├── packages/
│   ├── types/        # Shared TypeScript types
│   ├── config/       # Shared configs (ESLint, Prettier, TS)
│   └── ui/           # Shared UI components (будущее)
└── docs/             # Документация
```

## Технологический стек

### Frontend (`apps/web`)

- **Next.js 15** - React фреймворк с App Router
- **Bun** - JavaScript runtime и package manager
- **TypeScript** - Type safety
- **SCSS** - Чистый CSS без UI-фреймворков
- **Framer Motion** - Анимации
- **React Query** - Server state management
- **Zustand** - Client state management

### Backend (`apps/api`)

- **Python 3.11+** - Язык для AI/ML экосистемы
- **FastAPI** - Async Python web framework
- **uv** - Быстрый package manager от Astral
- **SQLAlchemy 2.0** - ORM с async support
- **PostgreSQL** - Primary database
- **Redis** - Кэширование

### Admin Panel (`apps/admin`)

- **Next.js 15** - React фреймворк
- **TypeScript** - Type safety
- **Shared types** - из `@profitable-web/types`

### DevOps

- **Turborepo** - Монорепо build system
- **Bun Workspaces** - Package management
- **GitVerse** - Git hosting (российская платформа)
- **GitHub** - Дополнительный Git hosting для синхронизации

## Быстрый старт

### Требования

- Bun >= 1.2.17
- Python >= 3.11
- uv (для Python зависимостей)
- PostgreSQL 15+ (для production)
- Redis (для production)

### Установка

```bash
# Клонировать репозиторий
git clone https://gitverse.ru/profitableweb.ru/pw-monorepo.git
cd pw-monorepo

# Установить зависимости
bun install

# Установить Python зависимости для API
cd apps/api
uv sync
cd ../..
```

### Разработка

```bash
# Запустить все приложения одновременно
bun turbo dev

# Frontend: http://localhost:3000
# Admin: http://localhost:3001
# API: http://localhost:8000
```

### Отдельные команды

```bash
# Только Frontend
bun turbo dev --filter=@profitable-web/web

# Только API
bun turbo dev --filter=@profitable-web/api

# Только Admin
bun turbo dev --filter=@profitable-web/admin
```

### Сборка

```bash
# Собрать все приложения
bun turbo build

# Линтинг
bun turbo lint

# Тесты
bun turbo test

# Type checking
bun turbo type-check
```

## Работа с репозиториями

Проект синхронизируется с двумя Git-репозиториями:

- **GitVerse** (`origin`) - основной репозиторий: `git@gitverse.ru:profitableweb.ru/pw-monorepo.git`
- **GitHub** (`github`) - дополнительный репозиторий: `https://github.com/ProfitableWeb/pw-monorepo.git`

### Push в репозитории

```bash
# Push только в GitVerse (по умолчанию)
git push
# или
git push origin

# Push только в GitHub
git push github

# Push в оба репозитория одновременно
git pushall
```

### Настройка для новых клонов

Если клонируешь репозиторий впервые, добавь GitHub remote:

```bash
git remote add github https://github.com/ProfitableWeb/pw-monorepo.git
```

## Исследовательские вопросы

- Как AI-медиированная автоматизация трансформирует отношение "труд-капитал"?
- Какие механизмы позволяют монетизировать призвание без посредников?
- Как создаются автономные цифровые активы, работающие независимо от временных затрат создателя?
- Какова роль системного дизайна в построении post-labor экономических моделей?

## Методология

Проект сочетает практическое исследование через создание работающих прототипов (research through design) с
документированием инсайтов, метрик и паттернов успешной монетизации.

Весь исходный код основного медиа-портала ProfitableWeb.ru доступен в opensource.

## Структура документации

- [`docs/PROJECT_OVERVIEW.md`](./docs/PROJECT_OVERVIEW.md) - Общий обзор проекта
- [`docs/tasks/`](./docs/tasks/) - Задачи и спринты разработки
- `apps/*/README.md` - Документация отдельных приложений

## Целевая аудитория

- Исследователи будущего труда и постиндустриальной экономики
- Практики, экспериментирующие с AI-автоматизацией творческих процессов
- Энтузиасты построения автономных источников дохода вне традиционной занятости
- Разработчики, интересующиеся применением технологий для социальных трансформаций

## Open Source Philosophy

Весь код, инсайты и метрики публикуются открыто для репликации экспериментов и валидации гипотез сообществом.

## Лицензия

MIT License - см. [LICENSE](./LICENSE)

## Контакты

- **GitVerse**: https://gitverse.ru/profitableweb.ru/
- **GitHub**: https://github.com/ProfitableWeb/pw-monorepo
- **Организация**: profitableweb.ru

---

_Последнее обновление: январь 2026_
