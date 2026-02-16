# База данных — обзор

## Стек

- **СУБД**: PostgreSQL 14
- **ORM**: SQLAlchemy 2.0, async (asyncpg)
- **Миграции**: Alembic
- **Расположение моделей**: `apps/api/src/models/`

## Связи

```
User ──< Article ──> Category
User ──< Comment ──> Article
Comment ──< Comment (parent_id, вложенные)
```

## Модели

### User (`users`)

| Поле             | Тип                | Описание                                 |
| ---------------- | ------------------ | ---------------------------------------- |
| `id`             | int, PK            |                                          |
| `name`           | str(255)           | Имя пользователя                         |
| `email`          | str(255), unique   | Email                                    |
| `role`           | str(50)            | `admin` / `editor` / `author` / `viewer` |
| `password_hash`  | str(255), nullable | Хэш пароля (для не-OAuth)                |
| `oauth_provider` | str(50), nullable  | `yandex` / `google` / `telegram`         |
| `oauth_id`       | str(255), nullable | ID у OAuth-провайдера                    |
| `created_at`     | datetime           | Дата регистрации                         |

### Category (`categories`)

| Поле          | Тип              | Описание           |
| ------------- | ---------------- | ------------------ |
| `id`          | int, PK          |                    |
| `name`        | str(255)         | Название категории |
| `slug`        | str(255), unique | URL-slug           |
| `description` | text, nullable   | Описание           |
| `created_at`  | datetime         |                    |

### Article (`articles`)

| Поле          | Тип              | Описание                           |
| ------------- | ---------------- | ---------------------------------- |
| `id`          | int, PK          |                                    |
| `title`       | str(500)         | Заголовок                          |
| `slug`        | str(500), unique | URL-slug                           |
| `content`     | text             | Содержимое статьи                  |
| `status`      | str(50)          | `draft` / `published` / `archived` |
| `category_id` | FK → categories  |                                    |
| `author_id`   | FK → users       |                                    |
| `created_at`  | datetime         |                                    |
| `updated_at`  | datetime         | Автообновление                     |

### Comment (`comments`)

| Поле         | Тип                     | Описание                   |
| ------------ | ----------------------- | -------------------------- |
| `id`         | int, PK                 |                            |
| `content`    | text                    | Текст комментария          |
| `article_id` | FK → articles           |                            |
| `user_id`    | FK → users              |                            |
| `parent_id`  | FK → comments, nullable | Для вложенных комментариев |
| `created_at` | datetime                |                            |
