# PW-012: Блок контактов в мобильном меню

## 📋 Информация о задаче

- **ID**: PW-012
- **Статус**: DONE
- **Создано**: 2026-01-16
- **Завершено**: 2026-01-16
- **Обновлено**: 2026-01-16
- **Приоритет**: Normal 📋
- **Компонент**: ⚛️ Frontend / UX
- **Теги**: #frontend #ui #mobile-menu #contacts

## 🎯 Постановка задачи

### Описание

Заменить пункт меню "Контакты" в выезжающем мобильном меню (AppBarMenuSidebar) на полноценный информационный блок с
контактной информацией и социальными сетями.

**Контекст:** Пункт "Контакты" сейчас ведёт на отдельную страницу, хотя контактную информацию удобнее показывать прямо в
меню для быстрого доступа.

### Цель

- Заменить ссылку "Контакты" на информационный блок
- Добавить контактную информацию и социальные сети прямо в меню
- Улучшить UX — не нужно переходить на отдельную страницу для контактов
- Визуально отделить блок контактов от основных пунктов меню

## 📊 Текущее состояние

### ✅ Что реализовано:

**Файл:**
`apps/web/src/components/app-layout/app-bar/app-bar-left/app-bar-menu-sidebar/app-bar-menu-sidebar/AppBarMenuSidebar.tsx`

1. **Функциональность:**
   - Выезжающее меню слева
   - Анимация через framer-motion
   - Overlay при открытии
   - Swipe-детекция для закрытия
   - 4 пункта навигации: Главная, Рубрики, О проекте, Контакты

2. **Стилизация (AppBarMenuSidebar.scss):**
   - Непрозрачный фон `background: var(--color-background)`
   - Фиксированная ширина 260px
   - Box shadow для глубины
   - Тематизация (light/dark)

3. **Структура меню:**
   ```tsx
   <ul>
     <li>
       <Link href='/'>Главная</Link>
     </li>
     <li>
       <Link href='/rubrics'>Рубрики</Link>
     </li>
     <li>
       <Link href='/about'>О проекте</Link>
     </li>
     <li>
       <Link href='/contacts'>Контакты</Link>
     </li>{' '}
     {/* ← Заменить */}
   </ul>
   ```

### ❌ Что нужно улучшить:

#### Контакты как ссылка

**Текущий код:**

```tsx
<li>
  <Link href='/contacts' className='app-bar-menu-sidebar__nav-item'>
    Контакты
  </Link>
</li>
```

**Проблемы:**

- Контакты — это просто ссылка на страницу `/contacts`
- Пользователю нужно переходить на отдельную страницу
- Нет быстрого доступа к социальным сетям
- Информация не видна сразу в меню

## 🛠️ Техническая часть

### Структура файлов

```
apps/web/src/
├── components/
│   ├── app-layout/
│   │   └── app-bar/
│   │       └── app-bar-left/
│   │           └── app-bar-menu-sidebar/
│   │               ├── app-bar-menu-sidebar/
│   │               │   ├── AppBarMenuSidebar.tsx      # ОБНОВИТЬ: добавить контакты блок
│   │               │   └── AppBarMenuSidebar.scss     # ОБНОВИТЬ: стили разделителя
│   │               └── app-bar-menu-contacts/         # НОВЫЙ: блок контактов
│   │                   ├── AppBarMenuContacts.tsx
│   │                   ├── AppBarMenuContacts.scss
│   │                   └── index.ts
│   └── common/
│       └── social-links/                              # ИСПОЛЬЗУЕТСЯ (уже есть)
│           ├── SocialLinks.tsx
│           └── SocialLinks.scss
└── config/
    └── contacts.ts                                    # НОВЫЙ (опционально): конфиг контактов
```

### 1. Блок контактов

**Новый компонент:** `AppBarMenuContacts.tsx`

```tsx
'use client';

import React from 'react';
import { SocialLinks } from '@/components/common/social-links';
import { SOCIAL_LINKS_AUTHOR } from '@/config/socialLinks';
import './AppBarMenuContacts.scss';

/**
 * AppBarMenuContacts - блок контактов в мобильном меню
 *
 * Отображает контактную информацию и социальные сети
 * вместо ссылки на страницу контактов.
 */
export const AppBarMenuContacts: React.FC = () => {
  return (
    <div className='app-bar-menu-contacts'>
      <h3 className='app-bar-menu-contacts__title'>Контакты</h3>

      <div className='app-bar-menu-contacts__info'>
        <p className='app-bar-menu-contacts__text'>Следите за обновлениями в социальных сетях:</p>

        <SocialLinks links={SOCIAL_LINKS_AUTHOR} variant='horizontal' size='md' />
      </div>
    </div>
  );
};

export default AppBarMenuContacts;
```

**Стили:** `AppBarMenuContacts.scss`

```scss
@import '@/styles/utils/variables';
@import '@/styles/utils/mixins';

.app-bar-menu-contacts {
  margin-top: var(--space-lg);
  padding-top: var(--space-md);
  border-top: 1px solid rgba(255, 255, 255, 0.1);

  &__title {
    font-size: var(--font-size-sm);
    font-weight: var(--font-weight-medium);
    color: var(--color-text-muted);
    text-transform: uppercase;
    letter-spacing: 0.05em;
    margin-bottom: var(--space-sm);
  }

  &__info {
    display: flex;
    flex-direction: column;
    gap: var(--space-sm);
  }

  &__text {
    font-size: var(--font-size-sm);
    color: var(--color-text-secondary);
    margin: 0;
    line-height: 1.5;
  }
}

// Темная тема
[data-theme='dark'] .app-bar-menu-contacts {
  border-top-color: rgba(255, 255, 255, 0.05);
}
```

