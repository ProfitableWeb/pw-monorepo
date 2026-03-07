# AI центр (`ai-center/`)

Секция AI-чата — интерфейс общения с языковыми моделями, аналогичный ChatGPT / Claude.

## Структура

```
ai-center/
├── AiCenter.tsx                     # Оркестратор: скролл, отправка, композиция
├── ai-center.constants.ts           # AI_MODELS — список доступных моделей
├── ai-center.utils.tsx              # Утилиты: formatFileSize, getFileIcon, copyToClipboard
├── index.ts                         # Barrel-экспорт
│
├── chat-input/                      # Зона ввода сообщения
│   ├── ChatInput.tsx                   # Оркестратор: стейт, хоткеи, drag & drop
│   ├── assets/
│   │   ├── AttachmentList.tsx          # Превью прикреплённых файлов
│   │   ├── ModelSelector.tsx           # Выбор AI-модели
│   │   └── DropZone.tsx                # Обёртка drag & drop с оверлеем
│   └── index.ts
│
├── chat-message/                    # Отображение сообщения
│   ├── MessageItem.tsx                 # Оркестратор: варианты, редактирование, регенерация
│   ├── assets/
│   │   ├── MessageActions.tsx          # Кнопки: копировать, редактировать, удалить
│   │   ├── ThinkingBlock.tsx           # Блок цепочки размышлений AI
│   │   ├── ToolCallsBlock.tsx          # Блок вызовов инструментов
│   │   ├── EditMessageDialog.tsx       # Диалог редактирования (Monaco Editor)
│   │   └── StreamingIndicator.tsx      # Индикатор «печатает...»
│   └── index.ts
│
├── chat-empty-state/                # Пустое состояние (нет сообщений)
│   ├── EmptyState.tsx                  # Оркестратор: приветствие + сетка промптов
│   ├── chat-empty-state.constants.ts   # QUICK_PROMPTS, TEMPLATE_ICON_OPTIONS
│   ├── assets/
│   │   ├── QuickPromptCard.tsx         # Карточка быстрого промпта
│   │   └── TemplateDialog.tsx          # Диалог создания пользовательского шаблона
│   └── index.ts
```

## Архитектура

### Потоки данных

- **Стейт**: `useAIStore` (Zustand) — сессии, сообщения, модели, ввод, стриминг
- **Отправка**: `AiCenter.handleSend()` → добавляет user-сообщение → симулирует ответ AI
- **Варианты**: каждое сообщение хранит массив `variants[]` с навигацией по ним
- **Начальный промпт**: может прийти из другой секции (напр. Манифест) через `initialPrompt`

### Паттерн декомпозиции

Каждая директория (`chat-input/`, `chat-message/`, `chat-empty-state/`) следует атомарному паттерну:

- **Корень** — оркестратор + инфраструктура (constants, index)
- **`assets/`** — внутренние составляющие оркестратора, не экспортируются наружу

Внешний мир импортирует только через `index.ts` — внутренняя структура скрыта.
