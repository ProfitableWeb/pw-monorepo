# Article Author Block

Компонент блока автора статьи с поддержкой SEO-оптимизации и Google E-E-A-T сигналов.

## 📁 Структура компонента

Компонент построен на атомарном подходе с четкой иерархией вложенности:

```
article-author/
├── ArticleAuthorBlock.tsx      # Основной компонент-контейнер
├── ArticleAuthorBlock.scss     # Стили контейнера и grid-композиция
├── index.ts                    # Публичные экспорты
│
├── avatar/                     # Компонент аватара автора
│   ├── ArticleAuthorAvatar.tsx
│   ├── ArticleAuthorAvatar.scss
│   └── index.ts
│
├── meta/                       # Мета-информация (метка, имя, соцсети)
│   ├── ArticleAuthorMeta.tsx
│   ├── ArticleAuthorMeta.scss
│   └── index.ts
│
├── description/                # Описание автора
│   ├── ArticleAuthorDescription.tsx
│   ├── ArticleAuthorDescription.scss
│   └── index.ts
│
└── divider/                    # Разделитель между блоками
    ├── ArticleAuthorDivider.tsx
    ├── ArticleAuthorDivider.scss
    └── index.ts
```

### Архитектурные принципы

1. **Атомарность**: Каждый подкомпонент отвечает за одну конкретную задачу
2. **Изоляция**: Стили и логика каждого компонента изолированы в своей папке
3. **Композиция**: Основной компонент собирает подкомпоненты в единое целое
4. **Переиспользование**: Подкомпоненты можно использовать независимо

## 🎯 Назначение

Компонент отображает информацию об авторе статьи под заголовком. Включает:

- Аватар автора
- Мета-информацию (метка "Автор статьи", имя)
- Социальные сети
- Описание/биографию автора
- Ссылку на полный профиль

## 🔍 SEO-оптимизация

### JSON-LD Schema.org разметка

Компонент автоматически генерирует структурированные данные типа `Person` для поисковых систем:

```json
{
  "@context": "https://schema.org",
  "@type": "Person",
  "@id": "https://profitableweb.ru/author#person",
  "name": "Николай Егоров",
  "jobTitle": "Фуллстек-разработчик и дизайнер",
  "description": "Исследователь агентных систем...",
  "url": "https://profitableweb.ru/author",
  "image": "https://profitableweb.ru/imgs/author/avatar.jpg",
  "sameAs": ["https://vk.com/...", "https://t.me/...", "https://github.com/..."]
}
```

### Ключевые SEO-поля

| Поле              | Назначение                                 | Важность     |
| ----------------- | ------------------------------------------ | ------------ |
| `@type: "Person"` | Указывает тип сущности как физическое лицо | **Критично** |
| `name`            | Полное имя автора                          | **Критично** |
| `jobTitle`        | Должность/роль автора                      | **Важно**    |
| `description`     | Биография и экспертиза                     | **Важно**    |
| `url`             | Ссылка на страницу автора                  | **Важно**    |
| `image`           | Фото автора                                | **Важно**    |
| `sameAs`          | Социальные сети (валидация личности)       | **Важно**    |
| `@id`             | Уникальный идентификатор                   | **Важно**    |

## 🎓 Google E-E-A-T и важность компонента

### Что такое E-E-A-T?

**E-E-A-T** (Experience, Expertise, Authoritativeness, Trustworthiness) — факторы ранжирования Google, определяющие
качество контента:

- **Experience** (Опыт) — автор имеет личный опыт в теме
- **Expertise** (Экспертиза) — автор является экспертом в области
- **Authoritativeness** (Авторитетность) — автор признан в своей области
- **Trustworthiness** (Надежность) — автор и контент заслуживают доверия

### Как компонент помогает E-E-A-T

1. **Идентификация автора**
   - Четкое указание авторства через Schema.org `Person`
   - Связь между контентом и конкретным человеком
   - Уникальный `@id` для идентификации

2. **Демонстрация экспертизы**
   - `jobTitle` показывает профессиональную роль
   - `description` раскрывает опыт и знания
   - Ссылка на профиль с полной биографией

3. **Валидация личности**
   - `sameAs` связывает автора с социальными сетями
   - Подтверждает реальность личности
   - Укрепляет доверие к контенту

4. **Визуальная идентификация**
   - Аватар создает личную связь
   - Улучшает узнаваемость автора
   - Повышает доверие читателей

### Почему это критично для Google

