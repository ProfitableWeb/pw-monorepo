# PW-020: Рефакторинг контроллов форм в общую папку form-controls

## Описание

Реорганизовать структуру UI компонентов форм, создав общую папку `form-controls/` для всех контроллов, используемых в
формах. Это улучшит читаемость кода и упростит переиспользование компонентов.

## Цели

1. Создать папку `apps/web/src/components/common/form-controls/`
2. Переместить компонент `Toggle` из `settings-modal/shared-components/` в `form-controls/`
3. Переместить компоненты `Button` и `Input` в `form-controls/` (или создать реэкспорты)
4. Обновить все импорты в проекте
5. Создать индексный файл для удобного импорта всех контроллов

## Структура после рефакторинга

```
apps/web/src/components/common/
├── form-controls/
│   ├── Button/
│   │   ├── Button.tsx
│   │   ├── Button.scss
│   │   └── index.ts
│   ├── Input/
│   │   ├── Input.tsx
│   │   ├── Input.scss
│   │   └── index.ts
│   ├── Toggle/
│   │   ├── Toggle.tsx
│   │   ├── Toggle.scss
│   │   └── index.ts
│   └── index.ts (реэкспорт всех контроллов)
```

## Изменяемые файлы

1. **Перемещение компонентов:**
   - `settings-modal/shared-components/Toggle.tsx` → `form-controls/Toggle/Toggle.tsx`
   - `settings-modal/shared-components/Toggle.scss` → `form-controls/Toggle/Toggle.scss`
   - `common/button/Button.tsx` → `form-controls/Button/Button.tsx`
   - `common/button/Button.scss` → `form-controls/Button/Button.scss`
   - `common/input/Input.tsx` → `form-controls/Input/Input.tsx`
   - `common/input/Input.scss` → `form-controls/Input/Input.scss`

2. **Обновление импортов:**
   - `settings-modal/notifications-section/NotificationSetting.tsx`
   - `settings-modal/email-section/EmailSection.tsx` (если будет создан)
   - Все другие файлы, использующие Button, Input, Toggle

3. **Создание индексных файлов:**
   - `form-controls/index.ts` - реэкспорт всех контроллов
   - `form-controls/Button/index.ts`
   - `form-controls/Input/index.ts`
   - `form-controls/Toggle/index.ts`

## Преимущества

- ✅ Единая точка входа для всех контроллов форм
- ✅ Улучшенная читаемость структуры проекта
- ✅ Упрощённое переиспользование компонентов
- ✅ Логическая группировка связанных компонентов

## Технические детали

- Сохранить все существующие пропсы и функциональность
- Обновить пути импортов во всех зависимых файлах
- Убедиться, что все тесты проходят
- Проверить отсутствие breaking changes

## Реализация

### Созданные файлы

1. **apps/web/src/components/common/form-controls/Button/**
   - Button.tsx - компонент кнопки
   - Button.scss - стили кнопки
   - index.ts - экспорт компонента

2. **apps/web/src/components/common/form-controls/Input/**
   - Input.tsx - компонент поля ввода
   - Input.scss - стили поля ввода
   - index.ts - экспорт компонента и типов

3. **apps/web/src/components/common/form-controls/Toggle/**
   - Toggle.tsx - компонент переключателя
   - Toggle.scss - стили переключателя
   - index.ts - экспорт компонента

4. **apps/web/src/components/common/form-controls/index.ts**
   - Централизованный экспорт всех контроллов форм

### Изменённые файлы

1. **Обновлены импорты:**
   - `settings-modal/profile-section/ProfileSection.tsx` - использует `form-controls`
   - `settings-modal/SettingsModal.tsx` - использует `form-controls`
   - `settings-modal/notifications-section/NotificationSetting.tsx` - использует `form-controls/Toggle`
   - `newsletter-form/NewsletterForm.tsx` - использует `form-controls`
   - `sidebar-widgets/project-card/ProjectCard.tsx` - использует `form-controls`

2. **Созданы реэкспорты для обратной совместимости:**
   - `common/button/index.ts` - реэкспортирует из `form-controls/Button`
   - `common/input/index.ts` - реэкспортирует из `form-controls/Input`

3. **Удалены старые файлы:**
   - `common/button/Button.tsx` и `Button.scss`
   - `common/input/Input.tsx` и `Input.scss`
   - `settings-modal/shared-components/Toggle.tsx` и `Toggle.scss`

## Результат

✅ Все контроллы форм теперь находятся в единой папке `form-controls/` ✅ Улучшена читаемость структуры проекта ✅
Упрощено переиспользование компонентов ✅ Сохранена обратная совместимость через реэкспорты ✅ Все импорты обновлены на
новые пути
