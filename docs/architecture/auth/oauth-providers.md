# OAuth-провайдеры

## Обзор

| Провайдер | Консоль                                    | Scope                    | Получаемые данные                   |
| --------- | ------------------------------------------ | ------------------------ | ----------------------------------- |
| Yandex    | [oauth.yandex.ru](https://oauth.yandex.ru) | `login:info login:email` | id, name, email, avatar             |
| Telegram  | [BotFather](https://t.me/BotFather)        | — (Login Widget)         | id, first_name, username, photo_url |

> **Иностранные провайдеры входа не используются.** Состав провайдеров ограничен российскими информационными системами —
> проектное решение, обоснование и контекст в
> [ADR-002](../decisions/ADR-002-auth.md#2026-08-02--google-исключён-из-состава-провайдеров-входа). Новых иностранных
> провайдеров не добавлять.

## Callback URL

Callback URL формируется **динамически** из Request (не захардкожен):

```python
callback_url = f"{request.base_url}api/auth/{provider}/callback"
```

Для каждого окружения callback разный:

| Окружение | Callback URL                                               |
| --------- | ---------------------------------------------------------- |
| Local     | `http://localhost:8000/api/auth/{provider}/callback`       |
| Test      | `http://dev.profitableweb.ru/api/auth/{provider}/callback` |
| Prod      | `https://profitableweb.ru/api/auth/{provider}/callback`    |

**Важно**: каждый callback URL нужно зарегистрировать в консоли провайдера.

## Yandex

1. Зайти на [oauth.yandex.ru](https://oauth.yandex.ru)
2. Создать приложение → Веб-сервисы
3. Redirect URI: добавить callback для каждого окружения
4. Права: `login:info`, `login:email`
5. Сохранить `ClientID` и `ClientSecret` → GitVerse Secrets

```
YANDEX_CLIENT_ID=<из консоли>
YANDEX_CLIENT_SECRET=<из консоли>
```

## Telegram

Telegram использует Login Widget, а не стандартный OAuth redirect.

1. Создать бота через [@BotFather](https://t.me/BotFather): `/newbot`
2. Получить токен бота
3. Установить домен: `/setdomain` → `dev.profitableweb.ru`
4. Сохранить токен → GitVerse Secrets

```
TELEGRAM_BOT_TOKEN=123456789:ABCdef...
```

### Верификация Telegram auth

Данные от Telegram Widget проверяются через HMAC-SHA256 с хэшем токена бота:

```python
secret = hashlib.sha256(bot_token.encode()).digest()  # secret-scan:allow
check = hmac.new(secret, data_check_string.encode(), hashlib.sha256).hexdigest()
```

## Отключение провайдера

Если секреты провайдера не заданы (пустые), соответствующий OAuth-эндпоинт возвращает 404. Фронтенд скрывает кнопку
провайдера через `/api/auth/providers` (список активных провайдеров).
