import type { ArticlesParams } from './api-client';
import type {
  AdminArticlesParams,
  PaginationParams,
} from '@/app/types/admin-api';

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

export const adminArticleKeys = {
  all: ['admin', 'articles'] as const,
  lists: () => [...adminArticleKeys.all, 'list'] as const,
  list: (params?: AdminArticlesParams) =>
    [...adminArticleKeys.lists(), params] as const,
  details: () => [...adminArticleKeys.all, 'detail'] as const,
  detail: (id: string) => [...adminArticleKeys.details(), id] as const,
  revisions: (id: string, params?: PaginationParams) =>
    [...adminArticleKeys.detail(id), 'revisions', params] as const,
};

export const adminTagKeys = {
  all: ['admin', 'tags'] as const,
};

export const adminCategoryKeys = {
  all: ['admin', 'categories'] as const,
};

export const settingsKeys = {
  all: ['admin', 'settings'] as const,
};
