# Runbook: Логирование и ротация логов

## Архитектура логирования (PW-042)

```
uvicorn (API) ──→ structlog ──→ stdout ──→ PM2 ──→ ~/.pm2/logs/
Next.js (web) ──→ stdout ──→ PM2 ──→ ~/.pm2/logs/
Vite (admin)  ──→ stdout ──→ PM2 ──→ ~/.pm2/logs/
```

- **Структурированные логи**: structlog (JSON в проде, цветной текст в dev)
- **Request logging**: middleware автоматически логирует каждый запрос (method, path, status, duration_ms, request_id)
- **Error tracking**: ошибки пишутся в таблицу `error_logs` в PostgreSQL + отображаются в админке
- **Audit trail**: действия пользователей пишутся в таблицу `audit_logs` + отображаются в админке
- **Ротация**: PM2 logrotate (stdout/stderr логи на диске)

## PM2 Log Rotation — настройка

### Установка

```bash
ssh -i ~/.ssh/cloudru_deploy webresearcher@213.171.25.187
pm2 install pm2-logrotate
```

### Конфигурация

```bash
pm2 set pm2-logrotate:max_size 50M        # Ротация при 50 MB
pm2 set pm2-logrotate:retain 10            # Хранить 10 последних файлов
pm2 set pm2-logrotate:compress true        # Сжимать gzip
pm2 set pm2-logrotate:dateFormat YYYY-MM-DD_HH-mm-ss
pm2 set pm2-logrotate:rotateModule true    # Ротировать логи самих модулей PM2
pm2 set pm2-logrotate:workerInterval 30    # Проверка каждые 30 секунд
pm2 set pm2-logrotate:rotateInterval '0 0 * * *'  # Принудительная ротация раз в сутки
```

### Проверка

```bash
# Текущие настройки
pm2 conf pm2-logrotate

# Логи PM2 (включая logrotate)
pm2 logs pm2-logrotate --lines 20

# Размер логов
du -sh ~/.pm2/logs/

# Список файлов логов
ls -lah ~/.pm2/logs/
```

### Retention policy

| Источник                  | Хранение                        | Механизм              |
| ------------------------- | ------------------------------- | --------------------- |
| PM2 stdout/stderr         | 10 файлов × 50 MB = ~500 MB max | pm2-logrotate         |
| `error_logs` (PostgreSQL) | 90 дней                         | Ручная очистка / cron |
| `audit_logs` (PostgreSQL) | 1 год                           | Ручная очистка / cron |

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

### PM2

```bash
pm2 logs api --lines 50          # Последние 50 строк API
pm2 logs api --err --lines 20    # Только stderr
pm2 logs --lines 100             # Все процессы
pm2 flush                        # Очистить все логи (осторожно!)
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

### Логи занимают много места

```bash
du -sh ~/.pm2/logs/
pm2 flush  # Очистить текущие (ротированные останутся)
```

### pm2-logrotate не работает

```bash
pm2 describe pm2-logrotate  # Проверить статус модуля
pm2 restart pm2-logrotate   # Перезапустить
```

### Ошибки не появляются в админке

1. Проверить что API запущен: `pm2 status`
2. Проверить middleware: `pm2 logs api --lines 5` — должны быть structlog записи
3. Проверить БД:
   `uv run python -c "from src.core.database import SessionLocal; from src.models.error_log import ErrorLog; db = SessionLocal(); print(db.query(ErrorLog).count())"`
