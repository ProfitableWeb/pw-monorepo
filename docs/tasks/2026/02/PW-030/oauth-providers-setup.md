# OAuth-провайдеры: регистрация приложений

> Инструкции по получению `client_id` / `client_secret` для каждого провайдера. После регистрации добавить значения в
> `apps/api/.env`.

---

## 1. Yandex ID

**Консоль**: https://oauth.yandex.ru/client/new

### Шаги

1. Войти в Яндекс аккаунт
2. Перейти в консоль OAuth → «Создать приложение»
3. Заполнить:
   - **Название**: ProfitableWeb
   - **Платформа**: Веб-сервисы
   - **Redirect URI**: `http://localhost:8000/api/auth/yandex/callback`
   - **Права**: `login:email`, `login:info`, `login:avatar`
4. Сохранить → получить **ClientID** и **Client secret**

### Переменные

```env
YANDEX_CLIENT_ID=<ClientID>
YANDEX_CLIENT_SECRET=<Client secret>
```

### Документация

- https://yandex.ru/dev/id/doc/ru/concepts/ya-start
- https://yandex.ru/dev/id/doc/ru/codes/code-url

### Примечания

- Redirect URI для продакшена: `https://profitableweb.ru/api/auth/yandex/callback`
- Модерация не требуется для базовых прав

---

## 2. VK ID

**Консоль**: https://id.vk.com/about/business/go/accounts

### Шаги

1. Войти в VK аккаунт
2. Перейти в VK ID → «Мои приложения» → «Создать»
3. Тип: **Сайт**
4. Заполнить:
   - **Название**: ProfitableWeb
   - **Адрес сайта**: `http://localhost:3000`
   - **Базовый домен**: `localhost`
   - **Redirect URI**: `http://localhost:8000/api/auth/vk/callback`
5. В разделе «Настройки» → вкладка **VK ID** → включить
6. Получить **App ID** и **Защищённый ключ**

### Переменные

```env
VK_CLIENT_ID=<App ID>
VK_CLIENT_SECRET=<Защищённый ключ>
```

### Документация

- https://id.vk.com/about/business/go/docs/ru/vkid/latest/vk-id/connection/start-integration
- https://dev.vk.com/ru/api/oauth-params

### Примечания

- VK ID (новый протокол) отличается от старого OAuth VK
- Для продакшена нужно подтвердить домен
- Redirect URI для продакшена: `https://profitableweb.ru/api/auth/vk/callback`

---

## 3. Telegram Login Widget

**Бот**: https://t.me/BotFather

### Шаги

1. Открыть @BotFather в Telegram
2. Отправить `/newbot`
3. Указать имя: **ProfitableWeb Auth**
4. Указать username: `profitableweb_auth_bot` (или свободный)
5. Получить **Bot Token**
6. Отправить `/setdomain` → выбрать бота → указать `localhost` (для разработки)

### Переменные

```env
TELEGRAM_BOT_TOKEN=<Bot Token>
```

### Как работает

Telegram Login Widget — **не OAuth**. Это JavaScript-виджет, который:

1. Показывает кнопку «Войти через Telegram»
2. Пользователь подтверждает в Telegram-приложении
3. Виджет возвращает подписанные данные (id, first_name, username, photo_url, hash)
4. Бэкенд верифицирует `hash` через HMAC-SHA256 с `Bot Token`

### Интеграция на фронте

```html
<script
  async
  src="https://telegram.org/js/telegram-widget.js?22"
  data-telegram-login="profitableweb_auth_bot"
  data-size="large"
  data-onauth="onTelegramAuth(user)"
  data-request-access="write"
></script>
```

Или через Telegram Login URL:

```
https://oauth.telegram.org/auth?bot_id=<BOT_ID>&origin=<ORIGIN>&request_access=write
```

### Документация

- https://core.telegram.org/widgets/login
- https://core.telegram.org/bots/api#setwebhook

### Примечания

- Не требует client_secret — используется Bot Token для верификации подписи
- Домен `localhost` работает для разработки (через `/setdomain`)
- Для продакшена: `/setdomain` → `profitableweb.ru`

---

## 4. Google OAuth 2.0

**Консоль**: https://console.cloud.google.com/apis/credentials

### Шаги

1. Войти в Google Cloud Console
2. Создать проект (или выбрать существующий)
3. APIs & Services → **Credentials** → **Create Credentials** → **OAuth client ID**
4. Если впервые — настроить **OAuth consent screen**:
   - User Type: **External**
   - App name: **ProfitableWeb Admin**
   - User support email: ваш email
   - Scopes: `email`, `profile`, `openid`
   - Test users: добавить свой email (пока в testing mode)
5. Создать OAuth client:
   - Application type: **Web application**
   - Name: **ProfitableWeb Admin**
   - Authorized JavaScript origins: `http://localhost:3001`
   - Authorized redirect URIs: `http://localhost:8000/api/auth/google/callback`
6. Получить **Client ID** и **Client secret**

### Переменные

```env
GOOGLE_CLIENT_ID=<Client ID>
GOOGLE_CLIENT_SECRET=<Client secret>
```

### Документация

- https://developers.google.com/identity/protocols/oauth2/web-server
- https://developers.google.com/identity/openid-connect/openid-connect

### Примечания

- В testing mode — только добавленные test users могут входить
- Для продакшена: пройти верификацию (загрузить лого, описание, privacy policy)
- Redirect URI для продакшена: `https://profitableweb.ru/api/auth/google/callback`
- Origins для продакшена: `https://admin.profitableweb.ru`

---

## Сводная таблица

| Провайдер | Консоль                  | Redirect URI (dev)                        | Время получения |
| --------- | ------------------------ | ----------------------------------------- | --------------- |
| Yandex ID | oauth.yandex.ru          | `localhost:8000/api/auth/yandex/callback` | ~5 мин          |
| VK ID     | id.vk.com                | `localhost:8000/api/auth/vk/callback`     | ~10 мин         |
| Telegram  | @BotFather               | — (виджет, без redirect)                  | ~2 мин          |
| Google    | console.cloud.google.com | `localhost:8000/api/auth/google/callback` | ~10 мин         |

## Чеклист

- [ ] Yandex: `YANDEX_CLIENT_ID` + `YANDEX_CLIENT_SECRET` получены
- [ ] VK: `VK_CLIENT_ID` + `VK_CLIENT_SECRET` получены
- [ ] Telegram: `TELEGRAM_BOT_TOKEN` получен, домен настроен
- [ ] Google: `GOOGLE_CLIENT_ID` + `GOOGLE_CLIENT_SECRET` получены
- [ ] Все значения добавлены в `apps/api/.env`
- [ ] `.env.example` обновлён (без реальных значений)
