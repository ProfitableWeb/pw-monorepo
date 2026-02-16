# PW-034: Управление профилем пользователя

> **Статус**: TODO **Приоритет**: Normal **Компонент**: ⚛️ Frontend + 🐍 Backend **Дата**: 2026-02-16 **Связанные**:
> PW-030 (Auth)

## Цель

Пользователи (OAuth) могут управлять своим профилем: установить пароль, изменить имя, загрузить аватар. Подготовить
файловое хранилище для загрузки изображений.

## Текущее состояние

- Регистрация только через OAuth (Yandex, Google, Telegram)
- У OAuth-пользователей `password_hash = NULL` — войти по email/паролю не могут
- Профиль в web/ показывает имя, email, аватар — но всё read-only (mock)
- Нет эндпоинтов для обновления профиля
- Нет файлового хранилища для аватарок

## Фаза 1: Файловое хранилище (локальное)

### Backend

- [ ] Создать `apps/api/src/services/storage.py` — `StorageBackend` абстракция + `LocalStorage` реализация (см.
      [ADR-003](../../../architecture/decisions/ADR-003-file-storage.md) — задел на замену LocalStorage → S3Storage при
      появлении prod VM)
- [ ] Эндпоинт `POST /api/users/me/avatar` — загрузка аватара (multipart/form-data)
  - Валидация: только изображения, макс 2MB
  - Конвертация в WebP, ресайз до 256x256
  - Сохранение: `uploads/avatars/{user_id}.webp`
- [ ] Эндпоинт `DELETE /api/users/me/avatar` — удаление аватара
- [ ] Nginx: location `/uploads/` → статические файлы из `~/profitableweb/uploads/`

### Структура на диске

```
~/profitableweb/uploads/
├── avatars/{user_id}.webp
└── articles/{article_id}/   # на будущее
```

## Фаза 2: API управления профилем

### Backend

- [ ] `PATCH /api/users/me` — обновление профиля (name, bio, links)
  - **Не принимает email** — email меняется через отдельный flow с верификацией
  - `bio`: строка до 300 символов, nullable
  - `links`: массив URL до 5 шт., валидация формата
- [ ] `POST /api/users/me/email/change` — запрос смены email
  - Принимает `{ new_email: string }`
  - Проверяет уникальность email в БД
  - Генерирует verification token (uuid4, срок 24ч)
  - Сохраняет в таблицу `email_verifications` (user_id, new_email, token, expires_at)
  - Отправляет письмо на new_email со ссылкой подтверждения
  - До подтверждения — старый email остаётся активным
- [ ] `GET /api/users/me/email/verify?token=...` — подтверждение нового email
  - Проверяет token + не истёк
  - Обновляет email пользователя
  - Удаляет запись из `email_verifications`
  - Возвращает redirect на фронтенд с flash-сообщением
- [ ] `POST /api/users/me/password` — установка пароля для OAuth-пользователя
  - Если `password_hash` is NULL: принимает `new_password` (без старого)
  - Если `password_hash` задан: требует `old_password` + `new_password`
- [ ] `POST /api/users/me/password/change` — смена пароля (old + new)
- [ ] Pydantic-схемы: `UpdateProfileRequest`, `ChangeEmailRequest`, `SetPasswordRequest`, `ChangePasswordRequest`

### БД — новые поля и таблицы

- [ ] Миграция: добавить в `users` поля `bio` (text, nullable) и `links` (jsonb, default [])
- [ ] Миграция: таблица `email_verifications`:
  ```sql
  CREATE TABLE email_verifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    new_email VARCHAR(255) NOT NULL,
    token UUID NOT NULL UNIQUE DEFAULT gen_random_uuid(),
    expires_at TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
  );
  CREATE INDEX idx_email_verifications_token ON email_verifications(token);
  ```

### Email-отправка

- [ ] Сервис `apps/api/src/services/email.py` — абстракция отправки писем
  - Для dev: логирование в консоль (mock)
  - Для prod: SMTP или API-провайдер (Resend, Mailgun и т.д.)
