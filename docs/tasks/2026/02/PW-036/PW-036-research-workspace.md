# PW-036: Исследования — рабочее пространство автора (mock-first UI)

> **Статус**: TODO **Приоритет**: High **Компонент**: ⚛️ Frontend (apps/admin) **Дата**: 2026-02-16

## Концепция

### Проблема

Традиционные CMS знают только два состояния: **черновик** и **публикация**. Но реальная работа автора-исследователя —
это сбор источников, накопление заметок, формулирование гипотез, несколько итераций черновиков, обсуждения с AI. Всё это
живёт в голове, в разрозненных документах, в истории чатов — и теряется.

Существующие инструменты решают это частично:

- **Notion/Obsidian** — организация знаний, но нет AI-ассистента и нет публикации
- **Claude Projects/ChatGPT** — AI + контекстные файлы, но результат остаётся в чате, нет pipeline в публикацию
- **WordPress/Ghost** — публикация, но нет рабочего пространства для исследования

Никто не соединил полный цикл: **исследование → AI-осмысление → черновик → публикация**.

### Решение

Новая сущность **«Исследование»** (Research) — IDE для контента. Рабочее пространство, где автор собирает материал,
думает с помощью AI, пишет черновики — и превращает результат в публикации на сайт и в соцсети.

Интерфейс по модели Cursor/VSCode: файловое дерево материалов слева, split-панели с вкладками в центре (редактор,
источники, медиа), AI-ассистент справа. Каждое исследование — изолированный контекст со своими файлами и диалогами.

Ключевое отличие от IDE: **левый сайдбар разделён на вход и выход**. Сверху — материалы (заметки, источники, черновики,
медиа). Снизу — публикации, порождённые этим исследованием (статьи, посты в соцсетях). Автор видит и процесс, и
результат.

### Принципы

- Одно исследование может породить несколько публикаций (статья, серия постов, тред)
- Публикация может существовать без исследования (быстрая заметка, новость)
- Коллаборация заложена на уровне данных (owner/editor/viewer)

## Архитектура layout-системы (кастомная, без библиотек)

```
┌─LeftSidebar─┬───────── CentralGrid ──────────┬─RightSidebar─┐
│  collapsible │  ┌─────────┬──────────┐        │  collapsible  │
│  resizable   │  │ Panel A │ Panel B  │        │  resizable    │
│  max 30%     │  │         │          │        │  max 30%      │
│              │  ├─────────┴──────────┤        │               │
│  drag handle │  │     Panel C        │        │  drag handle  │
│  ←─||─→      │  │                    │        │  ←─||─→       │
└──────────────┴──┴────────────────────┴────────┴───────────────┘
```

### Компоненты layout-системы

**ResizableSidebar** — универсальный компонент боковой панели:

- Позиция: left / right
- Collapse/expand с анимацией (toggle-кнопка)
- Drag-resize по ручке (pointer events)
- Ограничения: min-width (180px), max-width (30% viewport)
- Состояние в Zustand (ширина, collapsed)

**CentralGrid** — сетка центральной области:

- Делит область на панели (horizontal/vertical splits)
- Рекурсивная структура: split может содержать split
- Drag-resize между панелями
- Каждая ячейка рендерит `WorkspacePanel`

**WorkspacePanel** — контейнер для контента:

- Шапка с заголовком + кнопки (close, maximize, меню)
- Слот для контента: editor, preview, source-viewer, media, AI-chat
- Тип панели определяет контент через registry

**Layout Templates** — пресеты рабочего пространства:

- «Редактор» — одна панель на весь центр
- «Редактор + превью» — horizontal split 50/50
- «Исследование» — источники слева + редактор справа
- Быстрое переключение из toolbar
- Сохранение кастомного layout в localStorage

## Этапы реализации

### 036-A: ResizableSidebar

Универсальный компонент боковой панели с drag-resize.

- [ ] `ResizableSidebar` — позиция left/right, drag-resize по ручке
- [ ] Pointer events: `onPointerDown` → `onPointerMove` → `onPointerUp`
- [ ] Ограничения: min-width (180px), max-width (30% viewport)
- [ ] Collapse/expand с CSS transition (toggle-кнопка)
- [ ] Zustand slice: `workspace-layout-store.ts` (ширина, collapsed для каждого sidebar)
- [ ] Курсор `col-resize` на ручке, `user-select: none` при перетаскивании

**Файлы:**

| Файл                                         | Описание                                      |
| -------------------------------------------- | --------------------------------------------- |
| `components/workspace/resizable-sidebar.tsx` | Универсальная resizable-панель                |
| `store/workspace-layout-store.ts`            | Zustand: состояние layout (ширины, collapsed) |

### 036-B: Workspace shell

Трёхколоночный layout рабочего пространства исследования.

- [ ] `ResearchWorkspace` — контейнер: left sidebar + center + right sidebar
- [ ] Левый сайдбар: файловое дерево (заглушка)
- [ ] Центральная область: пустое состояние с подсказками
- [ ] Правый сайдбар: AI-панель (заглушка)
- [ ] Шапка исследования: название (editable inline), статус, категория
- [ ] Навигация: из списка исследований → workspace и обратно

