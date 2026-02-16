# Секреты

## Хранение

Секреты хранятся в **GitVerse Secrets** (Settings → Secrets). При CI/CD деплое записываются в `.env` на VM. Пустые
секреты пропускаются — используются значения по умолчанию.

## Запись на VM

CI/CD workflow записывает секреты в файл `.env` в корне проекта:

```bash
cat > ~/profitableweb/.env << EOF
DATABASE_URL=${DATABASE_URL}
JWT_SECRET=${JWT_SECRET}
YANDEX_CLIENT_ID=${YANDEX_CLIENT_ID}
YANDEX_CLIENT_SECRET=${YANDEX_CLIENT_SECRET}
GOOGLE_CLIENT_ID=${GOOGLE_CLIENT_ID}
GOOGLE_CLIENT_SECRET=${GOOGLE_CLIENT_SECRET}
TELEGRAM_BOT_TOKEN=${TELEGRAM_BOT_TOKEN}
FRONTEND_URL=${FRONTEND_URL}
ADMIN_URL=${ADMIN_URL}
CORS_ORIGINS=${CORS_ORIGINS}
EOF
```

## Переменные окружения

| Переменная             | Описание                          | Пример                                              | Обязательная |
| ---------------------- | --------------------------------- | --------------------------------------------------- | ------------ |
| `DATABASE_URL`         | Строка подключения к PostgreSQL   | `postgresql+asyncpg://user:pass@localhost/db`       | Да           |
| `JWT_SECRET`           | Секрет для подписи JWT-токенов    | Случайная строка 64 символа                         | Да           |
| `YANDEX_CLIENT_ID`     | ID приложения в Яндекс OAuth      | `abc123def456`                                      | Нет          |
| `YANDEX_CLIENT_SECRET` | Секрет приложения Яндекс OAuth    | `secret_value`                                      | Нет          |
| `GOOGLE_CLIENT_ID`     | ID приложения в Google OAuth      | `123.apps.googleusercontent.com`                    | Нет          |
| `GOOGLE_CLIENT_SECRET` | Секрет приложения Google OAuth    | `GOCSPX-...`                                        | Нет          |
| `TELEGRAM_BOT_TOKEN`   | Токен бота для Telegram Login     | `123456:ABC-DEF`                                    | Нет          |
| `FRONTEND_URL`         | URL публичного сайта              | `http://dev.profitableweb.ru`                       | Да           |
| `ADMIN_URL`            | URL админ-панели                  | `http://dev.profitableweb.ru/admin`                 | Да           |
| `CORS_ORIGINS`         | Разрешённые origins через запятую | `http://dev.profitableweb.ru,http://localhost:3000` | Да           |

## Безопасность

- `.env` добавлен в `.gitignore` — **не коммитится**
- На VM файл доступен только пользователю `webresearcher` (chmod 600)
- OAuth-секреты опциональны: при отсутствии соответствующий провайдер отключается
- `JWT_SECRET` генерируется один раз: `openssl rand -hex 32`
