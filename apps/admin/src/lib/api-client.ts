/**
 * PW-029 | Типизированный API-клиент для админки.
 * Аналог apps/web/src/lib/api-client.ts, но для Vite (import.meta.env).
 */

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

// ---------------------------------------------------------------------------
// Raw API types (snake_case)
// ---------------------------------------------------------------------------

interface ApiResponseRaw<T> {
  success: boolean;
  data?: T;
  error?: { code: string; message: string };
  meta?: { page?: number; limit?: number; total?: number; has_more?: boolean };
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

interface ArticleFullRaw extends ArticleListItemRaw {
  content: string;
  author?: string | null;
  views: number;
  layout: string;
  updated_at?: string | null;
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
// Public types (camelCase)
// ---------------------------------------------------------------------------

export interface AdminCategory {
  id: string;
  name: string;
  slug: string;
  subtitle?: string;
  description?: string;
  icon?: string;
  color?: string;
  articleCount: number;
}

export interface AdminArticle {
  id: string;
  title: string;
  slug: string;
  subtitle?: string;
  excerpt: string;
  category: string;
  tags: string[];
  author?: string;
  views: number;
  readingTime?: number;
  imageUrl?: string;
  publishedAt?: string;
  updatedAt?: string;
}

export interface AdminComment {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  articleId: string;
  articleSlug: string;
  articleTitle: string;
  content: string;
  createdAt: string;
  updatedAt?: string;
  parentId?: string;
}

export interface AdminCommentThread {
  root: AdminComment;
  replies: AdminComment[];
}

export interface ApiMeta {
  page?: number;
  limit?: number;
  total?: number;
  hasMore?: boolean;
}

export interface PaginatedResult<T> {
  data: T[];
  meta: ApiMeta;
}

// ---------------------------------------------------------------------------
// Mappers
// ---------------------------------------------------------------------------

function mapCategory(raw: CategoryRaw): AdminCategory {
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

function mapArticle(raw: ArticleListItemRaw | ArticleFullRaw): AdminArticle {
  const full = raw as ArticleFullRaw;
  return {
    id: raw.id,
    title: raw.title,
    slug: raw.slug,
    subtitle: raw.subtitle ?? undefined,
    excerpt: raw.excerpt,
    category: raw.category,
    tags: raw.tags,
    author: full.author ?? undefined,
    views: full.views ?? 0,
    readingTime: raw.reading_time ?? undefined,
    imageUrl: raw.image_url ?? undefined,
    publishedAt: raw.published_at ?? undefined,
    updatedAt: full.updated_at ?? undefined,
  };
}

function mapComment(raw: CommentRaw): AdminComment {
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

function mapThread(raw: CommentThreadRaw): AdminCommentThread {
  return {
    root: mapComment(raw.root),
    replies: raw.replies.map(mapComment),
  };
}

// ---------------------------------------------------------------------------
// Base fetch
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

async function apiFetch<T>(path: string): Promise<T | null> {
  const url = `${API_BASE}${path}`;
  const res = await fetch(url, { headers: { Accept: 'application/json' } });

  if (res.status === 404) return null;
  if (!res.ok)
    throw new ApiError(res.status, `API error ${res.status}: ${url}`);

  const json: ApiResponseRaw<T> = await res.json();
  if (!json.success)
    throw new ApiError(res.status, json.error?.message ?? 'Unknown API error');

  return json.data ?? null;
}

async function apiFetchWithMeta<T>(
  path: string
): Promise<{ data: T | null; meta: ApiMeta }> {
  const url = `${API_BASE}${path}`;
  const res = await fetch(url, { headers: { Accept: 'application/json' } });

  if (!res.ok)
    throw new ApiError(res.status, `API error ${res.status}: ${url}`);

  const json: ApiResponseRaw<T> = await res.json();
  if (!json.success)
    throw new ApiError(res.status, json.error?.message ?? 'Unknown API error');

  return {
    data: json.data ?? null,
    meta: {
      page: json.meta?.page,
      limit: json.meta?.limit,
      total: json.meta?.total,
      hasMore: json.meta?.has_more,
    },
  };
}

// ---------------------------------------------------------------------------
// Public API functions
// ---------------------------------------------------------------------------

export async function getAllCategories(): Promise<AdminCategory[]> {
  const data = await apiFetch<CategoryRaw[]>('/categories');
  return (data ?? []).map(mapCategory);
}

export interface ArticlesParams {
  page?: number;
  limit?: number;
  category?: string;
  search?: string;
  sortBy?: string;
  order?: 'asc' | 'desc';
  author?: string;
}

export async function getArticles(
  params?: ArticlesParams
): Promise<PaginatedResult<AdminArticle>> {
  const q = new URLSearchParams();
  if (params?.page) q.set('page', String(params.page));
  if (params?.limit) q.set('limit', String(params.limit));
  if (params?.category) q.set('category', params.category);
  if (params?.search) q.set('search', params.search);
  if (params?.sortBy) q.set('sort_by', params.sortBy);
  if (params?.order) q.set('order', params.order);
  if (params?.author) q.set('author', params.author);

  const qs = q.toString();
  const result = await apiFetchWithMeta<ArticleListItemRaw[]>(
    `/articles${qs ? `?${qs}` : ''}`
  );
  return {
    data: (result.data ?? []).map(mapArticle),
    meta: result.meta,
  };
}

export async function getArticleBySlug(
  slug: string
): Promise<AdminArticle | null> {
  const data = await apiFetch<ArticleFullRaw>(
    `/articles/${encodeURIComponent(slug)}`
  );
  return data ? mapArticle(data) : null;
}

export async function getArticleComments(
  articleSlug: string
): Promise<AdminCommentThread[]> {
  const data = await apiFetch<CommentThreadRaw[]>(
    `/articles/${encodeURIComponent(articleSlug)}/comments`
  );
  return (data ?? []).map(mapThread);
}

export async function getUserComments(
  userId: string,
  params?: { query?: string; limit?: number; offset?: number }
): Promise<AdminComment[]> {
  const q = new URLSearchParams();
  if (params?.query) q.set('query', params.query);
  if (params?.limit) q.set('limit', String(params.limit));
  if (params?.offset) q.set('offset', String(params.offset));

  const qs = q.toString();
  const data = await apiFetch<CommentRaw[]>(
    `/users/${encodeURIComponent(userId)}/comments${qs ? `?${qs}` : ''}`
  );
  return (data ?? []).map(mapComment);
}
