# PW-008: Модальное окно входа на сайт

**Статус**: TODO | **Приоритет**: Normal | **Компонент**: Frontend

## Суть

Модальное окно авторизации через OAuth-провайдеры. Бекенда нет — всё через моковые заглушки. Состояние хранится в
localStorage.

## OAuth провайдеры

VK | Telegram

## UX

- Вход и регистрация — одно окно (OAuth не разделяет)
- После входа: toast "Добро пожаловать!"
- Иконка логина → аватар пользователя с меню (выход)
- При выходе: toast "До встречи!"

## Компоненты

1. `AuthModal` — модалка с кнопками OAuth (переиспользует `Modal`)
2. `AuthContext/useAuth` — состояние авторизации + localStorage
3. `UserMenu` — аватар + dropdown меню для авторизованного
4. Обновить `AppBarActions` — показывать логин или UserMenu

## Структура файлов

```
apps/web/src/
├── components/
│   ├── common/
│   │   └── auth-modal/
│   │       ├── AuthModal.tsx
│   │       ├── AuthModal.scss
│   │       └── index.ts
│   └── app-layout/
│       └── app-bar/
│           └── app-bar-right/
│               └── user-menu/
│                   ├── UserMenu.tsx
│                   ├── UserMenu.scss
│                   └── index.ts
└── contexts/
    └── auth/
        ├── AuthContext.tsx
        ├── useAuth.ts
        └── index.ts
```

## Изменения в существующих файлах

- `AppBarActions.tsx` — условный рендер: иконка логина ИЛИ UserMenu
- `Providers.tsx` — добавить AuthProvider

## Чеклист

- [ ] AuthContext с моковой логикой и localStorage
- [ ] AuthModal с кнопками провайдеров
- [ ] UserMenu с аватаром и выпадающим меню
- [ ] Интеграция в AppBarActions
- [ ] Toast уведомления (вход/выход)
- [ ] Адаптивность модалки (mobile bottom-sheet уже есть в Modal)

## Заметки

- Иконки VK и Telegram: `public/imgs/social-icons/vk-icon.svg`, `telegram-icon.svg`
- Моковый пользователь: `{ name, avatar }` — хардкод или рандом
- Переиспользовать существующий `Modal` компонент
- Toast через `@/components/common/toast`
- Другие провайдеры — добавим позже, когда будет бекенд

---

**Создано**: 2026-01-13
