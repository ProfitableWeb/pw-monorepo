# Runbook: Назначение администратора

## Когда использовать

После первого OAuth-логина пользователь получает роль `viewer`. Для доступа к админ-панели нужна роль `admin` или
`editor`.

## Назначение через скрипт

### На сервере

```bash
ssh -i ~/.ssh/cloudru_deploy webresearcher@213.171.25.187
cd ~/profitableweb/apps/api
PYTHONPATH=. uv run python scripts/promote_admin.py user@email.com
```

### Локально

```bash
cd apps/api
PYTHONPATH=. uv run python scripts/promote_admin.py user@email.com
```

Скрипт:

1. Находит пользователя по email
2. Устанавливает роль `admin`
3. Выводит подтверждение

## Назначение через SQL

При отсутствии скрипта — напрямую в БД:

```bash
# На сервере
ssh -i ~/.ssh/cloudru_deploy webresearcher@213.171.25.187
psql -U profitableweb profitableweb
```

```sql
-- Проверить текущую роль
SELECT id, name, email, role FROM users WHERE email = 'user@email.com';

-- Назначить admin
UPDATE users SET role = 'admin' WHERE email = 'user@email.com';

-- Проверить
SELECT id, name, email, role FROM users WHERE email = 'user@email.com';
```

## Доступные роли

| Роль     | Описание                                 |
| -------- | ---------------------------------------- |
| `admin`  | Полный доступ, управление пользователями |
| `editor` | Редактирование всех статей               |
| `author` | Создание и редактирование своих статей   |
| `viewer` | Только комментирование (по умолчанию)    |

## SSH-доступ

```
Сервер: 213.171.25.187
Пользователь: webresearcher
SSH-ключ: ~/.ssh/cloudru_deploy
```

```bash
ssh -i ~/.ssh/cloudru_deploy webresearcher@213.171.25.187
```