**Файлы:**

| Файл                                | Описание                           |
| ----------------------------------- | ---------------------------------- |
| `components/research-workspace.tsx` | Основной layout workspace          |
| `components/research-header.tsx`    | Шапка: название, статус, участники |

### 036-C: CentralGrid + WorkspacePanel + Tab Bar

Split-панели в центральной области с системой вкладок а-ля VSCode.

```
┌─ WorkspacePanel ─────────────────────────────────────┐
│  [📝 Заметка 1 ✕] [✏️ Драфт v2 ✕] [🔗 Источник ✕]   │  ← tab bar
├──────────────────────────────────────────────────────┤
│                                                      │
│  Содержимое активной вкладки                         │
│  (Monaco / source viewer / media viewer / ...)       │
│                                                      │
└──────────────────────────────────────────────────────┘
```

- [ ] `CentralGrid` — рекурсивный split (horizontal/vertical)
- [ ] Drag-resize между панелями (аналогично sidebar, но внутри grid)
- [ ] `WorkspacePanel` — контейнер: tab bar + слот контента активной вкладки
- [ ] **Tab bar**: вкладки с иконкой типа, названием, кнопкой close (✕), индикатором dirty (●)
- [ ] **Preview mode** (как в VSCode): single click в сайдбаре → preview-вкладка (курсив, заменяется следующим кликом)
- [ ] **Pinned mode**: double click или начало редактирования → вкладка закрепляется
- [ ] Middle-click по вкладке → закрытие
- [ ] Кнопки панели: split horizontal/vertical, maximize (на весь центр)
- [ ] Panel registry: маппинг itemType → React-компонент

**Маппинг типов → контент:**

| Тип элемента     | Что рендерится в панели                     |
| ---------------- | ------------------------------------------- |
| `note` / `draft` | Monaco Editor (markdown)                    |
| `source`         | Source viewer (ссылка + аннотация + цитаты) |
| `media`          | Image viewer (превью + метаданные)          |
| `ai-chat`        | Chat UI (заглушка)                          |

**Модель данных layout:**

```typescript
type SplitDirection = 'horizontal' | 'vertical';

interface LayoutSplit {
  type: 'split';
  direction: SplitDirection;
  ratio: number; // 0..1, позиция разделителя
  first: LayoutNode;
  second: LayoutNode;
}

interface PanelTab {
  id: string;
  itemType: 'note' | 'draft' | 'source' | 'media' | 'ai-chat';
  itemId: string; // ID элемента исследования
  title: string;
  isPinned: boolean; // false = preview (курсив), true = закреплена
  isDirty?: boolean; // несохранённые изменения (● в заголовке)
}

interface LayoutPanel {
  type: 'panel';
  tabs: PanelTab[];
  activeTabId: string | null;
}

type LayoutNode = LayoutSplit | LayoutPanel;
```

**Файлы:**

| Файл                                       | Описание                           |
| ------------------------------------------ | ---------------------------------- |
| `components/workspace/central-grid.tsx`    | Рекурсивный split-layout           |
| `components/workspace/workspace-panel.tsx` | Контейнер: tab bar + контент       |
| `components/workspace/tab-bar.tsx`         | Вкладки с preview/pinned/dirty     |
| `components/workspace/panel-registry.ts`   | Маппинг itemType → React-компонент |
| `types/workspace-layout.ts`                | Типы LayoutNode, PanelTab и т.д.   |

### 036-D: Layout templates + persistence

Пресеты и сохранение пользовательского layout.

- [ ] Набор пресетов: «Редактор», «Редактор + превью», «Исследование» (3-panel)
- [ ] Toolbar с переключением пресетов
- [ ] Сохранение текущего layout в localStorage (per research id)
- [ ] Восстановление layout при открытии исследования

**Файлы:**

| Файл                                         | Описание                         |
| -------------------------------------------- | -------------------------------- |
| `components/workspace/layout-templates.ts`   | Определения пресетов             |
| `components/workspace/workspace-toolbar.tsx` | Toolbar: выбор пресета, действия |

### 036-E: Контент панелей

Наполнение панелей реальными компонентами.

- [ ] **Файловое дерево** (левый сайдбар): разделы «Материалы» и «Публикации»
  - Материалы: заметки, источники, черновики, медиа (дерево с иконками)
  - Публикации: связанные статьи, посты + кнопка «Создать публикацию»
- [ ] **Markdown-редактор** — Monaco Editor для заметок и черновиков
- [ ] **Просмотр источника** — ссылка + аннотация + цитаты
- [ ] **Галерея медиа** — сетка превью изображений
- [ ] **AI-панель** — заглушка чата (UI без логики)
- [ ] Пустое состояние с подсказками при первом открытии

**Файлы:**

