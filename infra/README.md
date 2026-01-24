# Infra - Инфраструктура проекта

Эта папка содержит файлы, связанные с инфраструктурой и деплоем.

## Структура

```
infra/
├── nginx/
│   └── profitableweb.conf    # Конфигурация nginx для Cloud.ru
├── scripts/
│   └── update-nginx.sh       # Скрипт обновления nginx на сервере
└── README.md
```

## Использование

### Обновление nginx на сервере

```bash
# SSH на сервер
ssh user@213.171.25.187

# Перейти в папку проекта
cd ~/profitableweb

# Запустить скрипт обновления
./infra/scripts/update-nginx.sh
```

### Ручное обновление

```bash
# Скопировать конфиг
sudo cp infra/nginx/profitableweb.conf /etc/nginx/sites-available/profitableweb

# Проверить синтаксис
sudo nginx -t

# Перезагрузить nginx
sudo systemctl reload nginx
```

## Связанная документация

- **Инструкция по обновлению nginx:** [docs/nginx/README.md](../docs/nginx/README.md)
- **Детальное описание исправлений:** [docs/nginx/DEPLOY_FIX.md](../docs/nginx/DEPLOY_FIX.md)
- **Задача PW-015:** [docs/tasks/2026/01/PW-015-nginx-fix-400.md](../docs/tasks/2026/01/PW-015-nginx-fix-400.md)

## Автоматизация

Конфигурация nginx автоматически деплоится при изменении файлов в `infra/` (см. `.gitverse/workflows/deploy.yaml`).
