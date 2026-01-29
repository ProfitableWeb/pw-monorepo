import { Category } from '@/types';
import { Article } from '@/components/common/masonry/types';
import {
  Comment,
  CommentSearchParams,
  ArticleCommentThread,
} from '@profitable-web/types';
import { mockCategories } from './mock-data/categories';
import { mockArticles } from '@/components/common/masonry/data/mock-articles';
import {
  mockComments,
  mockArticleCommentsOneColumn,
  filterComments as filterCommentsUtil,
} from './mock-data/comments';

/**
 * Mock-функции для получения данных
 *
 * В будущем будут заменены на реальные API-вызовы:
 * - getCategoryBySlug(slug) → API endpoint `/api/categories/[slug]`
 * - getArticlesByCategory(categoryId) → API endpoint `/api/categories/[id]/articles`
 * - getArticleBySlug(slug) → API endpoint `/api/articles/[slug]`
 * - getUserComments(userId) → API endpoint `/api/users/[userId]/comments`
 */

/**
 * Получает категорию по slug
 * @param slug - URL-friendly идентификатор категории
 * @returns Категория или null если не найдена
 */
export async function getCategoryBySlug(
  slug: string
): Promise<Category | null> {
  return mockCategories.find(c => c.slug === slug) || null;
}

/**
 * Получает статьи по slug категории
 * @param categorySlug - Slug категории для фильтрации
 * @returns Массив статей в категории
 */
export async function getArticlesByCategory(
  categorySlug: string
): Promise<Article[]> {
  const category = mockCategories.find(c => c.slug === categorySlug);
  if (!category) return [];

  // Фильтруем статьи по полю category (теперь это slug категории)
  return mockArticles.filter(a => a.category === categorySlug);
}

/**
 * Получает статью по slug
 * @param slug - URL-friendly идентификатор статьи
 * @returns Статья или null если не найдена
 */
export async function getArticleBySlug(slug: string): Promise<Article | null> {
  return mockArticles.find(a => a.slug === slug) || null;
}

/**
 * Получает все категории
 * @returns Массив всех категорий
 */
export async function getAllCategories(): Promise<Category[]> {
  return mockCategories;
}

/**
 * Получает все статьи
 * @returns Массив всех статей
 */
export async function getAllArticles(): Promise<Article[]> {
  return mockArticles;
}

/**
 * Получает статьи автора
 * @param authorName - Имя автора
 * @returns Массив статей автора
 */
export async function getArticlesByAuthor(
  authorName: string
): Promise<Article[]> {
  // Пока у нас все статьи принадлежат одному автору
  // В будущем будем фильтровать по полю author в статье
  console.log(`[MockAPI] Getting articles for author: ${authorName}`);
  return mockArticles;
}

/**
 * Получает комментарии пользователя
 * @param userId - ID пользователя
 * @param params - Параметры фильтрации и пагинации
 * @returns Массив комментариев пользователя
 */
export async function getUserComments(
  userId: string,
  params?: CommentSearchParams
): Promise<Comment[]> {
  console.log(`[MockAPI] Getting comments for user: ${userId}`, params);

  let comments = mockComments.filter(c => c.userId === userId);

  // Фильтрация по поисковому запросу
  if (params?.query) {
    comments = filterCommentsUtil(comments, params.query);
  }

  // Пагинация
  const limit = params?.limit ?? comments.length;
  const offset = params?.offset ?? 0;

  return comments.slice(offset, offset + limit);
}

/**
 * Собирает комментарии статьи в ветки (корень + ответы)
 * @param comments - плоский список комментариев с parentId у ответов
 * @returns массив веток в порядке корней по createdAt
 */
function buildCommentThreads(comments: Comment[]): ArticleCommentThread[] {
  const roots = comments
    .filter(c => !c.parentId)
    .sort(
      (a, b) =>
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    );
  const byParent = new Map<string, Comment[]>();
  for (const c of comments) {
    if (!c.parentId) continue;
    const list = byParent.get(c.parentId) ?? [];
    list.push(c);
    byParent.set(c.parentId, list);
  }
  for (const list of byParent.values()) {
    list.sort(
      (a, b) =>
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    );
  }
  return roots.map(root => ({
    root,
    replies: byParent.get(root.id) ?? [],
  }));
}

/**
 * Получает комментарии статьи (ветки: корень + ответы) для one-column-article
 * @param articleSlug - slug статьи
 * @returns массив веток комментариев
 */
export async function getArticleCommentThreads(
  articleSlug: string
): Promise<ArticleCommentThread[]> {
  if (articleSlug === 'one-column-article') {
    return buildCommentThreads(mockArticleCommentsOneColumn);
  }
  return [];
}
