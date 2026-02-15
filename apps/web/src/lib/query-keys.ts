/**
 * React Query key factories для кеширования и инвалидации.
 */

export const queryKeys = {
  categories: {
    all: ['categories'] as const,
    bySlug: (slug: string) => ['categories', slug] as const,
    articles: (slug: string) => ['categories', slug, 'articles'] as const,
  },
  articles: {
    all: ['articles'] as const,
    bySlug: (slug: string) => ['articles', slug] as const,
    byAuthor: (name: string) => ['articles', 'author', name] as const,
  },
  comments: {
    byArticle: (slug: string) => ['comments', 'article', slug] as const,
    byUser: (userId: string, query?: string) =>
      ['comments', 'user', userId, { query }] as const,
  },
} as const;
