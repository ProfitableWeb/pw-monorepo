# MR: Article Workbench + атомарная декомпозиция админки (PW-037)

## Кратко

Реализована рабочая среда для редактирования статей (Workbench) в Admin + проведена полная атомарная декомпозиция всех
секций `components/sections/`. Mock-first, без бэкенд-интеграции.

## Ссылка на задачу

**PW-037** — [docs/tasks/2026/03/PW-037/PW-037.md](./PW-037.md)

## Что сделано

### 1. Article Workbench — редактор статей

#### Вкладки (Radix Tabs)

- **Карточка** — форма метаданных (H1, подзаголовок, миниатюра, excerpt в Monaco/WYSIWYG, категория, метки) + **Live
  Card Preview** в iframe (реальный `ArticleCard` из `apps/web`, тема, zoom, ресайз ширины).
- **SEO** — SERP-превью (Google), JSON-LD, Telegram-превью, SEO-оценка, счётчики символов.
- **Редактор** — split-view: Monaco (HTML/Markdown/Visual) с плавающей панелью настроек (13 тем, шрифт, таб,
  форматтер) + **Device Preview** (десктоп/планшет/мобильный, postMessage).
- **Артефакты** — блоки: Самопроверка, Источники, Глоссарий, Происхождение (заглушки под будущую интеграцию с
  AI/Workspace).
- **Исследование** — заглушка под связь с Research Workspace (PW-039).
- **История** — заглушка под таймлайн ревизий.

#### Инфраструктура превью

- В **apps/web**: роуты `/preview` (страница статьи) и `/preview/card` (карточка), layout с `noindex`.
- postMessage-протокол: `preview:ready`, `preview:update`, `preview:theme`, `preview:resize`.

#### Общие компоненты

- **EditorSettingsPanel** — переиспользуемая плавающая панель настроек Monaco (темы, шрифт, таб, перенос строк,
  миникарта, Prettier).
- **editor-themes.ts** — 13 кастомных тем Monaco.
- **FormFieldInput** (ui/form-field) — поле с label, hint и ссылкой на базу знаний SEO.
- **MiniWysiwygEditor** — WYSIWYG-режим для excerpt в CardTab.

### 2. Атомарная декомпозиция всех секций

Полная реструктуризация `components/sections/` — все 21 секция приведены к единому паттерну:

**Паттерн:** оркестратор + `assets/` (внутренние подкомпоненты) + `index.ts` (barrel-экспорт)

| Секция                                   | Что сделано                                                                 |
| ---------------------------------------- | --------------------------------------------------------------------------- |
| **ai-center**                            | 6 subdirs, эталонная структура, README                                      |
| **article-workbench**                    | 10 subdirs (tabs/, preview/, editor/), README                               |
| **settings**                             | profile/ + security/ с assets/, shared/SettingRow                           |
| **calendar**                             | views/ + settings-dialog/ с assets/                                         |
| **media**                                | preview/ с assets/ (PreviewPanel, SeoForm, ExifForm)                        |
| **seo**                                  | assets/ (8 settings-табов), knowledge-base/ без изменений                   |
| **users**                                | assets/ (4 таба) + access/ с assets/ (4 карточки)                           |
| **style**                                | assets/ (8 подкомпонентов)                                                  |
| **tags**                                 | assets/ (5 view/dialog компонентов)                                         |
| **manifest**                             | assets/ (DocSection, StubSections)                                          |
| **articles**                             | assets/ (FiltersToolbar, ArticlesTable, StatsCards)                         |
| **categories**                           | assets/ (SortableCategoryCard, CategoryDialog, DragOverlayCard)             |
| **promotion**                            | assets/ (StatsGrid, ChannelCard, CampaignCard, QuickActions)                |
| **analytics**                            | assets/ (StatsCards, ViewsChart, DevicesChart, TrafficSources, TopArticles) |
| **ads**                                  | assets/ (CampaignCard, AdsStatsGrid, PlacementCard)                         |
| **dashboard**                            | assets/ (BlogStats, AnalyticsChart, PostsTable)                             |
| **research**                             | assets/ (ResearchSidebar, ResearchHeader)                                   |
| content-hub, editorial, formats, socials | По 1 компоненту — декомпозиция не нужна                                     |

### 3. Документация и стандарты

- **CLAUDE.md** (apps/admin) — правила атомарной декомпозиции, иерархия вложенности, именование файлов.
- **Шаблон README** (`docs/templates/section-readme-template.md`) для новых секций.
- **README.md** в декомпозированных секциях (ai-center, article-workbench, settings, calendar, media, seo, users).
- JSDoc и комментарии переведены на русский.

### Удалено / заменено

- `MetaSeoTab.tsx` заменён на `SeoTab.tsx` (SERP, JSON-LD, Telegram, счётчики).
- `WorkbenchSidebar.tsx` удалён (функционал разнесён по вкладкам).
- Убраны избыточные barrel-экспорты внутренних компонентов.

## Как проверить

1. Запустить `apps/admin` и `apps/web` (превью грузятся из web).
2. Открыть Article Workbench (статья из мока).
3. **Карточка**: править поля, переключать HTML/WYSIWYG в excerpt, менять тему/zoom в превью карточки, ресайзить ширину.
4. **SEO**: проверить отображение SERP, JSON-LD, Telegram и счётчиков.
5. **Редактор**: переключать режим (HTML/Markdown/Visual), открывать панель настроек, менять тему/шрифт, форматировать
   (Ctrl+Shift+F), переключать устройство в превью.
6. **Артефакты / Исследование / История**: убедиться, что вкладки открываются без ошибок (контент заглушки).
7. **Type-check**: `cd apps/admin && bun run type-check` — проходит без ошибок.

## Зависимости и ограничения

- **Mock-first**: все данные из `article-mock.ts`, API не вызывается.
- Для превью нужен запущенный `apps/web` (iframe загружает `/preview` и `/preview/card`).
- Research Workspace (PW-039) и бэкенд для артефактов/истории — вне scope этого MR.

## Чеклист

- [x] Линтеры и type-check проходят.
- [x] Все секции приведены к единому паттерну assets/.
- [x] Документация обновлена (CLAUDE.md, README, PW-037.md).
- [ ] Ручная проверка в браузере (по желанию перед мержем).
