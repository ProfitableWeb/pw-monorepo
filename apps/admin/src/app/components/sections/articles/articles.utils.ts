import type { Article } from './articles.types';

export function getStatusColor(status: string): string {
  switch (status) {
    case 'published':
      return 'bg-green-500/10 text-green-700 dark:text-green-400 hover:bg-green-500/20';
    case 'draft':
      return 'bg-yellow-500/10 text-yellow-700 dark:text-yellow-400 hover:bg-yellow-500/20';
    default:
      return '';
  }
}

export function getStatusLabel(status: string): string {
  switch (status) {
    case 'published':
      return 'Опубликована';
    case 'draft':
      return 'Черновик';
    default:
      return status;
  }
}

/** Фильтрация статей по всем активным фильтрам */
export function filterArticles(
  articles: Article[],
  searchQuery: string,
  selectedStatuses: string[],
  selectedCategories: string[],
  dateRange: { from?: Date; to?: Date }
): Article[] {
  return articles.filter(article => {
    const matchesSearch =
      article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.author.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      selectedStatuses.length === 0 ||
      selectedStatuses.includes(article.status);
    const matchesCategory =
      selectedCategories.length === 0 ||
      selectedCategories.includes(article.category);

    const articleDate = article.date ? new Date(article.date) : null;
    const matchesDateFrom =
      !dateRange.from || (articleDate && articleDate >= dateRange.from);
    const matchesDateTo =
      !dateRange.to || (articleDate && articleDate <= dateRange.to);
    const matchesDate = matchesDateFrom && matchesDateTo;

    return matchesSearch && matchesStatus && matchesCategory && matchesDate;
  });
}
