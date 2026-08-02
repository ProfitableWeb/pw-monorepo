# PW-017 Страница "Мои комментарии"

**Статус**: DONE | **Компонент**: ⚛️ Frontend

## Обзор

Страница для просмотра и поиска всех комментариев авторизованного пользователя. Открывается через меню пользователя или
по прямому пути `/my-comments`.

## UX требования

### 1. Empty State (Состояние отсутствия комментариев)

Когда у пользователя нет комментариев:

**Визуал:**

- Центрированное содержимое по вертикали и горизонтали
- Иконка комментария (LuMessageSquare или аналогичная)
- Заголовок "У вас пока нет комментариев"
- Подзаголовок-подсказка: "Оставьте первый комментарий к статье — перейдите в [Блог]"
- Кнопка "Перейти к статьям" (ссылка на `/` или `/categories`)

**Стили:**

- Использовать CSS переменные темы
- Минимальная высота контейнера: 400px (или 60vh)
- Анимация появления (fade-in + slide-up через Framer Motion)

### 2. Header страницы

**Шапка с информацией:**

- Заголовок H1: "Мои комментарии"
- Информер с количеством: "Всего комментариев: <badge>42</badge>"
  - Badge с primary цветом, скруглённый, компактный

**Стили:**

- Padding сверху: 80px (как у AuthorPage)
- Выравнивание по левому краю
- На мобильных: центрирование

### 3. Поиск

**Функциональность:**

- Инпут поиска с плейсхолдером "Поиск по комментариям..."
- Фильтрация в реальном времени (debounce: 300ms)
- Поиск по:
  - Тексту комментария
  - Названию статьи
  - Имени автора статьи

**Интерфейс:**

- Иконка поиска внутри инпута (слева)
- Кнопка очистки (×) появляется при вводе текста
- Под инпутом: результат "Найдено: X комментариев"

**Состояния:**

- Empty: "Поиск не дал результатов"
- Loading: спиннер при загрузке (для реального API)

### 4. Список комментариев

**Карточка комментария:**

```
┌─────────────────────────────────────────────┐
│ [Avatar] Николай Егоров                      │
│          2 часа назад                         │
│                                              │
│ "Отличная статья! Особенно понравилась...    │
│  концепция автоматизации труда..."           │
│                                              │
│ ─────────────────────────────────────        │
│ 💬 В ответ на: ИИ-ассистенты в 2025         │
│              [Читать полностью →]            │
└─────────────────────────────────────────────┘
```

**Элементы карточки:**

- Аватар пользователя (28px)
- Имя пользователя (bold)
- Время публикации (относительное: "2 часа назад", "вчера")
- Текст комментария (обрезается до 3 строк, "...")
- Разделитель
- Ссылка на статью с иконкой 💬
- Кнопка/ссылка "Перейти к обсуждению"

**Стили:**

- Фон карточки: `var(--color-bg-secondary)`
- Border: 1px solid `var(--color-border)`
- Border-radius: `var(--radius-xl)`
- Padding: 1.5rem
- Hover эффект: лёгкий lift (transform: translateY(-2px))
- Gap между карточками: 1.5rem

**Адаптивность:**

- Мобильные (<768px):
  - Аватар: 24px
  - Padding: 1rem
  - Gap: 1rem

### 5. Пагинация

**Опционально (для большого количества):**

- Кнопка "Загрузить ещё" внизу списка
- Или infinite scroll

## Техническая реализация

### Структура файлов

```
apps/web/src/
├── app/my-comments/
│   └── page.tsx                                    # Server Component
├── components/app-layout/app-my-comments-page/
│   ├── MyCommentsPage.tsx                          # Main layout component
│   ├── MyCommentsPage.scss
│   │
│   ├── header/
│   │   ├── MyCommentsPageHeader.tsx                # Header with stats
│   │   └── MyCommentsPageHeader.scss
│   │
│   ├── search/
│   │   ├── MyCommentsSearch.tsx                    # Search input component
│   │   └── MyCommentsSearch.scss
│   │
│   ├── empty-state/
│   │   ├── MyCommentsEmptyState.tsx                # Empty state component
│   │   └── MyCommentsEmptyState.scss
│   │
│   ├── comment-list/
│   │   ├── MyCommentsList.tsx                      # List container
│   │   ├── MyCommentsList.scss
│   │   ├── CommentCard.tsx                         # Single comment card
│   │   └── CommentCard.scss
│   │
│   └── index.ts                                    # Barrel export
```

### Типы (packages/types/)

```typescript
// packages/types/comment.ts
export interface Comment {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  articleId: string;
  articleSlug: string;
  articleTitle: string;
  content: string;
  createdAt: string; // ISO datetime
  updatedAt?: string;
}

export interface CommentSearchParams {
  query?: string;
  limit?: number;
  offset?: number;
}
```

### Mock API (apps/web/src/lib/mock-api.ts)

```typescript
/**
 * Получает все комментарии пользователя
 * @param userId - ID пользователя
 * @param params - Параметры фильтрации и пагинации
 */
export async function getUserComments(userId: string, params?: CommentSearchParams): Promise<Comment[]> {
  // Mock implementation
  // В будущем: API endpoint `/api/users/[userId]/comments`
}
```

### SEO metadata

```typescript
// apps/web/src/app/my-comments/page.tsx
export const metadata: Metadata = {
  title: 'Мои комментарии',
  description: 'Все ваши комментарии на сайте',
  robots: 'noindex, nofollow', // Приватная страница
};
```

### Layout pattern (как AuthorPage)

```tsx
// MyCommentsPage.tsx
export const MyCommentsPage: React.FC<MyCommentsPageProps> = ({ comments }) => {
  return (
    <div className='my-comments-page'>
      <AppBar />
      <AppPageWrapper>
        <main>
          <MyCommentsPageHeader count={comments.length} />
          <MyCommentsSearch onSearch={handleSearch} />
          {comments.length === 0 ? <MyCommentsEmptyState /> : <MyCommentsList comments={comments} />}
        </main>
        <AppFooter />
      </AppPageWrapper>
    </div>
  );
};
```

## Accessibility (WCAG 2.1 AA)

- Focus visible на всех интерактивных элементах
- ARIA labels для иконок
- Семантическая разметка (article, time, nav)
- Keyboard navigation (Escape для закрытия поиска)
- Announcements для screen readers при изменении результатов поиска

## Анимации (Framer Motion)

- Fade-in для страницы
- Stagger для списка комментариев
- Smooth transition для empty state

## Приоритет задач

1. [ ] Добавить типы Comment в packages/types
2. [ ] Создать mock данные для комментариев
3. [ ] Реализовать MyCommentsEmptyState
4. [ ] Реализовать MyCommentsPageHeader
5. [ ] Реализовать CommentCard
6. [ ] Реализовать MyCommentsSearch
7. [ ] Реализовать MyCommentsList
8. [ ] Реализовать MyCommentsPage
9. [ ] Создать page.tsx с metadata
10. [ ] Адаптивность и mobile testing

## История изменений

- 2025-01-21: Создание ТЗ, описание UX требований
