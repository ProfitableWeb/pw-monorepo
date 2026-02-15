/**
 * Типизированный API-клиент для Backend Content API (PW-027).
 *
 * Все функции повторяют контракт mock-api.ts, чтобы замена была прозрачной.
 * snake_case ответов API преобразуется в camelCase фронтенд-типов.
 */

import { Category } from '@/types';
import { Article } from '@/components/common/masonry/types';
import {
  Comment,
  CommentSearchParams,
  ArticleCommentThread,
} from '@profitable-web/types';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

// ---------------------------------------------------------------------------
// Внутренние типы ответов API (snake_case)
// ---------------------------------------------------------------------------

interface ApiResponseRaw<T> {
  success: boolean;
  data?: T;
  error?: { code: string; message: string; details?: Record<string, unknown> };
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
    has_more?: boolean;
  };
}

interface CategoryRaw {
  id: string;
  name: string;
  slug: string;
  subtitle?: string | null;
  description?: string | null;
  icon?: string | null;
  color?: string | null;
  article_count: number;
}

interface ArticleListItemRaw {
  id: string;
  title: string;
  slug: string;
  subtitle?: string | null;
  excerpt: string;
  summary?: string | null;
  category: string;
  tags: string[];
  reading_time?: number | null;
  image_url?: string | null;
  image_alt?: string | null;
  published_at?: string | null;
}

interface CommentRaw {
  id: string;
  user_id: string;
  user_name: string;
  user_avatar?: string | null;
  article_id: string;
  article_slug: string;
  article_title: string;
  content: string;
  created_at: string;
  updated_at?: string | null;
  parent_id?: string | null;
}

interface CommentThreadRaw {
  root: CommentRaw;
  replies: CommentRaw[];
}

// ---------------------------------------------------------------------------
// Маппинг snake_case → camelCase
// ---------------------------------------------------------------------------

function mapCategory(raw: CategoryRaw): Category {
  return {
    id: raw.id,
    name: raw.name,
    slug: raw.slug,
    subtitle: raw.subtitle ?? undefined,
    description: raw.description ?? undefined,
    icon: raw.icon ?? undefined,
    color: raw.color ?? undefined,
    articleCount: raw.article_count,
  };
}

function mapArticleListItem(raw: ArticleListItemRaw): Article {
  return {
    id: raw.id,
    title: raw.title,
    subtitle: raw.subtitle ?? '',
    slug: raw.slug,
    summary: raw.summary ?? raw.excerpt,
    category: raw.category,
    readTime: raw.reading_time ?? undefined,
    imageUrl: raw.image_url ?? undefined,
    imageAlt: raw.image_alt ?? undefined,
    createdAt: raw.published_at ?? '',
  };
}

function mapComment(raw: CommentRaw): Comment {
  return {
    id: raw.id,
    userId: raw.user_id,
    userName: raw.user_name,
    userAvatar: raw.user_avatar ?? undefined,
    articleId: raw.article_id,
    articleSlug: raw.article_slug,
    articleTitle: raw.article_title,
    content: raw.content,
    createdAt: raw.created_at,
    updatedAt: raw.updated_at ?? undefined,
    parentId: raw.parent_id ?? undefined,
  };
}

function mapCommentThread(raw: CommentThreadRaw): ArticleCommentThread {
  return {
    root: mapComment(raw.root),
    replies: raw.replies.map(mapComment),
  };
}

// ---------------------------------------------------------------------------
// Базовый fetch
// ---------------------------------------------------------------------------

class ApiError extends Error {
  constructor(
    public status: number,
    message: string
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

async function apiFetch<T>(
  path: string,
  options?: { next?: NextFetchRequestConfig }
): Promise<T | null> {
  const url = `${API_BASE}${path}`;

  const res = await fetch(url, {
    headers: { Accept: 'application/json' },
    ...options,
  });

  if (res.status === 404) return null;

  if (!res.ok) {
    throw new ApiError(res.status, `API error ${res.status}: ${url}`);
  }

  const json: ApiResponseRaw<T> = await res.json();

  if (!json.success) {
    throw new ApiError(res.status, json.error?.message ?? 'Unknown API error');
  }

  return json.data ?? null;
}

// ---------------------------------------------------------------------------
// Публичные функции (повторяют контракт mock-api.ts)
// ---------------------------------------------------------------------------

/**
 * Получает все категории
 */
export async function getAllCategories(): Promise<Category[]> {
  const data = await apiFetch<CategoryRaw[]>('/categories');
  return (data ?? []).map(mapCategory);
}

/**
 * Получает категорию по slug
 */
export async function getCategoryBySlug(
  slug: string
): Promise<Category | null> {
  const data = await apiFetch<CategoryRaw>(
    `/categories/${encodeURIComponent(slug)}`
  );
  return data ? mapCategory(data) : null;
}

/**
 * Получает статьи по slug категории
 */
export async function getArticlesByCategory(
  categorySlug: string
): Promise<Article[]> {
  const data = await apiFetch<ArticleListItemRaw[]>(
    `/categories/${encodeURIComponent(categorySlug)}/articles?limit=100`
  );
  return (data ?? []).map(mapArticleListItem);
}

/**
 * Получает все статьи
 */
export async function getAllArticles(): Promise<Article[]> {
  const data = await apiFetch<ArticleListItemRaw[]>('/articles?limit=100');
  return (data ?? []).map(mapArticleListItem);
}

/**
 * Получает статью по slug (возвращает проекцию для masonry-карточки)
 */
export async function getArticleBySlug(slug: string): Promise<Article | null> {
  const data = await apiFetch<ArticleListItemRaw>(
    `/articles/${encodeURIComponent(slug)}`
  );
  return data ? mapArticleListItem(data) : null;
}

/**
 * Получает статьи автора
 */
export async function getArticlesByAuthor(
  authorName: string
): Promise<Article[]> {
  const data = await apiFetch<ArticleListItemRaw[]>(
    `/articles?author=${encodeURIComponent(authorName)}&limit=100`
  );
  return (data ?? []).map(mapArticleListItem);
}

/**
 * Получает комментарии пользователя
 */
export async function getUserComments(
  userId: string,
  params?: CommentSearchParams
): Promise<Comment[]> {
  const query = new URLSearchParams();
  if (params?.query) query.set('query', params.query);
  if (params?.limit) query.set('limit', String(params.limit));
  if (params?.offset) query.set('offset', String(params.offset));

  const qs = query.toString();
  const data = await apiFetch<CommentRaw[]>(
    `/users/${encodeURIComponent(userId)}/comments${qs ? `?${qs}` : ''}`
  );
  return (data ?? []).map(mapComment);
}

/**
 * Получает комментарии статьи (ветки: корень + ответы)
 */
export async function getArticleCommentThreads(
  articleSlug: string
): Promise<ArticleCommentThread[]> {
  const data = await apiFetch<CommentThreadRaw[]>(
    `/articles/${encodeURIComponent(articleSlug)}/comments`
  );
  return (data ?? []).map(mapCommentThread);
}
