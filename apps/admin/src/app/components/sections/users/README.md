# Пользователи (`users/`)

Управление пользователями — список, команда, приглашения, доступ, модерация.

## Структура

```
users/
├── UsersPage.tsx              # Оркестратор: sidebar-навигация по 9 подсекциям
├── users.constants.ts         # Моковые пользователи, роли, навигация
├── users.types.ts             # User, Role
├── index.ts                   # Barrel-экспорт
│
├── assets/                    # Вкладки (внутренние, не экспортируются)
│   ├── UsersList.tsx           # Список пользователей с фильтрацией
│   ├── TeamSection.tsx         # Команда
│   ├── InvitesSection.tsx      # Приглашения
│   └── StubSections.tsx        # Заглушки: комментарии, чёрный список, роли, активность, поддержка
│
├── access/                    # Настройка доступа (подсекция)
│   ├── AccessSection.tsx       # Оркестратор: 4 карточки
│   ├── access-section.constants.ts
│   ├── access-section.types.ts
│   ├── assets/
│   │   ├── RolesPermissionsCard.tsx
│   │   ├── IpAccessCard.tsx
│   │   ├── ApiTokensCard.tsx
│   │   └── SecurityLogCard.tsx
│   └── index.ts
```
