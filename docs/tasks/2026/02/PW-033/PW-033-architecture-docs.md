# PW-033: Архитектурная документация

> **Статус**: TODO **Приоритет**: Normal **Компонент**: 📚 Docs **Дата**: 2026-02-16 **Связанные**: PW-030, PW-031,
> PW-032

## Цель

Единая точка истины для архитектурных решений. Новый разработчик заходит в `docs/architecture/` и понимает систему.

## Структура

```
docs/architecture/
├── README.md                     # Навигация + обзор системы
├── decisions/                    # ADR — Architecture Decision Records
│   ├── TEMPLATE.md
│   ├── ADR-001-database.md
│   └── ADR-002-auth.md
├── database/                     # БД
│   ├── overview.md               # Схема, модели, связи
│   ├── sync-strategy.md          # Синхронизация local ↔ test ↔ prod
│   ├── migrations.md             # Регламент Alembic миграций
│   └── backup-restore.md         # Бекапы (при появлении prod)
├── infrastructure/               # Инфраструктура
│   ├── environments.md           # Контуры: local / test / prod
│   ├── deployment.md             # CI/CD, PM2, nginx
│   └── secrets.md                # Управление секретами
├── auth/                         # Аутентификация
│   ├── overview.md               # JWT + cookies, роли, гарды
│   ├── oauth-providers.md        # Yandex, Google, Telegram — настройка
│   └── auth-flow.md              # Sequence diagram (Mermaid)
└── runbooks/                     # Пошаговые инструкции
    ├── deploy.md
    ├── db-sync.md
    └── promote-admin.md
```

## Задачи

- [ ] Создать структуру директорий и README.md
- [ ] Перенести ADR-001 (database) из PW-031
- [ ] Написать ADR-002 (auth) из PW-030
- [ ] Написать infrastructure/environments.md (local / test / prod)
- [ ] Написать database/sync-strategy.md
- [ ] Создать TEMPLATE.md для ADR
- [ ] Написать runbooks (deploy, db-sync, promote-admin)

## Источники

| Откуда          | Что                      | Куда                         |
| --------------- | ------------------------ | ---------------------------- |
| PW-031          | Решение по БД на VM      | decisions/ADR-001            |
| PW-030          | OAuth архитектура        | decisions/ADR-002 + auth/    |
| PW-030          | oauth-providers-setup.md | auth/oauth-providers.md      |
| CI/CD workflows | Деплой процесс           | infrastructure/deployment.md |
| Текущая сессия  | Секреты, .env            | infrastructure/secrets.md    |
