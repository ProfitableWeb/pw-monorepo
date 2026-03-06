# article-workbench

Редактор статей — основной рабочий инструмент админ-панели.

## Структура

```
article-workbench/
├── ArticleWorkbench.tsx     # Оркестратор: табы, форма (react-hook-form), autosave
├── index.ts                 # Barrel-экспорт
│
├── editor-shared/           # Общие утилиты для Monaco Editor
│   ├── editor-themes.ts     # 13 тем + defineCustomThemes() + типы
│   ├── EditorSettingsPanel   # Плавающая панель настроек (drag, toggle)
│   └── index.ts
│
├── preview/                 # Iframe-превью (статья + карточка)
│   ├── DevicePreview.tsx    # Эмуляция устройств: desktop/tablet/mobile
│   ├── DeviceToolbar.tsx    # Тулбар: устройство, пресет, zoom, размеры
│   ├── LiveCardPreview.tsx  # Превью карточки через iframe + тема + ресайз
│   ├── useIframeMessaging   # postMessage-протокол (ready → update → scroll/click)
│   ├── useTouchSimulation   # Тач-имитация: скролл, tap, инерция, курсор
│   ├── useDeviceResize      # Drag-ресайз контейнера
│   ├── preview.types.ts     # Пресеты устройств, WEB_URL, типы
│   └── index.ts
│
├── shared/                  # Переиспользуемые компоненты
│   ├── MiniWysiwygEditor    # Облегчённый Tiptap (bold/italic/highlight/link)
│   ├── VisualEditor.tsx     # Полный Tiptap (заголовки, списки, код, изображения)
│   └── index.ts
│
└── tabs/                    # Вкладки редактора
    ├── card/                # «Карточка» — H1, теги, обложка, excerpt, LiveCardPreview
    │   ├── CardTab.tsx
    │   ├── card.constants.ts
    │   └── index.ts
    ├── seo/                 # «SEO» — мета, slug, keywords, SERP/OG/JSON-LD превью
    │   ├── SeoTab.tsx
    │   ├── seo.utils.ts     # transliterate(), EDITORIAL_TEAM
    │   ├── SerpPreview.tsx, JsonLdPreview.tsx, TelegramPreview.tsx
    │   ├── SeoScoreBar.tsx, CharCounter.tsx
    │   └── index.ts
    ├── editor/              # «Редактор» — Monaco (HTML/MD) + Visual + DevicePreview
    │   ├── EditorTab.tsx    # Split-pane: код ↔ превью
    │   ├── EditorToolbar.tsx
    │   ├── FormatterSettings.tsx  # Prettier / Monaco настройки
    │   └── index.ts
    ├── artifacts/           # «Артефакты» — самопроверка, источники, глоссарий
    │   ├── ArtifactsTab.tsx # Навигация + модули
    │   ├── SelfCheckModule, SourcesModule, GlossaryModule, ProvenanceModule
    │   ├── AiButton.tsx     # Кнопка AI-действия (заглушка)
    │   ├── artifacts.utils.ts
    │   └── index.ts
    ├── history/             # «История» — diff-просмотр версий
    │   └── HistoryTab.tsx
    └── research/            # «Исследование» — привязка к research workspace
        └── ResearchTab.tsx
```

## Ключевые паттерны

### Состояние формы

`react-hook-form` создаётся в `ArticleWorkbench` и прокидывается через `register/watch/setValue`. Каждая вкладка
работает только со своим срезом данных. Глобальное состояние (editorMode, content, autosave) — в Zustand-сторе
`article-editor-store`.

### postMessage-протокол (admin ↔ web iframe)

```
iframe загружается → preview:ready
admin → iframe:     preview:update { data }    (debounce 200ms)
admin → iframe:     preview:scroll { deltaY }
admin → iframe:     preview:click  { x, y }
admin → iframe:     preview:theme  { theme }   (только LiveCardPreview)
iframe → admin:     preview:resize { height }  (только LiveCardPreview)
```

Безопасность: строгая проверка `e.origin === new URL(WEB_URL).origin`.

### Переиспользуемые компоненты

- `EditorSettingsPanel` + `useEditorSettingsPanel()` — общая панель настроек для EditorTab и CardTab
- `editor-themes.ts` — темы Monaco, используются в обоих редакторах
- `MiniWysiwygEditor` — Tiptap без блок-элементов (для excerpt)
- `VisualEditor` — полный Tiptap (для контента статьи)

### Именование файлов

- `{feature}.types.ts` — типы, специфичные для модуля
- `{feature}.constants.ts` — константы модуля
- `{feature}.utils.ts` — утилиты модуля
- `index.ts` — barrel-экспорт в каждой директории
