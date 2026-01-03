import { Article } from '@/components/common/masonry/types';

/**
 * Форматирует дату в формат DD.MM.YYYY
 *
 * @param isoDate - Дата в ISO 8601 формате
 * @returns Отформатированная строка даты
 */
export function formatDate(isoDate: string): string {
  const date = new Date(isoDate);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}.${month}.${year}`;
}

/**
 * Генерирует JSON-LD разметку для статьи (Schema.org BlogPosting)
 *
 * @param article - Статья для генерации разметки
 * @returns JSON-LD объект
 */
export function generateArticleJsonLd(article: Article) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: article.title,
    description: article.subtitle,
    datePublished: article.createdAt,
    image: article.imageUrl,
    url: `https://profitableweb.ru/articles/${article.slug}`,
    author: {
      '@type': 'Organization',
      name: 'ProfitableWeb',
    },
    ...(article.category && {
      articleSection: article.category,
    }),
    ...(article.readTime && {
      timeRequired: `PT${article.readTime}M`,
    }),
  };
}

/**
 * Генерирует placeholder для изображения (серый блок)
 */
export function generatePlaceholderImage(
  width: number = 360,
  height: number = 152
): string {
  return `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='${width}' height='${height}'%3E%3Crect width='${width}' height='${height}' fill='%23EAEAEA'/%3E%3C/svg%3E`;
}
