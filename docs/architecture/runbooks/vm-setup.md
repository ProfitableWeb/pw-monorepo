# Runbook: Подготовка VM для деплоя

Одноразовая настройка Cloud.ru VM перед первым Docker-деплоем.

**VM**: Ubuntu 22.04, 2 vCPU / 4 GB RAM, IP `213.171.25.187`

---

## 1. Подключение к VM

```bash
ssh webresearcher@213.171.25.187
```

---

## 2. Смена пароля пользователя

```bash
# Сменить пароль текущего пользователя
passwd
# Ввести текущий пароль, затем новый дважды
```

---

## 3. Установка Docker

```bash
# Обновить пакеты
sudo apt update && sudo apt upgrade -y

# Установить зависимости
sudo apt install -y ca-certificates curl gnupg

# Добавить GPG-ключ Docker
sudo install -m 0755 -d /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
sudo chmod a+r /etc/apt/keyrings/docker.gpg

# Добавить репозиторий
echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
  $(. /etc/os-release && echo "$VERSION_CODENAME") stable" | \
  sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

# Установить Docker Engine + Compose plugin
sudo apt update
sudo apt install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin

# Добавить пользователя в группу docker (чтобы не нужен sudo)
sudo usermod -aG docker $USER

# Применить группу (или перелогиниться)
newgrp docker

# Проверить
docker --version
docker compose version
```

---

## 4. SSH-ключ для CI/CD

CI/CD подключается по SSH-ключу (не паролю). Ключ уже должен быть в `~/.ssh/authorized_keys`.

### Если ключа ещё нет

На **локальной машине** (не на VM):

```bash
# Сгенерировать ключ для деплоя
ssh-keygen -t ed25519 -C "deploy@profitableweb" -f ~/.ssh/pw_deploy

# Скопировать публичный ключ на VM
ssh-copy-id -i ~/.ssh/pw_deploy.pub webresearcher@213.171.25.187

# Проверить вход без пароля
ssh -i ~/.ssh/pw_deploy webresearcher@213.171.25.187
```

Затем содержимое **приватного** ключа (`~/.ssh/pw_deploy`) вставить в GitHub Secret `SSH_PRIVATE_KEY`.

---

## 5. Подготовка директории проекта

```bash
# Создать директорию (если ещё нет)
mkdir -p ~/profitableweb
cd ~/profitableweb

# Склонировать репозиторий
git clone https://github.com/nicorp/ProfitableWeb.git .
# или если уже есть:
git remote set-url origin https://github.com/nicorp/ProfitableWeb.git
```

---

## 6. Остановка PM2 (миграция с предыдущего деплоя)

```bash
# Проверить текущие процессы
pm2 status

# Остановить все процессы
pm2 stop all
pm2 delete all

# Убрать автозапуск PM2
pm2 unstartup

# (Опционально) Удалить PM2
sudo npm uninstall -g pm2
```

---

## 7. Настройка nginx

```bash
# Скопировать конфиг из репозитория
sudo cp ~/profitableweb/infra/nginx/profitableweb.conf /etc/nginx/sites-available/profitableweb

# Активировать (если ещё не активирован)
sudo ln -sf /etc/nginx/sites-available/profitableweb /etc/nginx/sites-enabled/profitableweb

# Проверить и перезагрузить
sudo nginx -t && sudo systemctl reload nginx
```

---

## 8. DNS-записи

Добавить A-записи в DNS-панели домена `profitableweb.ru`:

| Запись                 | Тип | Значение       |
| ---------------------- | --- | -------------- |
| `profitableweb.ru`     | A   | 213.171.25.187 |
| `www.profitableweb.ru` | A   | 213.171.25.187 |
| `dev.profitableweb.ru` | A   | 213.171.25.187 |

`profitableweb.ru` и `www` уже должны быть настроены. Добавить только `dev`.

---

## 9. Первый запуск Docker-контейнеров

### Вручную (для проверки)

```bash
cd ~/profitableweb

# Создать .env.prod из .env.prod.example и заполнить значения
cp .env.prod.example .env.prod
nano .env.prod  # заполнить реальные пароли и секреты

# Запустить prod-контур
docker compose -f docker-compose.prod.yml --env-file .env.prod up -d --build

# Проверить
docker compose -f docker-compose.prod.yml ps
curl -s http://localhost:8000/api/health
curl -s http://localhost:3000
curl -s http://localhost:3001
```

### Через CI/CD (штатный путь)

После настройки GitHub Secrets (см. `docs/architecture/runbooks/deploy.md`) — просто пушить в master:

```bash
git push github master  # → автодеплой
```

---

## 10. Проверка после деплоя

```bash
# Контейнеры запущены
docker compose -f docker-compose.prod.yml ps

# API отвечает
curl -s http://localhost:8000/api/health

# Внешний доступ
curl -s http://profitableweb.ru
curl -s http://profitableweb.ru/api/health
curl -s http://profitableweb.ru/admin/

# Логи (если что-то не работает)
docker compose -f docker-compose.prod.yml logs -f api
docker compose -f docker-compose.prod.yml logs -f web
docker compose -f docker-compose.prod.yml logs -f admin
```

---

## 11. Смена паролей БД (после первого запуска)

Пароль PostgreSQL задаётся при **первом** создании volume. Если нужно сменить пароль после того, как БД уже работает:

```bash
# Подключиться к контейнеру PostgreSQL
docker compose -f docker-compose.prod.yml exec db psql -U pw -d profitableweb

# Сменить пароль
ALTER USER pw WITH PASSWORD 'новый-надёжный-пароль';
\q

# Обновить .env.prod на VM
nano ~/profitableweb/.env.prod
# Изменить POSTGRES_PASSWORD=новый-надёжный-пароль

# Обновить GitHub Secret POSTGRES_PASSWORD

# Перезапустить API (чтобы подхватил новый пароль)
docker compose -f docker-compose.prod.yml restart api
```

---

## Чеклист готовности

- [ ] Docker + Docker Compose установлены
- [ ] SSH-ключ для CI/CD настроен
- [ ] GitHub Secrets заполнены (см. deploy.md)
- [ ] Репозиторий склонирован в `~/profitableweb`
- [ ] PM2 остановлен и удалён
- [ ] nginx конфиг обновлён
- [ ] DNS запись `dev.profitableweb.ru` добавлена
- [ ] Контейнеры запущены и работают
- [ ] Внешний доступ проверен
