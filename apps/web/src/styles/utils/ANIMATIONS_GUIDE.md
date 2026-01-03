# Animation System Guide

Централизованная система управления таймингами и переходами анимаций.

## 📖 Обзор

Вместо хардкод значений и `!important` используем CSS переменные для:
- ✅ Единообразия анимаций
- ✅ Легкого изменения глобальных таймингов
- ✅ Автоматической поддержки `prefers-reduced-motion`
- ✅ Избежания `!important` конфликтов

## 🎯 Основные переменные

### Duration (Длительность)

```scss
--duration-instant: 0.1s   // Мгновенно
--duration-fast: 0.15s      // Быстро
--duration-normal: 0.2s     // Нормально
--duration-medium: 0.3s     // Средне
--duration-slow: 0.5s       // Медленно
--duration-slower: 0.8s     // Очень медленно
```

### Easing (Плавность)

```scss
--ease-linear          // linear
--ease-in              // ease-in
--ease-out             // ease-out
--ease-in-out          // ease-in-out
--ease-smooth          // cubic-bezier(0.4, 0, 0.2, 1)
--ease-bounce          // cubic-bezier(0.68, -0.55, 0.265, 1.55)
```

### Theme Transitions (Переходы темы)

```scss
--theme-transition-duration: 0.3s
--theme-transition-timing: ease
--theme-transition: 0.3s ease  // Полная строка
```

### Component Transitions (Готовые переходы)

```scss
--transition-background    // background-color 0.3s ease
--transition-color         // color 0.3s ease
--transition-border        // border-color 0.3s ease
--transition-shadow        // box-shadow 0.3s ease
--transition-opacity       // opacity 0.2s smooth
--transition-transform     // transform 0.2s smooth
```

### Composite Transitions (Комбинированные)

```scss
--transition-theme-all    // Все цветовые переходы для темы
--transition-svg          // fill, stroke для SVG
```

### Delays (Задержки)

```scss
--delay-short: 0.1s
--delay-medium: 0.35s
--delay-long: 0.5s
```

## 💡 Примеры использования

### Базовое использование

```scss
// ❌ Плохо (хардкод)
.my-button {
  transition: background-color 0.3s ease;
}

// ✅ Хорошо (переменные)
.my-button {
  transition: var(--transition-background);
}
```

### Комбинирование переходов

```scss
// ❌ Плохо
.my-card {
  transition: 
    background-color 0.3s ease,
    color 0.3s ease,
    border-color 0.3s ease,
    transform 0.2s ease !important;
}

// ✅ Хорошо
.my-card {
  transition: 
    var(--transition-background),
    var(--transition-color),
    var(--transition-border),
    var(--transition-transform);
}
```

### Hover эффекты

```scss
.my-element {
  // Transition для цветов темы + hover эффект
  transition: 
    var(--transition-color),
    opacity var(--transition-hover);
  
  &:hover {
    opacity: 0.8;
  }
}
```

### Кастомные длительности

```scss
.my-animation {
  // Используем duration переменные
  transition: transform var(--duration-medium) var(--ease-smooth);
  
  &:hover {
    // С задержкой
    transition: transform var(--duration-slow) var(--ease-bounce) var(--delay-short);
  }
}
```

### Анимации подчёркивания

```scss
.article-title {
  // Быстрое исчезновение
  transition: background-size var(--duration-fast) ease-in-out;
  
  &:hover {
    // Плавное появление с задержкой
    transition: background-size var(--duration-medium) ease-in-out var(--delay-medium);
  }
}
```

## 🎨 Типичные паттерны

### Кнопки

```scss
.button {
  transition: 
    var(--transition-background),
    var(--transition-color),
    var(--transition-border),
    var(--transition-transform);
  
  &:hover {
    transform: scale(1.02);
  }
  
  &:active {
    transform: scale(0.98);
  }
}
```

### Карточки

```scss
.card {
  // Переходы темы + shadow для hover
  transition: 
    var(--transition-theme-all),
    box-shadow var(--duration-normal) var(--ease-smooth);
  
  &:hover {
    box-shadow: var(--shadow-lg);
  }
}
```

### Модальные окна

```scss
.modal {
  // Быстрое появление
  transition: 
    opacity var(--duration-fast) var(--ease-smooth),
    transform var(--duration-fast) var(--ease-smooth);
  
  &--entering {
    opacity: 0;
    transform: scale(0.95);
  }
  
  &--entered {
    opacity: 1;
    transform: scale(1);
  }
}
```

### SVG Иконки

```scss
.icon {
  // Автоматические переходы для fill/stroke
  transition: var(--transition-svg);
  
  // Или кастомно
  transition: 
    fill var(--theme-transition),
    stroke var(--theme-transition),
    transform var(--transition-hover);
}
```

## ♿ Accessibility

### Automatic Reduced Motion

Система **автоматически** поддерживает `prefers-reduced-motion`:

```scss
@media (prefers-reduced-motion: reduce) {
  :root {
    --duration-instant: 0.01s;
    --duration-fast: 0.01s;
    --duration-normal: 0.01s;
    // ... все становятся почти мгновенными
  }
}
```

Все переменные автоматически обновляются - вам **ничего не нужно делать**!

### Явное отключение (когда нужно)

Если вам нужно явно отключить анимации:

```scss
.no-animation {
  * {
    transition: none !important;
    animation: none !important;
  }
}
```

> ⚠️ Используйте `!important` **только** для отключения анимаций!

## 🚫 Что НЕ делать

### ❌ Не используйте хардкод значения

```scss
// Плохо
transition: background-color 0.3s ease;

// Хорошо
transition: var(--transition-background);
```

### ❌ Не используйте !important без причины

```scss
// Плохо - конфликтует с theme transitions
transition: opacity 0.2s ease !important;

// Хорошо
transition: var(--transition-opacity);
```

### ❌ Не дублируйте значения

```scss
// Плохо - дублирование
.element-1 { transition: color 0.3s ease; }
.element-2 { transition: color 0.3s ease; }
.element-3 { transition: color 0.3s ease; }

// Хорошо - переиспользование
.element-1,
.element-2,
.element-3 {
  transition: var(--transition-color);
}
```

## 📊 Когда использовать какую длительность

| Duration | Использование | Пример |
|----------|---------------|---------|
| `instant` | Мгновенный фидбек | Клик кнопки |
| `fast` | Быстрые эффекты | Исчезновение подчёркивания |
| `normal` | Стандартные hover | Opacity, transform |
| `medium` | Переходы темы | Смена светлая/тёмная |
| `slow` | Плавные анимации | Появление модалок |
| `slower` | Декоративные | Специальные эффекты |

## 🔄 Миграция старого кода

### Поиск и замена

1. Найдите все `transition:` с хардкод значениями
2. Замените на соответствующие переменные
3. Удалите `!important` (если не для отключения анимаций)

### Пример миграции

```scss
// Было:
.old-component {
  transition: 
    background-color 0.3s ease,
    color 0.3s ease,
    border-color 0.3s ease !important;
}

// Стало:
.new-component {
  transition: var(--transition-theme-all);
}
```

## 📚 Дополнительные ресурсы

- `_animations.scss` - Определение всех переменных
- `globals.scss` - Применение к глобальным элементам
- Material Design Motion Guide - Вдохновение для таймингов

---

**Создано**: October 2025  
**Версия**: 1.0  
**Статус**: Production Ready


