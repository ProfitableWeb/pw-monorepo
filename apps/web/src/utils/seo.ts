import { AUTHOR_SCHEMA } from '@/config/author';
import { Article } from '@/components/common/masonry/types';
import { Category } from '@/types';
import type { ArticleCommentThread } from '@profitable-web/types';

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
    url: `https://profitableweb.ru/${article.slug}`, // Короткий URL без /articles/
    author: AUTHOR_SCHEMA,
    ...(article.category && {
      articleSection: article.category,
    }),
    ...(article.readTime && {
      timeRequired: `PT${article.readTime}M`,
    }),
  };
}

/**
 * Разворачивает ветки комментариев в плоский список (корень + ответы по порядку)
 */
function flattenThreadsToComments(
  threads: ArticleCommentThread[]
): Array<{ userName: string; createdAt: string; content: string }> {
  const list: Array<{ userName: string; createdAt: string; content: string }> =
    [];
  for (const { root, replies } of threads) {
    list.push({
      userName: root.userName,
      createdAt: root.createdAt,
      content: root.content,
    });
    for (const r of replies) {
      list.push({
        userName: r.userName,
        createdAt: r.createdAt,
        content: r.content,
      });
    }
  }
  return list;
}

/**
 * Строит массив Schema.org Comment из веток комментариев
 */
export function buildSchemaOrgComments(threads: ArticleCommentThread[]): Array<{
  '@type': 'Comment';
  author: { '@type': 'Person'; name: string };
  datePublished: string;
  text: string;
}> {
  return flattenThreadsToComments(threads).map(c => ({
    '@type': 'Comment' as const,
    author: { '@type': 'Person' as const, name: c.userName },
    datePublished: c.createdAt,
    text: c.content,
  }));
}

/**
 * Генерирует JSON-LD BlogPosting с комментариями (Schema.org) для страницы статьи
 */
export function generateBlogPostingWithCommentsJsonLd(
  articleLike: {
    title: string;
    description?: string;
    datePublished: string;
    url: string;
  },
  threads: ArticleCommentThread[]
) {
  const commentList = buildSchemaOrgComments(threads);
  const count = threads.reduce((acc, t) => acc + 1 + t.replies.length, 0);
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: articleLike.title,
    ...(articleLike.description && { description: articleLike.description }),
    datePublished: articleLike.datePublished,
    url: articleLike.url,
    author: AUTHOR_SCHEMA,
    commentCount: count,
    comment: commentList,
  };
}

/**
 * Генерирует JSON-LD разметку для категории (Schema.org CollectionPage)
 *
 * @param category - Категория для генерации разметки
 * @param articles - Статьи в категории
 * @returns JSON-LD объект
 */
export function generateCategoryJsonLd(
  category: Category,
  articles: Article[]
) {
  const baseUrl = 'https://profitableweb.ru';

  return {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: category.name,
    description: category.description || `Статьи по категории ${category.name}`,
    url: `${baseUrl}/${category.slug}`,
    mainEntity: {
      '@type': 'ItemList',
      itemListElement: articles.map((article, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        item: {
          '@type': 'BlogPosting',
          headline: article.title,
          url: `${baseUrl}/${article.slug}`,
        },
      })),
    },
  };
}

/**
 * Генерирует JSON-LD разметку для страницы категорий
 *
 * @param categories - Список категорий
 * @returns JSON-LD объект
 */
export function generateCategoriesJsonLd(categories: Category[]) {
  const baseUrl = 'https://profitableweb.ru';

  return {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Категории статей',
    description:
      'Каталог всех категорий статей проекта ProfitableWeb. Материалы по экономике внимания, ИИ-автоматизации, UI/UX дизайну, продуктовой разработке и другим темам.',
    url: `${baseUrl}/categories`,
    mainEntity: {
      '@type': 'ItemList',
      itemListElement: categories.map((category, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        item: {
          '@type': 'CollectionPage',
          name: category.name,
          description: category.description,
          url: `${baseUrl}/${category.slug}`,
        },
      })),
    },
  };
}

/**
 * Генерирует JSON-LD разметку для хлебных крошек (Schema.org BreadcrumbList)
 *
 * @param items - Массив элементов breadcrumbs [{name: 'Главная', url: '/'}, ...]
 * @returns JSON-LD объект
 */
export function generateBreadcrumbJsonLd(
  items: Array<{ name: string; url: string }>
) {
  const baseUrl = 'https://profitableweb.ru';

  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url.startsWith('http') ? item.url : `${baseUrl}${item.url}`,
    })),
  };
}

/**
 * Генерирует JSON-LD разметку для хлебных крошек категории
 *
 * @param category - Категория
 * @returns JSON-LD объект
 */
export function generateCategoryBreadcrumbJsonLd(category: Category) {
  return generateBreadcrumbJsonLd([
    { name: 'Главная', url: '/' },
    { name: category.name, url: `/${category.slug}` },
  ]);
}

/**
 * Генерирует JSON-LD разметку BreadcrumbList для страницы категорий
 */
export function generateCategoriesBreadcrumbJsonLd() {
  return generateBreadcrumbJsonLd([
    { name: 'Главная', url: '/' },
    { name: 'Категории статей', url: '/categories' },
  ]);
}

/**
 * Генерирует JSON-LD разметку для хлебных крошек статьи
 *
 * @param article - Статья
 * @param category - Категория статьи (опционально)
 * @returns JSON-LD объект
 */
export function generateArticleBreadcrumbJsonLd(
  article: Article,
  category?: Category
) {
  const items: Array<{ name: string; url: string }> = [
    { name: 'Главная', url: '/' },
  ];

  if (category) {
    items.push({ name: category.name, url: `/${category.slug}` });
  }

  items.push({ name: article.title, url: `/${article.slug}` });

  return generateBreadcrumbJsonLd(items);
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
