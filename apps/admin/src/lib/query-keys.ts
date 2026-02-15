import type { ArticlesParams } from './api-client';

export const queryKeys = {
  categories: {
    all: ['categories'] as const,
  },
  articles: {
    all: ['articles'] as const,
    list: (params?: ArticlesParams) => ['articles', 'list', params] as const,
    bySlug: (slug: string) => ['articles', slug] as const,
    comments: (slug: string) => ['articles', slug, 'comments'] as const,
  },
  users: {
    comments: (userId: string, query?: string) =>
      ['users', userId, 'comments', { query }] as const,
  },
} as const;