| Файл                                        | Описание                                 |
| ------------------------------------------- | ---------------------------------------- |
| `components/research-sidebar.tsx`           | Файловое дерево (материалы + публикации) |
| `components/panels/note-editor-panel.tsx`   | Markdown-редактор                        |
| `components/panels/source-viewer-panel.tsx` | Просмотр источника                       |
| `components/panels/media-gallery-panel.tsx` | Галерея медиа                            |
| `components/panels/ai-chat-panel.tsx`       | AI-чат (заглушка)                        |

### 036-F: Список исследований + mock-данные

Страница-каталог и данные для всего workspace.

- [ ] Страница-список: карточки исследований с метаданными
  - Название, описание, статус, дата создания/обновления
  - Аватары участников, счётчики (заметки, источники, черновики, публикации)
- [ ] Статусы: идея → в работе → на ревью → завершено → архив
- [ ] Создание нового исследования (модальное окно)
- [ ] Фильтрация/поиск
- [ ] Пункт «Исследования» в sidebar-nav админки
- [ ] Mock-данные: 3-4 исследования с разными статусами и наполнением
- [ ] Zustand store: `research-store.ts` — CRUD, текущее исследование, выбранный элемент

**Файлы:**

| Файл                                | Описание                           |
| ----------------------------------- | ---------------------------------- |
| `components/research-list-page.tsx` | Страница-список исследований       |
| `store/research-store.ts`           | Zustand: данные исследований, CRUD |
| `mock/research.ts`                  | Mock-данные                        |
| `types/research.ts`                 | TypeScript-интерфейсы              |

## Модель данных (TypeScript)

```typescript
// === Исследования ===

interface Research {
  id: string;
  title: string;
  description: string;
  status: 'idea' | 'in_progress' | 'review' | 'completed' | 'archived';
  categoryId?: string;
  createdAt: string;
  updatedAt: string;
  members: ResearchMember[];
}

interface ResearchMember {
  userId: string;
  role: 'owner' | 'editor' | 'viewer';
  user: { id: string; name: string; avatarUrl?: string };
}

// === Внутренние сущности ===

interface ResearchNote {
  id: string;
  researchId: string;
  title: string;
  content: string; // markdown
  authorId: string;
  createdAt: string;
  updatedAt: string;
}

interface ResearchSource {
  id: string;
  researchId: string;
  title: string;
  url?: string;
  annotation?: string;
  quotes: string[]; // выделенные цитаты
  authorId: string;
  createdAt: string;
}

interface ResearchDraft {
  id: string;
  researchId: string;
  title: string;
  content: string; // markdown
  authorId: string;
  createdAt: string;
  updatedAt: string;
}

interface ResearchMedia {
  id: string;
  researchId: string;
  fileName: string;
  fileUrl: string;
  mimeType: string;
  size: number;
  authorId: string;
  createdAt: string;
}

interface ResearchPublication {
  id: string;
  researchId: string;
  type: 'article' | 'social_post';
  title: string;
  articleId?: string; // ссылка на опубликованную статью
  status: 'draft' | 'published';
}
```

## Порядок реализации

```
036-F Mock-данные + список     ← начинаем с данных и навигации
  └── 036-A ResizableSidebar   ← базовый building block
        └── 036-B Workspace shell   ← собираем из sidebars
              └── 036-C CentralGrid + panels   ← split-система
                    └── 036-D Templates + persistence   ← пресеты
                          └── 036-E Контент панелей   ← наполнение
```

## Вне области задачи

- ❌ Backend API (PW-037)
- ❌ Реальный AI-чат — интеграция LLM (PW-039)
- ❌ Версионирование черновиков (PW-040)
- ❌ Генерация публикации из черновика (PW-041)
- ❌ Real-time коллаборация
- ❌ Drag-and-drop панелей между зонами (dock перетаскиванием)

## Верификация

1. Пункт «Исследования» в сайдбаре админки → страница-список
2. Карточки исследований из mock-данных (статусы, фильтры, счётчики)
3. Клик → workspace с тремя панелями (left sidebar, center, right sidebar)
4. Оба сайдбара: drag-resize + collapse/expand
5. Центральная область: split-панели с drag-resize между ними
6. **Single click** в дереве → preview-вкладка (курсив, заменяется следующим кликом)
7. **Double click** → pinned-вкладка (обычный шрифт, остаётся)
8. Несколько вкладок в одной панели, переключение, close (✕), middle-click close
9. Правильный контент по типу: note/draft → Monaco, source → viewer, media → image
10. Пресеты layout переключаются из toolbar
11. Layout сохраняется в localStorage, восстанавливается при повторном открытии
12. `bun turbo type-check --filter=@profitable-web/admin` — без ошибок
13. `bun turbo build --filter=@profitable-web/admin` — сборка ОК

## Следующие задачи (roadmap)

- **PW-037**: Backend API для исследований (модели, роутеры, миграции)
- **PW-038**: ~~Split-панели и docking layout~~ → включено в PW-036
- **PW-039**: AI-чат в контексте исследования (интеграция LLM)
- **PW-040**: Версионирование черновиков (автоверсии + именованные вехи)
- **PW-041**: Связь исследование → публикация (генерация статьи из черновика)