Google в своих
[руководящих принципах для оценщиков качества поиска](https://developers.google.com/search/docs/fundamentals/creating-helpful-content)
подчеркивает:

> "Для контента, где важна экспертность (YMYL — Your Money or Your Life), важно четко указывать автора и его
> квалификацию"

**Блок автора помогает:**

- ✅ Показать, что контент создан реальным экспертом
- ✅ Улучшить позиции в поисковой выдаче
- ✅ Получить расширенные сниппеты (rich snippets)
- ✅ Повысить CTR в результатах поиска
- ✅ Укрепить доверие пользователей

## 💻 Использование

### Базовое использование

```tsx
import { ArticleAuthorBlock } from '@/components/common/article-author';

<ArticleAuthorBlock />;
```

### С кастомными данными

```tsx
<ArticleAuthorBlock
  name='Иван Иванов'
  description='Эксперт по веб-разработке с 10-летним опытом...'
  jobTitle='Senior Frontend Developer'
  avatarSrc='/imgs/authors/ivan.jpg'
/>
```

### Использование подкомпонентов отдельно

```tsx
import { ArticleAuthorAvatar, ArticleAuthorMeta, ArticleAuthorDescription } from '@/components/common/article-author';

<div className='custom-author-layout'>
  <ArticleAuthorAvatar src='/avatar.jpg' alt='Автор' />
  <ArticleAuthorMeta name='Николай Егоров' />
  <ArticleAuthorDescription description='...' />
</div>;
```

## 📱 Адаптивность

### Десктоп/Планшет

- Горизонтальная компоновка: аватар слева, мета-информация и описание справа
- Разделитель между мета и описанием

### Мобильные (<640px)

- Grid-композиция: аватар и мета вертикально слева, описание справа
- Аватар увеличен до 80px
- Иконки социальных сетей перемещаются под описание
- Уменьшенные размеры шрифтов для компактности

## 🎨 Стилизация

### CSS-переменные

Компонент использует глобальные CSS-переменные:

- `--color-text-primary` — основной текст
- `--color-text-muted` — приглушенный текст
- `--color-text-body` — текст описания
- `--color-border` — границы и разделители
- `--color-primary` — акцентные цвета

### Кастомизация

Можно переопределить стили через `className`:

```tsx
<ArticleAuthorBlock className='custom-author-block' />
```

```scss
.custom-author-block {
  margin: 3em 0;

  .article-author-avatar {
    width: 100px;
    height: 100px;
  }
}
```

## 🔧 API

### ArticleAuthorBlock

| Prop          | Тип       | По умолчанию              | Описание                 |
| ------------- | --------- | ------------------------- | ------------------------ |
| `name`        | `string?` | Из `AUTHOR_FALLBACK`      | Имя автора               |
| `description` | `string?` | Из `AUTHOR_FALLBACK`      | Описание/биография       |
| `jobTitle`    | `string?` | Из `AUTHOR_FALLBACK`      | Должность автора         |
| `avatarSrc`   | `string?` | `/imgs/author/avatar.jpg` | URL аватара              |
| `className`   | `string?` | `''`                      | Дополнительный CSS класс |

### ArticleAuthorAvatar

| Prop        | Тип       | Описание                 |
| ----------- | --------- | ------------------------ |
| `src`       | `string`  | URL изображения аватара  |
| `alt`       | `string`  | Альтернативный текст     |
| `className` | `string?` | Дополнительный CSS класс |

### ArticleAuthorMeta

| Prop          | Тип        | По умолчанию     | Описание                   |
| ------------- | ---------- | ---------------- | -------------------------- |
| `name`        | `string`   | -                | Имя автора                 |
| `label`       | `string?`  | `'Автор статьи'` | Текст метки                |
| `showSocials` | `boolean?` | `true`           | Показывать социальные сети |
| `className`   | `string?`  | `''`             | Дополнительный CSS класс   |

### ArticleAuthorDescription

| Prop          | Тип       | По умолчанию  | Описание                 |
| ------------- | --------- | ------------- | ------------------------ |
| `description` | `string`  | -             | Текст описания           |
| `linkUrl`     | `string?` | `'/author'`   | URL ссылки "Подробнее"   |
| `linkText`    | `string?` | `'Подробнее'` | Текст ссылки             |
| `className`   | `string?` | `''`          | Дополнительный CSS класс |

## 📚 Дополнительные ресурсы

- [Google Search Central: Structured Data](https://developers.google.com/search/docs/appearance/structured-data)
- [Schema.org Person](https://schema.org/Person)
- [Google E-E-A-T Guidelines](https://developers.google.com/search/docs/fundamentals/creating-helpful-content)
- [Rich Results Test](https://search.google.com/test/rich-results) — проверка структурированных данных

---

**Версия:** 1.0.0  
**Последнее обновление:** 2026-01-16
