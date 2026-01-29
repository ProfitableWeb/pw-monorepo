import { Comment } from '@profitable-web/types';

/** Slug статьи для одноколоночной демо-страницы */
export const ONE_COLUMN_ARTICLE_SLUG = 'one-column-article';

/**
 * Mock комментарии под статьёй one-column-article (корневые и ответы)
 * Для проверки блока комментариев и сворачивания ответов (5+ под одним корнем)
 */
export const mockArticleCommentsOneColumn: Comment[] = [
  {
    id: 'ac-1',
    userId: 'u-1',
    userName: 'Алексей',
    articleId: 'one-column-article',
    articleSlug: ONE_COLUMN_ARTICLE_SLUG,
    articleTitle: 'Пример одноколоночной статьи',
    content: 'Статья полезная, но хотелось бы больше примеров по разделу X.',
    createdAt: '2025-01-20T12:00:00Z',
  },
  {
    id: 'ac-2',
    userId: 'u-2',
    userName: 'Мария',
    articleId: 'one-column-article',
    articleSlug: ONE_COLUMN_ARTICLE_SLUG,
    articleTitle: 'Пример одноколоночной статьи',
    content:
      'Согласна с предыдущим оратором. Ещё вопрос: поддерживается ли Y в текущей версии?',
    createdAt: '2025-01-20T13:00:00Z',
  },
  {
    id: 'ac-2-1',
    userId: 'u-3',
    userName: 'Ольга',
    articleId: 'one-column-article',
    articleSlug: ONE_COLUMN_ARTICLE_SLUG,
    articleTitle: 'Пример одноколоночной статьи',
    content: 'Да, с версии 2.1.',
    createdAt: '2025-01-20T13:30:00Z',
    parentId: 'ac-2',
  },
  {
    id: 'ac-2-2',
    userId: 'u-4',
    userName: 'Дмитрий',
    articleId: 'one-column-article',
    articleSlug: ONE_COLUMN_ARTICLE_SLUG,
    articleTitle: 'Пример одноколоночной статьи',
    content: 'Документация здесь: …',
    createdAt: '2025-01-20T14:00:00Z',
    parentId: 'ac-2',
  },
  {
    id: 'ac-2-3',
    userId: 'u-2',
    userName: 'Мария',
    articleId: 'one-column-article',
    articleSlug: ONE_COLUMN_ARTICLE_SLUG,
    articleTitle: 'Пример одноколоночной статьи',
    content: 'Спасибо!',
    createdAt: '2025-01-20T14:15:00Z',
    parentId: 'ac-2',
  },
  {
    id: 'ac-2-4',
    userId: 'u-5',
    userName: 'Николай',
    articleId: 'one-column-article',
    articleSlug: ONE_COLUMN_ARTICLE_SLUG,
    articleTitle: 'Пример одноколоночной статьи',
    content: 'Добавлю в статью ссылку.',
    createdAt: '2025-01-20T14:30:00Z',
    parentId: 'ac-2',
  },
  {
    id: 'ac-2-5',
    userId: 'u-3',
    userName: 'Ольга',
    articleId: 'one-column-article',
    articleSlug: ONE_COLUMN_ARTICLE_SLUG,
    articleTitle: 'Пример одноколоночной статьи',
    content: 'Отлично, буду ждать.',
    createdAt: '2025-01-20T15:00:00Z',
    parentId: 'ac-2',
  },
  {
    id: 'ac-3',
    userId: 'u-6',
    userName: 'Игорь',
    articleId: 'one-column-article',
    articleSlug: ONE_COLUMN_ARTICLE_SLUG,
    articleTitle: 'Пример одноколоночной статьи',
    content: 'Спасибо за материал.',
    createdAt: '2025-01-20T16:00:00Z',
  },
];

/**
 * Mock данные комментариев пользователя
 * В будущем будут заменены на данные из API
 */
export const mockComments: Comment[] = [
  {
    id: '1',
    userId: 'user-1',
    userName: 'Николай Егоров',
    userAvatar: '/imgs/author/avatar.jpg',
    articleId: '1',
    articleSlug: 'ai-assistants-2025',
    articleTitle: 'ИИ-ассистенты в 2025: эволюция возможностей',
    content:
      'Отличная статья! Особенно понравилась концепция автоматизации рутинных задач. Думаю, в ближайшие годы мы увидим массовое внедрение таких систем в бизнес-процессы.',
    createdAt: '2025-01-20T14:30:00Z',
  },
  {
    id: '2',
    userId: 'user-1',
    userName: 'Николай Егоров',
    userAvatar: '/imgs/author/avatar.jpg',
    articleId: '2',
    articleSlug: 'future-of-work',
    articleTitle: 'Будущий труд: как автоматизация изменит рынок',
    content:
      'Интересный взгляд на проблему автоматизации. Однако стоит учитывать социальный аспект — необходимость переподготовки миллионов работников.',
    createdAt: '2025-01-19T10:15:00Z',
  },
  {
    id: '3',
    userId: 'user-1',
    userName: 'Николай Егоров',
    userAvatar: '/imgs/author/avatar.jpg',
    articleId: '3',
    articleSlug: 'prompt-engineering-guide',
    articleTitle: 'Руководство по prompt engineering',
    content:
      'Практические примеры очень полезны! Добавил бы ещё секцию про chain-of-thought prompting — это действительно мощный приём.',
    createdAt: '2025-01-18T16:45:00Z',
    updatedAt: '2025-01-18T16:50:00Z',
  },
  {
    id: '4',
    userId: 'user-1',
    userName: 'Николай Егоров',
    userAvatar: '/imgs/author/avatar.jpg',
    articleId: '4',
    articleSlug: 'llm-architecture',
    articleTitle: 'Архитектура больших языковых моделей',
    content:
      'Наконец-то понятное объяснение attention mechanism! Было бы здорово увидеть сравнение различных архитектур трансформеров.',
    createdAt: '2025-01-15T09:20:00Z',
  },
  {
    id: '5',
    userId: 'user-1',
    userName: 'Николай Егоров',
    userAvatar: '/imgs/author/avatar.jpg',
    articleId: '5',
    articleSlug: 'ai-ethics',
    articleTitle: 'Этика искусственного интеллекта',
    content:
      'Важная тема. Особенно согласен с пунктом про прозрачность алгоритмов — это ключ к доверию пользователей.',
    createdAt: '2025-01-10T12:00:00Z',
  },
];

/**
 * Фильтрует комментарии по поисковому запросу
 */
export function filterComments(comments: Comment[], query: string): Comment[] {
  if (!query.trim()) return comments;

  const lowerQuery = query.toLowerCase();

  return comments.filter(
    comment =>
      comment.content.toLowerCase().includes(lowerQuery) ||
      comment.articleTitle.toLowerCase().includes(lowerQuery)
  );
}
