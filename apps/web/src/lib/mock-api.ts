import { Category } from '@/types';
import { Article } from '@/components/common/masonry/types';
import { mockCategories } from './mock-data/categories';
import { mockArticles } from '@/components/common/masonry/data/mock-articles';

/**
 * Mock-функции для получения данных
 *
 * В будущем будут заменены на реальные API-вызовы:
 * - getCategoryBySlug(slug) → API endpoint `/api/categories/[slug]`
 * - getArticlesByCategory(categoryId) → API endpoint `/api/categories/[id]/articles`
 * - getArticleBySlug(slug) → API endpoint `/api/articles/[slug]`
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