- [ ] Шаблон письма подтверждения email

## Фаза 3: Frontend web — настройки профиля

### Модальное окно «Настройки» (уже есть каркас)

- [x] Вкладка «Профиль»:
  - Имя — редактируемое, сохраняется через PATCH
  - Email — редактируемый, но смена через отдельный flow с верификацией по ссылке
  - «О себе» — textarea до 300 символов с счётчиком
  - «Ссылки» — динамический список до 5 шт. (добавить/удалить)
- [x] Загрузка аватара: клик → file input → upload
- [ ] Вкладка «Безопасность» (новая):
  - Если пароль не установлен: форма «Установить пароль» (password + confirm)
  - Если пароль есть: форма «Сменить пароль» (old + new + confirm)
  - Показывать привязанные OAuth-провайдеры (Yandex, Google, Telegram)

## Фаза 4: Frontend admin — профиль администратора

Каркас настроек уже есть: `apps/admin/src/app/components/settings-page.tsx` (7 категорий, всё на mock).

- [ ] Добавить категорию «Профиль» первой в `settingsCategories` сайдбара
  - Вкладка «Данные»: имя, email (с верификацией), аватар, «О себе», ссылки (до 5) — PATCH /api/users/me
  - Вкладка «Безопасность»: установить/сменить пароль
  - Вкладка «OAuth»: привязанные провайдеры
- [ ] Управление пользователями: просмотр, смена ролей (admin only) — `users-page.tsx` уже есть как каркас

## Решения

| Вопрос           | Решение                     | Причина                                                           |
| ---------------- | --------------------------- | ----------------------------------------------------------------- |
| Хранилище файлов | Локальное (uploads/)        | Одна VM, простота, нет расходов                                   |
| Формат аватарок  | WebP 256x256                | Лёгкий, современный формат                                        |
| Отдача статики   | Nginx location              | Быстро, без нагрузки на Python                                    |
| Миграция на S3   | Позже (prod)                | Абстракция StorageBackend — замена в 1 строку конфига (ADR-003)   |
| Смена email      | Верификация через письмо    | OAuth-email подтверждён провайдером, свободная смена — уязвимость |
| Email в профиле  | Предзаполнен из OAuth, один | Не раскрываем внутреннюю механику пользователю                    |
| Поле bio         | text, до 300 символов       | Краткая информация о себе для публичного профиля                  |
| Поле links       | jsonb, до 5 URL             | Социальные ссылки, портфолио                                      |

## Затронутые файлы

### Новые:

1. `apps/api/src/services/storage.py` — StorageBackend + LocalStorage (ADR-003)
2. `apps/api/src/services/email.py` — абстракция отправки писем (mock + SMTP)
3. `apps/api/src/api/users.py` — эндпоинты профиля
4. `apps/api/src/schemas/user.py` — схемы запросов/ответов
5. `apps/api/src/models/email_verification.py` — модель email_verifications
6. `apps/web/src/components/common/form-controls/FancyButton/` — кнопка с градиентами (выделена из Button)

### Изменяемые:

1. `apps/api/src/api/router.py` — подключение users router
2. `apps/api/src/services/user.py` — методы update_profile, set_password, change_email
3. `apps/api/src/models/user.py` — поля avatar_url, bio, links
4. `apps/web/src/components/common/settings-modal/SettingsModal.tsx` — профиль, bio, links, email verification
5. `apps/web/src/components/common/settings-modal/SettingsModal.scss` — стили новых секций
6. `apps/web/src/components/common/form-controls/Button/` — упрощённая кнопка (без градиентов)
7. `apps/web/src/contexts/auth/AuthContext.tsx` — User { bio, links }
8. `apps/web/src/lib/api-client.ts` — новые API-функции, UserProfile { bio, links }
9. Nginx конфиг на VM — location /uploads/

### Зависимости Python (новые):

- `Pillow` — ресайз и конвертация изображений в WebP
- Email-провайдер (Resend / python-smtplib) — для верификационных писем
