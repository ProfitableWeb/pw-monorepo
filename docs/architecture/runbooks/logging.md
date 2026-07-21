# Runbook: Логирование и ротация логов

## Архитектура логирования (PW-042, обновлено в PW-070 под Docker)

```
uvicorn (API) ──→ structlog ──→ stdout ──→ Docker json-file ──→ /var/lib/docker/containers/*/…-json.log
Next.js (web) ──→ stdout ──→ Docker json-file
Vite (admin)  ──→ stdout ──→ Docker json-file
```

- **Структурированные логи**: structlog (JSON в проде, цветной текст в dev)
- **Request logging**: middleware автоматически логирует каждый запрос (method, path, status, duration_ms, request_id)
- **Error tracking**: ошибки пишутся в таблицу `error_logs` в PostgreSQL + отображаются в админке
- **Audit trail**: действия пользователей пишутся в таблицу `audit_logs` + отображаются в админке
- **Ротация**: ⚠️ не настроена — Docker json-file driver по умолчанию, без лимитов (см. Troubleshooting)

### Retention policy

| Источник                    | Хранение                                    | Механизм              |
| --------------------------- | ------------------------------------------- | --------------------- |
| stdout контейнеров (Docker) | ⚠️ без лимита, пока не настроен daemon.json | —                     |
| `error_logs` (PostgreSQL)   | 90 дней                                     | Ручная очистка / cron |
| `audit_logs` (PostgreSQL)   | 1 год                                       | Ручная очистка / cron |

### Очистка старых записей в БД (при необходимости)

```bash
cd ~/profitableweb/apps/api

# Ошибки старше 90 дней
uv run python -c "
from src.core.database import SessionLocal
from src.models.error_log import ErrorLog
from datetime import datetime, timedelta, timezone
db = SessionLocal()
cutoff = datetime.now(timezone.utc) - timedelta(days=90)
deleted = db.query(ErrorLog).filter(ErrorLog.timestamp < cutoff).delete()
db.commit()
print(f'Удалено {deleted} записей error_logs')
"

# Аудит старше 1 года
uv run python -c "
from src.core.database import SessionLocal
from src.models.audit_log import AuditLog
from datetime import datetime, timedelta, timezone
db = SessionLocal()
cutoff = datetime.now(timezone.utc) - timedelta(days=365)
deleted = db.query(AuditLog).filter(AuditLog.timestamp < cutoff).delete()
db.commit()
print(f'Удалено {deleted} записей audit_logs')
"
```

## Просмотр логов

### Docker

```bash
cd ~/profitableweb
docker compose -f docker-compose.prod.yml logs -f api          # Follow логов API
docker compose -f docker-compose.prod.yml logs --tail 50 api   # Последние 50 строк
docker compose -f docker-compose.prod.yml logs --tail 100      # Все сервисы контура
docker logs pw-prod-api --since 1h                             # По имени контейнера
```

### structlog в dev-режиме

В dev structlog выводит цветной human-readable формат. В production — JSON (machine-readable).

Переключение: переменная `ENVIRONMENT` в `.env` (`development` / `production`).

### Админка

Настройки → Мониторинг:

- **Таб «Система»** — uptime, CPU, память, диск, статус сервисов
- **Таб «Ошибки»** — таблица ошибок из `error_logs` с traceback, фильтры, resolved
- **Таб «Аудит»** — действия пользователей из `audit_logs`, фильтры по действию/пользователю/дате

## Troubleshooting

### Логи занимают много места / настроить ротацию (TODO)

Ротация Docker-логов на VM **не настроена** (проверено 21.07.2026: `/etc/docker/daemon.json` отсутствует). Настройка:

```bash
# Посмотреть текущий размер
sudo du -sh /var/lib/docker/containers/*/

# Включить ротацию глобально (требует restart docker и пересоздания контейнеров)
sudo tee /etc/docker/daemon.json <<'EOF'
{
  "log-driver": "json-file",
  "log-opts": { "max-size": "50m", "max-file": "5" }
}
EOF
sudo systemctl restart docker
cd ~/profitableweb && docker compose -f docker-compose.prod.yml up -d
```

### Ошибки не появляются в админке

1. Проверить что API запущен: `docker compose -f docker-compose.prod.yml ps`
2. Проверить middleware: `docker compose -f docker-compose.prod.yml logs --tail 5 api` — должны быть structlog записи
3. Проверить БД:
   `uv run python -c "from src.core.database import SessionLocal; from src.models.error_log import ErrorLog; db = SessionLocal(); print(db.query(ErrorLog).count())"`
