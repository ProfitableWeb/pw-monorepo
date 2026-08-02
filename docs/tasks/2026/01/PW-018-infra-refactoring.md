# PW-018: Рефакторинг инфраструктуры проекта

**Статус:** DONE  
**Дата создания:** 24 января 2026  
**Приоритет:** 📝 Средний  
**Тип:** Refactoring

## 🎯 Цель

Перенести инфраструктурные файлы (nginx конфигурация и скрипты) из папок документации в отдельную директорию `infra/`
для улучшения организации проекта.

## 🔍 Проблема

Инфраструктурные файлы находились в папках, предназначенных для документации (`docs/nginx/`) и скриптов (`scripts/`),
что нарушало логическую структуру проекта.

## ✅ Решение

### Что сделано

- [x] Создана папка `infra/` для инфраструктурных файлов
- [x] Перенесён nginx конфиг: `docs/nginx/profitableweb.conf` → `infra/nginx/profitableweb.conf`
- [x] Перенесён скрипт обновления: `scripts/update-nginx.sh` → `infra/scripts/update-nginx.sh`
- [x] Создан README для `infra/` с документацией
- [x] Обновлены пути во всех файлах:
  - `.gitverse/workflows/deploy.yaml`
  - `.github/workflows/deploy-gitverse-only.yml`
  - `docs/nginx/README.md`
  - `docs/nginx/DEPLOY_FIX.md`
  - `docs/tasks/2026/01/PW-015-nginx-fix-400.md`

## 📁 Новая структура

```
infra/
├── nginx/
│   └── profitableweb.conf    # nginx конфигурация для Cloud.ru
├── scripts/
│   └── update-nginx.sh       # скрипт обновления nginx
└── README.md                 # документация
```

## 🔄 Изменённые пути

| Было                        | Стало                             |
| --------------------------- | --------------------------------- |
| `docs/nginx/*.conf`         | `infra/nginx/*.conf`              |
| `scripts/update-nginx.sh`   | `infra/scripts/update-nginx.sh`   |
| `./scripts/update-nginx.sh` | `./infra/scripts/update-nginx.sh` |

## 📚 Связанные документы

- **Инфраструктура:** [infra/README.md](../../../infra/README.md)
- **Nginx конфиг:** [infra/nginx/profitableweb.conf](../../../infra/nginx/profitableweb.conf)
- **Задача PW-015:** [PW-015-nginx-fix-400.md](./PW-015-nginx-fix-400.md)

## ✅ Результаты

- ✅ Инфраструктурные файлы теперь в логичном месте
- ✅ `docs/nginx/` содержит только документацию
- ✅ Все пути обновлены и работают корректно
- ✅ Deploy workflows настроены на новые пути

---

**Время на выполнение:** ~15 минут  
**Downtime:** 0 секунд