### 2. Стили разделителя

**Обновить:** `AppBarMenuSidebar.scss`

Добавить отступ между пунктами меню и блоком контактов:

```scss
&__nav {
  ul {
    list-style: none;
    padding: 0;
    margin: 0;
    margin-bottom: var(--space-lg); // Отступ перед блоком контактов
  }
}
```

### 3. Интеграция в AppBarMenuSidebar

**Обновить:** `AppBarMenuSidebar.tsx`

```tsx
import AppBarMenuContacts from '../app-bar-menu-contacts';

// ...

<nav className='app-bar-menu-sidebar__nav'>
  <ul>
    <li>
      <Link href='/' className='app-bar-menu-sidebar__nav-item'>
        Главная
      </Link>
    </li>
    <li>
      <Link href='/rubrics' className='app-bar-menu-sidebar__nav-item'>
        Рубрики
      </Link>
    </li>
    <li>
      <Link href='/about' className='app-bar-menu-sidebar__nav-item'>
        О проекте
      </Link>
    </li>
  </ul>

  {/* Блок контактов вместо ссылки */}
  <AppBarMenuContacts />
</nav>;
```

## 📝 Чеклист выполнения

### TODO → DOING

- [ ] Задача проанализирована
- [ ] План реализации готов
- [ ] Структура файлов определена

### DOING → TESTING

**Блок контактов:**

- [ ] Создать компонент `AppBarMenuContacts.tsx`
- [ ] Создать файл стилей `AppBarMenuContacts.scss`
- [ ] Добавить заголовок "Контакты"
- [ ] Добавить описательный текст
- [ ] Интегрировать компонент `SocialIcons`
- [ ] Использовать `SOCIAL_LINKS_AUTHOR`
- [ ] Добавить разделитель (border-top)
- [ ] Настроить типографику (отличную от пунктов меню)

**Интеграция:**

- [ ] Удалить пункт меню "Контакты" (ссылка)
- [ ] Добавить компонент `AppBarMenuContacts` в меню
- [ ] Проверить структуру навигации
- [ ] Обновить экспорты (index.ts)
- [ ] Добавить отступ между ссылками и блоком контактов

**Адаптивность:**

- [ ] Desktop (>1024px)
- [ ] Tablet (768-1024px)
- [ ] Mobile (<768px)

### TESTING → CODEREVIEW & DOCS

**Визуальное тестирование:**

- [ ] Блок контактов отображается корректно
- [ ] Типографика отличается от пунктов меню
- [ ] Разделитель виден
- [ ] Социальные иконки отображаются
- [ ] Переключение тем работает

**Функциональное тестирование:**

- [ ] Меню открывается/закрывается
- [ ] Социальные сети кликабельны
- [ ] Ссылки в меню работают
- [ ] Анимации плавные

### CODEREVIEW & DOCS → DONE

- [ ] Код соответствует стандартам проекта
- [ ] TypeScript типы корректны
- [ ] Нет linter errors
- [ ] Компоненты документированы
- [ ] SCSS организован правильно
- [ ] Нет дублирования кода

## 📈 Ожидаемые улучшения

### UX:

1. **Быстрый доступ к контактам**
   - Не нужно переходить на отдельную страницу
   - Социальные сети видны сразу
   - Один клик до контакта

2. **Лучшая организация меню**
   - Визуальное разделение навигации и контактов
   - Четкая иерархия через типографику
   - Удобный доступ к социальным сетям

### Визуальный эффект:

**До:**

```
┌─────────────────┐
│ [===] Menu      │  ← Непрозрачный фон
│                 │
│ • Главная       │
│ • Рубрики       │
│ • О проекте     │
│ • Контакты  →   │  ← Ссылка на страницу
│                 │
└─────────────────┘
```

**После:**

```
┌─────────────────┐
│ [===] Menu      │
│                 │
│ • Главная       │
│ • Рубрики       │
│ • О проекте     │
│                 │
│ ─────────────── │
│ КОНТАКТЫ        │  ← Заголовок (uppercase, меньший шрифт)
│ Соцсети:        │  ← Описание
│ [VK] [TG] [YT]  │  ← Кликабельные иконки
└─────────────────┘
```

## ⚠️ Потенциальные проблемы

### 1. Длинный список контактов

**Проблема:**

- Если социальных сетей много, блок может стать длинным

**Решение:**

- Показывать только основные соцсети (макс 5-6)
- Использовать grid layout для компактности
- Добавить ссылку "Все контакты" если нужно

## 🔗 Связанные задачи

- **Использует:** Компонент `SocialLinks` (уже реализован)
- **Использует:** Конфиг `SOCIAL_LINKS_AUTHOR`
- **Связана с:** Дизайн-система (glassmorphism может применяться к другим компонентам)
- **Будущее:** Можно применить glassmorphism к модальным окнам, карточкам

## 📌 Заметки

### Accessibility:

- ✅ Проверить контраст текста (WCAG AA: 4.5:1 для обычного текста)
- ✅ Протестировать с screen readers
- ✅ Убедиться что focus states видны
- ✅ Keyboard navigation работает

---

**Приоритет:** Normal 📋  
**Сложность:** Low-Medium  
**Estimated Time:** 1-2 часа  
**Impact:** Medium (UX improvement)
