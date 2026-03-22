/**
 * Типизированный API-клиент админки.
 *
 * Архитектура: Raw-типы (snake_case) → mappers → Public-типы (camelCase).
 * Авто-рефреш при 401 (одна повторная попытка через authRefresh).
 * credentials: 'include' для httpOnly-кук авторизации.
 *
 * @see store/auth-store.ts — использует authLogin, authLogout, authGetMe
 * @see apps/web/src/lib/api-client.ts — аналогичный клиент для web
 */

import type {
  McpApiKey,
  McpApiKeyCreateResult,
  McpAuditEntry,
  McpConnectionStatus,
  McpKeyCreatePayload,
} from '@/app/components/sections/mcp/mcp.types';

const API_BASE = import.meta.env.VITE_API_URL || '/api';

// ---------------------------------------------------------------------------
// Raw-типы API (snake_case — как возвращает бэкенд)
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
  categories: string[];
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
// Публичные типы (camelCase — используются в компонентах)
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
  categories: string[];
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
// Типы авторизации
// ---------------------------------------------------------------------------

interface AuthUserRaw {
  id: string;
  name: string;
  email: string;
  avatar?: string | null;
  role: string;
}

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: string;
}

// ---------------------------------------------------------------------------
// Маппинг snake_case → camelCase
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
    categories: raw.categories ?? [],
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

function mapAuthUser(raw: AuthUserRaw): AuthUser {
  return {
    id: raw.id,
    name: raw.name,
    email: raw.email,
    avatar: raw.avatar ?? undefined,
    role: raw.role,
  };
}

// ---------------------------------------------------------------------------
// Базовый fetch с авто-рефрешем
// ---------------------------------------------------------------------------

export class ApiError extends Error {
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
  const res = await fetch(url, {
    headers: { Accept: 'application/json' },
    credentials: 'include',
  });

  if (res.status === 404) return null;

  // 401 — пробуем refresh один раз
  if (res.status === 401 && !path.startsWith('/auth/')) {
    const refreshed = await authRefresh();
    if (refreshed) {
      const retry = await fetch(url, {
        headers: { Accept: 'application/json' },
        credentials: 'include',
      });
      if (retry.ok) {
        const json: ApiResponseRaw<T> = await retry.json();
        return json.data ?? null;
      }
    }
    throw new ApiError(401, 'Не авторизован');
  }

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
  const res = await fetch(url, {
    headers: { Accept: 'application/json' },
    credentials: 'include',
  });

  if (res.status === 401 && !path.startsWith('/auth/')) {
    const refreshed = await authRefresh();
    if (refreshed) {
      const retry = await fetch(url, {
        headers: { Accept: 'application/json' },
        credentials: 'include',
      });
      if (retry.ok) {
        const json: ApiResponseRaw<T> = await retry.json();
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
    }
    throw new ApiError(401, 'Не авторизован');
  }

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
// Публичные API-функции: контент
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

// ---------------------------------------------------------------------------
// API авторизации
// ---------------------------------------------------------------------------

export async function authLogin(
  email: string,
  password: string
): Promise<AuthUser> {
  const res = await fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ email, password }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new ApiError(res.status, err.detail ?? 'Ошибка авторизации');
  }
  const raw: AuthUserRaw = await res.json();
  return mapAuthUser(raw);
}

export async function authLogout(): Promise<void> {
  await fetch(`${API_BASE}/auth/logout`, {
    method: 'POST',
    credentials: 'include',
  });
}

export async function authGetMe(): Promise<AuthUser | null> {
  try {
    const res = await fetch(`${API_BASE}/auth/me`, {
      credentials: 'include',
    });
    if (!res.ok) return null;
    const raw: AuthUserRaw = await res.json();
    return mapAuthUser(raw);
  } catch {
    return null;
  }
}

export async function authRefresh(): Promise<boolean> {
  try {
    const res = await fetch(`${API_BASE}/auth/refresh`, {
      method: 'POST',
      credentials: 'include',
    });
    return res.ok;
  } catch {
    return false;
  }
}

export async function getOAuthUrl(provider: string): Promise<string> {
  // Base path (/admin) — чтобы после OAuth вернуться в админку
  const origin = window.location.origin + '/admin';
  const res = await fetch(
    `${API_BASE}/auth/${provider}/url?origin=${encodeURIComponent(origin)}`,
    { credentials: 'include' }
  );
  if (!res.ok) throw new ApiError(res.status, 'Ошибка получения OAuth URL');
  const json = await res.json();
  return json.url;
}

// ---------------------------------------------------------------------------
// API профиля пользователя
// ---------------------------------------------------------------------------

interface ProfileRaw {
  id: string;
  name: string;
  email: string;
  avatar?: string | null;
  role: string;
  bio?: string | null;
  links?: string[];
  has_password: boolean;
  oauth_provider?: string | null;
  oauth_providers?: string[];
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: string;
  bio?: string;
  links?: string[];
  hasPassword: boolean;
  oauthProvider?: string;
  oauthProviders: string[];
}

function mapProfile(raw: ProfileRaw): UserProfile {
  return {
    id: raw.id,
    name: raw.name,
    email: raw.email,
    avatar: raw.avatar ?? undefined,
    role: raw.role,
    bio: raw.bio ?? undefined,
    links: raw.links ?? [],
    hasPassword: raw.has_password,
    oauthProvider: raw.oauth_provider ?? undefined,
    oauthProviders: raw.oauth_providers ?? [],
  };
}

export async function getProfile(): Promise<UserProfile | null> {
  const url = `${API_BASE}/users/me`;
  const res = await fetch(url, {
    headers: { Accept: 'application/json' },
    credentials: 'include',
  });
  if (!res.ok) return null;
  const json: ApiResponseRaw<ProfileRaw> = await res.json();
  return json.data ? mapProfile(json.data) : null;
}

export async function updateProfile(updates: {
  name?: string;
  bio?: string;
  links?: string[];
}): Promise<UserProfile> {
  const res = await fetch(`${API_BASE}/users/me`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(updates),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new ApiError(res.status, err.detail ?? 'Ошибка обновления профиля');
  }
  const json: ApiResponseRaw<ProfileRaw> = await res.json();
  if (!json.data) throw new ApiError(500, 'Нет данных');
  return mapProfile(json.data);
}

export async function setPassword(newPassword: string): Promise<UserProfile> {
  const res = await fetch(`${API_BASE}/users/me/password`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ new_password: newPassword }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new ApiError(res.status, err.detail ?? 'Ошибка установки пароля');
  }
  const json: ApiResponseRaw<ProfileRaw> = await res.json();
  if (!json.data) throw new ApiError(500, 'Нет данных');
  return mapProfile(json.data);
}

export async function changePassword(
  oldPassword: string,
  newPassword: string
): Promise<UserProfile> {
  const res = await fetch(`${API_BASE}/users/me/password/change`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({
      old_password: oldPassword,
      new_password: newPassword,
    }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new ApiError(res.status, err.detail ?? 'Ошибка смены пароля');
  }
  const json: ApiResponseRaw<ProfileRaw> = await res.json();
  if (!json.data) throw new ApiError(500, 'Нет данных');
  return mapProfile(json.data);
}

export async function uploadAvatar(file: File): Promise<UserProfile> {
  const formData = new FormData();
  formData.append('file', file);
  const res = await fetch(`${API_BASE}/users/me/avatar`, {
    method: 'POST',
    credentials: 'include',
    body: formData,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new ApiError(res.status, err.detail ?? 'Ошибка загрузки аватара');
  }
  const json: ApiResponseRaw<ProfileRaw> = await res.json();
  if (!json.data) throw new ApiError(500, 'Нет данных');
  return mapProfile(json.data);
}

export async function deleteAvatar(): Promise<UserProfile> {
  const res = await fetch(`${API_BASE}/users/me/avatar`, {
    method: 'DELETE',
    credentials: 'include',
  });
  if (!res.ok) throw new ApiError(res.status, 'Ошибка удаления аватара');
  const json: ApiResponseRaw<ProfileRaw> = await res.json();
  if (!json.data) throw new ApiError(500, 'Нет данных');
  return mapProfile(json.data);
}

// ---------------------------------------------------------------------------
// Базовый fetch для мутаций (POST / PATCH / DELETE)
// ---------------------------------------------------------------------------

interface ApiMutateOptions {
  method: 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  body?: unknown;
}

async function apiMutate<T>(
  path: string,
  { method, body }: ApiMutateOptions
): Promise<T | null> {
  const url = `${API_BASE}${path}`;
  const headers: Record<string, string> = { Accept: 'application/json' };
  if (body !== undefined) headers['Content-Type'] = 'application/json';

  const res = await fetch(url, {
    method,
    headers,
    credentials: 'include',
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  if (res.status === 204) return null;

  if (res.status === 401 && !path.startsWith('/auth/')) {
    const refreshed = await authRefresh();
    if (refreshed) {
      const retry = await fetch(url, {
        method,
        headers,
        credentials: 'include',
        body: body !== undefined ? JSON.stringify(body) : undefined,
      });
      if (retry.status === 204) return null;
      if (retry.ok) {
        const json: ApiResponseRaw<T> = await retry.json();
        return json.data ?? null;
      }
    }
    throw new ApiError(401, 'Не авторизован');
  }

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new ApiError(res.status, err.detail ?? `API error ${res.status}`);
  }

  const json: ApiResponseRaw<T> = await res.json();
  if (!json.success)
    throw new ApiError(res.status, json.error?.message ?? 'Unknown API error');

  return json.data ?? null;
}

// ---------------------------------------------------------------------------
// Admin API — типы и маппинг
// ---------------------------------------------------------------------------

import type {
  AdminArticleResponse as AdminArticleResponseType,
  AdminArticleListItem as AdminArticleListItemType,
  AdminArticlesParams,
  ArticleCreatePayload,
  ArticleUpdatePayload,
  AdminTag as AdminTagType,
  AdminCategoryFull,
  SystemSettings,
  RevisionListItem as RevisionListItemType,
  RevisionResponse as RevisionResponseType,
  PaginationParams,
} from '@/app/types/admin-api';

interface AdminArticleRaw {
  id: string;
  title: string;
  slug: string;
  subtitle: string | null;
  content: string;
  content_format: string;
  excerpt: string;
  summary: string | null;
  status: string;
  layout: string;
  image_url: string | null;
  image_alt: string | null;
  reading_time: number | null;
  views: number;
  published_at: string | null;
  created_at: string;
  updated_at: string;
  meta_title: string | null;
  meta_description: string | null;
  canonical_url: string | null;
  og_title: string | null;
  og_description: string | null;
  og_image: string | null;
  focus_keyword: string | null;
  seo_keywords: string[];
  schema_type: string | null;
  robots_no_index: boolean;
  robots_no_follow: boolean;
  primary_category: { id: string; name: string; slug: string };
  additional_categories: { id: string; name: string; slug: string }[];
  tags: { id: string; name: string; slug: string }[];
  author: { id: string; name: string } | null;
  artifacts: any;
  toc: any;
  revision_count: number;
}

interface AdminArticleListItemRaw {
  id: string;
  title: string;
  slug: string;
  status: string;
  excerpt: string;
  primary_category: { id: string; name: string; slug: string };
  additional_categories: { id: string; name: string; slug: string }[];
  tags: { id: string; name: string; slug: string }[];
  author: { id: string; name: string } | null;
  image_url: string | null;
  reading_time: number | null;
  views: number;
  published_at: string | null;
  created_at: string;
  updated_at: string;
}

interface AdminTagRaw {
  id: string;
  name: string;
  slug: string;
  color: string | null;
  group: string | null;
  article_count: number;
  created_at: string | null;
}

interface AdminCategoryFullRaw {
  id: string;
  name: string;
  slug: string;
  subtitle: string | null;
  description: string | null;
  icon: string | null;
  color: string | null;
  parent_id: string | null;
  order: number;
  article_count: number;
  is_default: boolean;
}

interface SystemSettingsRaw {
  timezone: string;
  updated_at: string;
}

interface RevisionListItemRaw {
  id: string;
  summary: string | null;
  content_format: string;
  author_id: string | null;
  created_at: string;
}

interface RevisionResponseRaw extends RevisionListItemRaw {
  content: string;
}

function mapAdminArticleFull(raw: AdminArticleRaw): AdminArticleResponseType {
  return {
    id: raw.id,
    title: raw.title,
    slug: raw.slug,
    subtitle: raw.subtitle,
    content: raw.content,
    contentFormat: raw.content_format,
    excerpt: raw.excerpt,
    summary: raw.summary,
    status: raw.status,
    layout: raw.layout,
    imageUrl: raw.image_url,
    imageAlt: raw.image_alt,
    readingTime: raw.reading_time,
    views: raw.views,
    publishedAt: raw.published_at,
    createdAt: raw.created_at,
    updatedAt: raw.updated_at,
    metaTitle: raw.meta_title,
    metaDescription: raw.meta_description,
    canonicalUrl: raw.canonical_url,
    ogTitle: raw.og_title,
    ogDescription: raw.og_description,
    ogImage: raw.og_image,
    focusKeyword: raw.focus_keyword,
    seoKeywords: raw.seo_keywords,
    schemaType: raw.schema_type,
    robotsNoIndex: raw.robots_no_index,
    robotsNoFollow: raw.robots_no_follow,
    primaryCategory: raw.primary_category,
    additionalCategories: raw.additional_categories ?? [],
    tags: raw.tags,
    author: raw.author,
    artifacts: raw.artifacts,
    toc: raw.toc,
    revisionCount: raw.revision_count,
  };
}

function mapAdminArticleListItem(
  raw: AdminArticleListItemRaw
): AdminArticleListItemType {
  return {
    id: raw.id,
    title: raw.title,
    slug: raw.slug,
    status: raw.status,
    excerpt: raw.excerpt,
    primaryCategory: raw.primary_category,
    additionalCategories: raw.additional_categories ?? [],
    tags: raw.tags,
    author: raw.author,
    imageUrl: raw.image_url,
    readingTime: raw.reading_time,
    views: raw.views,
    publishedAt: raw.published_at,
    createdAt: raw.created_at,
    updatedAt: raw.updated_at,
  };
}

function mapAdminTagItem(raw: AdminTagRaw): AdminTagType {
  return {
    id: raw.id,
    name: raw.name,
    slug: raw.slug,
    color: raw.color,
    group: raw.group,
    articleCount: raw.article_count,
    createdAt: raw.created_at,
  };
}

function mapAdminCategoryFullItem(
  raw: AdminCategoryFullRaw
): AdminCategoryFull {
  return {
    id: raw.id,
    name: raw.name,
    slug: raw.slug,
    subtitle: raw.subtitle,
    description: raw.description,
    icon: raw.icon,
    color: raw.color,
    parentId: raw.parent_id,
    order: raw.order,
    articleCount: raw.article_count,
    isDefault: raw.is_default,
  };
}

function mapSystemSettingsItem(raw: SystemSettingsRaw): SystemSettings {
  return { timezone: raw.timezone, updatedAt: raw.updated_at };
}

function mapRevisionItem(raw: RevisionListItemRaw): RevisionListItemType {
  return {
    id: raw.id,
    summary: raw.summary,
    contentFormat: raw.content_format,
    authorId: raw.author_id,
    createdAt: raw.created_at,
  };
}

function mapRevisionFull(raw: RevisionResponseRaw): RevisionResponseType {
  return { ...mapRevisionItem(raw), content: raw.content };
}

// ---------------------------------------------------------------------------
// Admin Articles API
// ---------------------------------------------------------------------------

export async function getAdminArticles(
  params?: AdminArticlesParams
): Promise<PaginatedResult<AdminArticleListItemType>> {
  const q = new URLSearchParams();
  if (params?.page) q.set('page', String(params.page));
  if (params?.limit) q.set('limit', String(params.limit));
  if (params?.status) q.set('status', params.status);
  if (params?.category) q.set('category', params.category);
  if (params?.search) q.set('search', params.search);
  if (params?.sortBy) q.set('sort_by', params.sortBy);
  if (params?.order) q.set('order', params.order);
  if (params?.authorId) q.set('author_id', params.authorId);
  if (params?.type) q.set('type', params.type);
  const qs = q.toString();
  const result = await apiFetchWithMeta<AdminArticleListItemRaw[]>(
    `/admin/articles${qs ? `?${qs}` : ''}`
  );
  return {
    data: (result.data ?? []).map(mapAdminArticleListItem),
    meta: result.meta,
  };
}

export interface ArticleStats {
  total: number;
  published: number;
  draft: number;
  views: number;
}

export async function getAdminArticleStats(): Promise<ArticleStats> {
  const data = await apiFetch<ArticleStats>('/admin/articles/stats');
  return data ?? { total: 0, published: 0, draft: 0, views: 0 };
}

export async function getAdminArticle(
  articleId: string
): Promise<AdminArticleResponseType | null> {
  const raw = await apiFetch<AdminArticleRaw>(
    `/admin/articles/${encodeURIComponent(articleId)}`
  );
  return raw ? mapAdminArticleFull(raw) : null;
}

export async function createArticle(
  data: ArticleCreatePayload
): Promise<AdminArticleResponseType> {
  const raw = await apiMutate<AdminArticleRaw>('/admin/articles', {
    method: 'POST',
    body: data,
  });
  if (!raw) throw new ApiError(500, 'Пустой ответ API');
  return mapAdminArticleFull(raw);
}

export async function updateArticle(
  articleId: string,
  data: ArticleUpdatePayload
): Promise<AdminArticleResponseType> {
  const raw = await apiMutate<AdminArticleRaw>(
    `/admin/articles/${encodeURIComponent(articleId)}`,
    { method: 'PATCH', body: data }
  );
  if (!raw) throw new ApiError(500, 'Пустой ответ API');
  return mapAdminArticleFull(raw);
}

export async function deleteArticle(
  articleId: string,
  permanent = false
): Promise<void> {
  await apiMutate(
    `/admin/articles/${encodeURIComponent(articleId)}${permanent ? '?permanent=true' : ''}`,
    { method: 'DELETE' }
  );
}

export async function publishArticle(
  articleId: string
): Promise<AdminArticleResponseType> {
  const raw = await apiMutate<AdminArticleRaw>(
    `/admin/articles/${encodeURIComponent(articleId)}/publish`,
    { method: 'POST' }
  );
  if (!raw) throw new ApiError(500, 'Пустой ответ API');
  return mapAdminArticleFull(raw);
}

export async function scheduleArticle(
  articleId: string,
  publishedAt: string
): Promise<AdminArticleResponseType> {
  const raw = await apiMutate<AdminArticleRaw>(
    `/admin/articles/${encodeURIComponent(articleId)}/schedule`,
    { method: 'POST', body: { published_at: publishedAt } }
  );
  if (!raw) throw new ApiError(500, 'Пустой ответ API');
  return mapAdminArticleFull(raw);
}

export async function unpublishArticle(
  articleId: string
): Promise<AdminArticleResponseType> {
  const raw = await apiMutate<AdminArticleRaw>(
    `/admin/articles/${encodeURIComponent(articleId)}/unpublish`,
    { method: 'POST' }
  );
  if (!raw) throw new ApiError(500, 'Пустой ответ API');
  return mapAdminArticleFull(raw);
}

// ---------------------------------------------------------------------------
// Admin Revisions API
// ---------------------------------------------------------------------------

export async function getRevisions(
  articleId: string,
  params?: PaginationParams
): Promise<PaginatedResult<RevisionListItemType>> {
  const q = new URLSearchParams();
  if (params?.page) q.set('page', String(params.page));
  if (params?.limit) q.set('limit', String(params.limit));
  const qs = q.toString();
  const result = await apiFetchWithMeta<RevisionListItemRaw[]>(
    `/admin/articles/${encodeURIComponent(articleId)}/revisions${qs ? `?${qs}` : ''}`
  );
  return { data: (result.data ?? []).map(mapRevisionItem), meta: result.meta };
}

export async function getRevision(
  articleId: string,
  revisionId: string
): Promise<RevisionResponseType | null> {
  const raw = await apiFetch<RevisionResponseRaw>(
    `/admin/articles/${encodeURIComponent(articleId)}/revisions/${encodeURIComponent(revisionId)}`
  );
  return raw ? mapRevisionFull(raw) : null;
}

export async function restoreRevision(
  articleId: string,
  revisionId: string
): Promise<AdminArticleResponseType> {
  const raw = await apiMutate<AdminArticleRaw>(
    `/admin/articles/${encodeURIComponent(articleId)}/revisions/${encodeURIComponent(revisionId)}/restore`,
    { method: 'POST' }
  );
  if (!raw) throw new ApiError(500, 'Пустой ответ API');
  return mapAdminArticleFull(raw);
}

// ---------------------------------------------------------------------------
// Admin Tags API
// ---------------------------------------------------------------------------

export async function getAdminTags(): Promise<AdminTagType[]> {
  const data = await apiFetch<AdminTagRaw[]>('/admin/tags');
  return (data ?? []).map(mapAdminTagItem);
}

export interface TagCreatePayload {
  name: string;
  slug?: string;
  color?: string | null;
  group?: string | null;
}

export async function createTag(data: TagCreatePayload): Promise<AdminTagType> {
  const raw = await apiMutate<AdminTagRaw>('/admin/tags', {
    method: 'POST',
    body: data,
  });
  if (!raw) throw new ApiError(500, 'Пустой ответ API');
  return mapAdminTagItem(raw);
}

export async function updateTag(
  id: string,
  data: Partial<TagCreatePayload>
): Promise<AdminTagType> {
  const raw = await apiMutate<AdminTagRaw>(`/admin/tags/${id}`, {
    method: 'PUT',
    body: data,
  });
  if (!raw) throw new ApiError(500, 'Пустой ответ API');
  return mapAdminTagItem(raw);
}

export async function deleteTag(id: string): Promise<void> {
  await apiMutate(`/admin/tags/${id}`, { method: 'DELETE' });
}

// ---------------------------------------------------------------------------
// Admin Categories API
// ---------------------------------------------------------------------------

export async function getAdminCategories(): Promise<AdminCategoryFull[]> {
  const data = await apiFetch<AdminCategoryFullRaw[]>('/admin/categories');
  return (data ?? []).map(mapAdminCategoryFullItem);
}

export interface CategoryCreatePayload {
  name: string;
  slug?: string;
  subtitle?: string | null;
  description?: string | null;
  icon?: string | null;
  color?: string | null;
  parent_id?: string | null;
  order?: number;
}

export async function createCategory(
  data: CategoryCreatePayload
): Promise<AdminCategoryFull> {
  const raw = await apiMutate<AdminCategoryFullRaw>('/admin/categories', {
    method: 'POST',
    body: data,
  });
  if (!raw) throw new ApiError(500, 'Пустой ответ API');
  return mapAdminCategoryFullItem(raw);
}

export async function updateCategory(
  id: string,
  data: Partial<CategoryCreatePayload>
): Promise<AdminCategoryFull> {
  const raw = await apiMutate<AdminCategoryFullRaw>(`/admin/categories/${id}`, {
    method: 'PUT',
    body: data,
  });
  if (!raw) throw new ApiError(500, 'Пустой ответ API');
  return mapAdminCategoryFullItem(raw);
}

export async function deleteCategory(id: string): Promise<void> {
  await apiMutate(`/admin/categories/${id}`, { method: 'DELETE' });
}

export async function reorderCategories(
  items: { id: string; parent_id: string | null; order: number }[]
): Promise<void> {
  await apiMutate('/admin/categories/order', {
    method: 'PUT',
    body: { items },
  });
}

// ---------------------------------------------------------------------------
// System Settings API
// ---------------------------------------------------------------------------

export async function getSystemSettings(): Promise<SystemSettings> {
  const raw = await apiFetch<SystemSettingsRaw>('/admin/settings');
  if (!raw) throw new ApiError(500, 'Пустой ответ API');
  return mapSystemSettingsItem(raw);
}

export async function updateSystemSettings(data: {
  timezone?: string;
}): Promise<SystemSettings> {
  const raw = await apiMutate<SystemSettingsRaw>('/admin/settings', {
    method: 'PATCH',
    body: data,
  });
  if (!raw) throw new ApiError(500, 'Пустой ответ API');
  return mapSystemSettingsItem(raw);
}

export async function getOAuthLinkUrl(provider: string): Promise<string> {
  const origin = window.location.origin + '/admin';
  const res = await fetch(
    `${API_BASE}/auth/${provider}/url?origin=${encodeURIComponent(origin)}&mode=link`,
    { credentials: 'include' }
  );
  if (!res.ok) throw new ApiError(res.status, 'Ошибка получения OAuth URL');
  const json = await res.json();
  return json.url;
}

export async function unlinkOAuth(provider: string): Promise<UserProfile> {
  const res = await fetch(`${API_BASE}/users/me/oauth/${provider}`, {
    method: 'DELETE',
    credentials: 'include',
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new ApiError(res.status, err.detail ?? 'Ошибка отвязки провайдера');
  }
  const json: ApiResponseRaw<ProfileRaw> = await res.json();
  if (!json.data) throw new ApiError(500, 'Нет данных');
  return mapProfile(json.data);
}

// ---------------------------------------------------------------------------
// Admin Media API (PW-041-B)
// ---------------------------------------------------------------------------

import type {
  MediaFile,
  MediaListParams,
  MediaUpdatePayload,
  MediaStatsResponse,
} from '@/app/components/sections/media/media.types';

interface MediaFileRaw {
  id: string;
  filename: string;
  storage_key: string;
  mime_type: string;
  file_type: string;
  size: number;
  width?: number | null;
  height?: number | null;
  duration?: number | null;
  slug: string;
  alt?: string | null;
  caption?: string | null;
  exif_data?: Record<string, string> | null;
  purposes: string[];
  resizes?: Array<{
    suffix: string;
    key: string;
    width: number;
    height: number;
    size: number;
    url: string;
  }> | null;
  url: string;
  thumbnail_url?: string | null;
  uploaded_by_id?: string | null;
  used_in: number;
  created_at: string;
  updated_at: string;
}

interface MediaStatsRaw {
  total_count: number;
  total_size: number;
  by_type: Record<string, number>;
  all_purposes: string[];
}

const RESIZE_SUFFIX_NAMES: Record<string, string> = {
  _thumb: 'Thumbnail',
  _sm: 'Small',
  _md: 'Medium',
  _lg: 'Large',
};

function mapMediaFile(raw: MediaFileRaw): MediaFile {
  // EXIF: snake_case → camelCase
  let exif: MediaFile['exif'] = undefined;
  if (raw.exif_data && Object.keys(raw.exif_data).length > 0) {
    exif = {
      dateTaken: raw.exif_data.date_taken,
      camera: raw.exif_data.camera,
      lens: raw.exif_data.lens,
      iso: raw.exif_data.iso,
      aperture: raw.exif_data.aperture,
      shutterSpeed: raw.exif_data.shutter_speed,
      focalLength: raw.exif_data.focal_length,
    };
  }

  // Ресайзы: suffix → human-readable name
  let resizes: MediaFile['resizes'] = undefined;
  if (raw.resizes && raw.resizes.length > 0) {
    resizes = raw.resizes.map(r => ({
      name: RESIZE_SUFFIX_NAMES[r.suffix] ?? r.suffix,
      width: r.width,
      height: r.height,
      size: r.size,
      url: r.url,
    }));
  }

  return {
    id: raw.id,
    name: raw.filename,
    type: raw.file_type as MediaFile['type'],
    url: raw.url,
    size: raw.size,
    uploadedAt: new Date(raw.created_at),
    usedIn: raw.used_in,
    purposes: raw.purposes ?? [],
    thumbnail: raw.thumbnail_url ?? undefined,
    duration: raw.duration ?? undefined,
    dimensions:
      raw.width != null && raw.height != null
        ? { width: raw.width, height: raw.height }
        : undefined,
    seo: {
      filename: raw.slug,
      alt: raw.alt ?? '',
      caption: raw.caption ?? '',
    },
    exif,
    resizes,
    storageKey: raw.storage_key,
    mimeType: raw.mime_type,
    slug: raw.slug,
    uploadedById: raw.uploaded_by_id ?? undefined,
    updatedAt: new Date(raw.updated_at),
  };
}

function mapMediaStats(raw: MediaStatsRaw): MediaStatsResponse {
  return {
    totalCount: raw.total_count,
    totalSize: raw.total_size,
    byType: raw.by_type,
    allPurposes: raw.all_purposes,
  };
}

export async function getMediaList(
  params?: MediaListParams
): Promise<PaginatedResult<MediaFile>> {
  const q = new URLSearchParams();
  if (params?.page) q.set('page', String(params.page));
  if (params?.limit) q.set('limit', String(params.limit));
  if (params?.file_type) q.set('file_type', params.file_type);
  if (params?.purpose) q.set('purpose', params.purpose);
  if (params?.search) q.set('search', params.search);
  if (params?.sort_by) q.set('sort_by', params.sort_by);
  if (params?.order) q.set('order', params.order);

  const qs = q.toString();
  const result = await apiFetchWithMeta<MediaFileRaw[]>(
    `/admin/media${qs ? `?${qs}` : ''}`
  );
  return {
    data: (result.data ?? []).map(mapMediaFile),
    meta: result.meta,
  };
}

export async function getMedia(id: string): Promise<MediaFile | null> {
  const raw = await apiFetch<MediaFileRaw>(
    `/admin/media/${encodeURIComponent(id)}`
  );
  return raw ? mapMediaFile(raw) : null;
}

export async function uploadMedia(file: File): Promise<MediaFile> {
  const formData = new FormData();
  formData.append('file', file);

  const doUpload = () =>
    fetch(`${API_BASE}/admin/media/upload`, {
      method: 'POST',
      credentials: 'include',
      body: formData,
    });

  let res = await doUpload();

  // 401 — пробуем refresh один раз (паттерн apiMutate)
  if (res.status === 401) {
    const refreshed = await authRefresh();
    if (refreshed) {
      res = await doUpload();
    }
    if (res.status === 401) throw new ApiError(401, 'Не авторизован');
  }

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new ApiError(res.status, err.detail ?? 'Ошибка загрузки файла');
  }
  const json: ApiResponseRaw<MediaFileRaw> = await res.json();
  if (!json.data) throw new ApiError(500, 'Нет данных');
  return mapMediaFile(json.data);
}

export async function replaceMediaFile(
  mediaId: string,
  file: File
): Promise<MediaFile> {
  const formData = new FormData();
  formData.append('file', file);

  const doReplace = () =>
    fetch(`${API_BASE}/admin/media/${encodeURIComponent(mediaId)}/file`, {
      method: 'PUT',
      credentials: 'include',
      body: formData,
    });

  let res = await doReplace();

  // 401 — пробуем refresh один раз (паттерн uploadMedia)
  if (res.status === 401) {
    const refreshed = await authRefresh();
    if (refreshed) {
      res = await doReplace();
    }
    if (res.status === 401) throw new ApiError(401, 'Не авторизован');
  }

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new ApiError(res.status, err.detail ?? 'Ошибка замены файла');
  }
  const json: ApiResponseRaw<MediaFileRaw> = await res.json();
  if (!json.data) throw new ApiError(500, 'Нет данных');
  return mapMediaFile(json.data);
}

export async function updateMedia(
  id: string,
  data: MediaUpdatePayload
): Promise<MediaFile> {
  const raw = await apiMutate<MediaFileRaw>(
    `/admin/media/${encodeURIComponent(id)}`,
    { method: 'PATCH', body: data }
  );
  if (!raw) throw new ApiError(500, 'Пустой ответ API');
  return mapMediaFile(raw);
}

export async function deleteMedia(id: string): Promise<void> {
  await apiMutate(`/admin/media/${encodeURIComponent(id)}`, {
    method: 'DELETE',
  });
}

export async function getMediaStats(): Promise<MediaStatsResponse> {
  const raw = await apiFetch<MediaStatsRaw>('/admin/media/stats');
  if (!raw) throw new ApiError(500, 'Пустой ответ API');
  return mapMediaStats(raw);
}

// ---------------------------------------------------------------------------
// Admin Storage (PW-041-D2)
// ---------------------------------------------------------------------------

import type {
  StorageInfo,
  StorageTestResult,
} from '@/app/components/sections/settings/storage/storage.types';

interface StorageConfigRaw {
  max_upload_image_mb: number;
  max_upload_other_mb: number;
  upload_dir: string | null;
  bucket: string | null;
  region: string | null;
  endpoint: string | null;
  public_endpoint: string | null;
}

interface StorageHealthRaw {
  connected: boolean;
  latency_ms: number | null;
  error: string | null;
}

interface StorageStatsRaw {
  media_files: number;
  media_size: number;
  avatars_count: number;
  by_type: Record<string, number>;
}

interface StorageSyncRaw {
  local_only: number;
  s3_only: number;
  synced: number;
  last_sync_at: string | null;
}

interface StorageInfoRaw {
  backend: string;
  config: StorageConfigRaw;
  health: StorageHealthRaw;
  stats: StorageStatsRaw;
  sync: StorageSyncRaw;
}

interface StorageTestStepRaw {
  name: 'write' | 'read' | 'delete';
  success: boolean;
  latency_ms: number;
  error: string | null;
}

interface StorageTestResultRaw {
  success: boolean;
  steps: StorageTestStepRaw[];
  total_ms: number;
}

function mapStorageInfo(raw: StorageInfoRaw): StorageInfo {
  return {
    backend: raw.backend as StorageInfo['backend'],
    config: {
      maxUploadImageMb: raw.config.max_upload_image_mb,
      maxUploadOtherMb: raw.config.max_upload_other_mb,
      uploadDir: raw.config.upload_dir,
      bucket: raw.config.bucket,
      region: raw.config.region,
      endpoint: raw.config.endpoint,
      publicEndpoint: raw.config.public_endpoint,
    },
    health: {
      connected: raw.health.connected,
      latencyMs: raw.health.latency_ms,
      error: raw.health.error,
    },
    stats: {
      mediaFiles: raw.stats.media_files,
      mediaSize: raw.stats.media_size,
      avatarsCount: raw.stats.avatars_count,
      byType: raw.stats.by_type,
    },
    sync: {
      localOnly: raw.sync.local_only,
      s3Only: raw.sync.s3_only,
      synced: raw.sync.synced,
      lastSyncAt: raw.sync.last_sync_at,
    },
  };
}

function mapStorageTestResult(raw: StorageTestResultRaw): StorageTestResult {
  return {
    success: raw.success,
    steps: raw.steps.map(s => ({
      name: s.name,
      success: s.success,
      latencyMs: s.latency_ms,
      error: s.error,
    })),
    totalMs: raw.total_ms,
  };
}

export async function adminGetStorageInfo(): Promise<StorageInfo> {
  const raw = await apiFetch<StorageInfoRaw>('/admin/storage/info');
  if (!raw) throw new ApiError(500, 'Пустой ответ API');
  return mapStorageInfo(raw);
}

export async function adminTestStorage(): Promise<StorageTestResult> {
  const raw = await apiMutate<StorageTestResultRaw>('/admin/storage/test', {
    method: 'POST',
  });
  if (!raw) throw new ApiError(500, 'Пустой ответ API');
  return mapStorageTestResult(raw);
}

// ---------------------------------------------------------------------------
// System Health (PW-042-C)
// ---------------------------------------------------------------------------

interface SystemHealthRaw {
  status: string;
  uptime_seconds: number;
  version: string;
  python_version: string;
  cpu_percent: number;
  disk: { total_gb: number; used_gb: number; percent: number };
  memory: { total_gb: number; used_gb: number; percent: number };
  services: {
    name: string;
    connected: boolean;
    latency_ms: number | null;
    error: string | null;
  }[];
  errors_24h: number;
}

export interface SystemHealth {
  status: 'ok' | 'degraded' | 'down';
  uptimeSeconds: number;
  version: string;
  pythonVersion: string;
  cpuPercent: number;
  disk: { totalGb: number; usedGb: number; percent: number };
  memory: { totalGb: number; usedGb: number; percent: number };
  services: {
    name: string;
    connected: boolean;
    latencyMs: number | null;
    error: string | null;
  }[];
  errors24h: number;
}

function mapSystemHealth(raw: SystemHealthRaw): SystemHealth {
  return {
    status: raw.status as SystemHealth['status'],
    uptimeSeconds: raw.uptime_seconds,
    version: raw.version,
    pythonVersion: raw.python_version,
    cpuPercent: raw.cpu_percent,
    disk: {
      totalGb: raw.disk.total_gb,
      usedGb: raw.disk.used_gb,
      percent: raw.disk.percent,
    },
    memory: {
      totalGb: raw.memory.total_gb,
      usedGb: raw.memory.used_gb,
      percent: raw.memory.percent,
    },
    services: raw.services.map(s => ({
      name: s.name,
      connected: s.connected,
      latencyMs: s.latency_ms,
      error: s.error,
    })),
    errors24h: raw.errors_24h,
  };
}

export async function adminGetSystemHealth(): Promise<SystemHealth> {
  const raw = await apiFetch<SystemHealthRaw>('/admin/system/health');
  if (!raw) throw new ApiError(500, 'Пустой ответ API');
  return mapSystemHealth(raw);
}

// ---------------------------------------------------------------------------
// Error Tracking (PW-042-B)
// ---------------------------------------------------------------------------

import type {
  AuditLogEntry,
  ErrorLogEntry,
  ErrorStats,
} from '@/app/components/sections/settings/monitoring/monitoring.types';

interface RawErrorLogEntry {
  id: string;
  timestamp: string;
  level: string;
  event: string;
  message: string;
  traceback: string | null;
  request_method: string | null;
  request_path: string | null;
  request_id: string | null;
  user_id: string | null;
  user_name: string | null;
  user_email: string | null;
  ip_address: string | null;
  user_agent: string | null;
  status_code: number | null;
  context: Record<string, unknown> | null;
  resolved: boolean;
}

interface RawErrorStats {
  last_24h: number;
  last_7d: number;
  last_30d: number;
}

function mapErrorLogEntry(raw: RawErrorLogEntry): ErrorLogEntry {
  return {
    id: raw.id,
    timestamp: raw.timestamp,
    level: raw.level as ErrorLogEntry['level'],
    event: raw.event,
    message: raw.message,
    traceback: raw.traceback,
    requestMethod: raw.request_method,
    requestPath: raw.request_path,
    requestId: raw.request_id,
    userId: raw.user_id,
    userName: raw.user_name,
    userEmail: raw.user_email,
    ipAddress: raw.ip_address,
    userAgent: raw.user_agent,
    statusCode: raw.status_code,
    context: raw.context,
    resolved: raw.resolved,
  };
}

function mapErrorStats(raw: RawErrorStats): ErrorStats {
  return {
    last24h: raw.last_24h,
    last7d: raw.last_7d,
    last30d: raw.last_30d,
  };
}

export async function adminGetErrors(params?: {
  limit?: number;
  offset?: number;
  level?: string;
  resolved?: boolean;
  dateRange?: string;
}): Promise<{ data: ErrorLogEntry[]; meta: ApiMeta }> {
  const q = new URLSearchParams();
  if (params?.limit != null) q.set('limit', String(params.limit));
  if (params?.offset != null) q.set('offset', String(params.offset));
  if (params?.level) q.set('level', params.level);
  if (params?.resolved != null) q.set('resolved', String(params.resolved));
  if (params?.dateRange) q.set('dateRange', params.dateRange);

  const qs = q.toString();
  const result = await apiFetchWithMeta<RawErrorLogEntry[]>(
    `/admin/errors${qs ? `?${qs}` : ''}`
  );
  return {
    data: (result.data ?? []).map(mapErrorLogEntry),
    meta: result.meta,
  };
}

export async function adminGetErrorStats(): Promise<ErrorStats> {
  const raw = await apiFetch<RawErrorStats>('/admin/errors/stats');
  if (!raw) throw new ApiError(500, 'Пустой ответ API');
  return mapErrorStats(raw);
}

export async function adminResolveError(id: string): Promise<void> {
  await apiMutate(`/admin/errors/${id}/resolve`, { method: 'POST' });
}

// ---------------------------------------------------------------------------
// Audit Log (PW-042-D)
// ---------------------------------------------------------------------------

interface RawAuditLogEntry {
  id: string;
  timestamp: string;
  user_id: string | null;
  user_name: string | null;
  user_email: string | null;
  action: string;
  resource_type: string;
  resource_id: string | null;
  changes: Record<string, { old: unknown; new: unknown }> | null;
  request_id: string | null;
  ip_address: string | null;
  user_agent: string | null;
}

function mapAuditLogEntry(raw: RawAuditLogEntry): AuditLogEntry {
  return {
    id: raw.id,
    timestamp: raw.timestamp,
    userId: raw.user_id,
    userName: raw.user_name,
    userEmail: raw.user_email,
    action: raw.action,
    resourceType: raw.resource_type,
    resourceId: raw.resource_id,
    changes: raw.changes,
    requestId: raw.request_id,
    ipAddress: raw.ip_address,
    userAgent: raw.user_agent,
  };
}

export async function adminGetAudit(params?: {
  limit?: number;
  offset?: number;
  action?: string;
  userId?: string;
  dateRange?: string;
}): Promise<{ data: AuditLogEntry[]; meta: ApiMeta }> {
  const q = new URLSearchParams();
  if (params?.limit != null) q.set('limit', String(params.limit));
  if (params?.offset != null) q.set('offset', String(params.offset));
  if (params?.action) q.set('action', params.action);
  if (params?.userId) q.set('userId', params.userId);
  if (params?.dateRange) q.set('dateRange', params.dateRange);

  const qs = q.toString();
  const result = await apiFetchWithMeta<RawAuditLogEntry[]>(
    `/admin/audit${qs ? `?${qs}` : ''}`
  );
  return {
    data: (result.data ?? []).map(mapAuditLogEntry),
    meta: result.meta,
  };
}

export async function adminGetAuditActions(): Promise<string[]> {
  const data = await apiFetch<string[]>('/admin/audit/actions');
  return data ?? [];
}

export async function adminGetAuditUsers(): Promise<[string, string][]> {
  const data = await apiFetch<[string, string][]>('/admin/audit/users');
  return data ?? [];
}

// ---------------------------------------------------------------------------
// Admin Users API (PW-045)
// ---------------------------------------------------------------------------

interface UserAdminBriefRaw {
  id: string;
  name: string;
  email: string;
  avatar: string | null;
  role: string;
  is_active: boolean;
  created_at: string;
  last_login_at: string | null;
  articles_count: number;
}

interface UserAdminDetailRaw extends UserAdminBriefRaw {
  bio: string | null;
  social_links: Record<string, string> | null;
  oauth_providers: string[];
  has_password: boolean;
  updated_at: string;
}

interface UserListStatsRaw {
  total: number;
  active: number;
  inactive: number;
  by_role: Record<string, number>;
  total_articles: number;
}

export interface AdminUserBrief {
  id: string;
  name: string;
  email: string;
  avatar: string | null;
  role: 'admin' | 'editor' | 'author' | 'viewer';
  isActive: boolean;
  createdAt: string;
  lastLoginAt: string | null;
  articlesCount: number;
}

export interface AdminUserDetail extends AdminUserBrief {
  bio: string | null;
  socialLinks: Record<string, string> | null;
  oauthProviders: string[];
  hasPassword: boolean;
  updatedAt: string;
}

export interface AdminUserListStats {
  total: number;
  active: number;
  inactive: number;
  byRole: Record<string, number>;
  totalArticles: number;
}

export interface AdminUsersParams {
  page?: number;
  limit?: number;
  search?: string;
  role?: string;
  isActive?: boolean;
  sort?: string;
  order?: string;
}

function mapAdminUserBrief(raw: UserAdminBriefRaw): AdminUserBrief {
  return {
    id: raw.id,
    name: raw.name,
    email: raw.email,
    avatar: raw.avatar,
    role: raw.role as AdminUserBrief['role'],
    isActive: raw.is_active,
    createdAt: raw.created_at,
    lastLoginAt: raw.last_login_at,
    articlesCount: raw.articles_count,
  };
}

export async function adminGetUsers(
  params?: AdminUsersParams
): Promise<PaginatedResult<AdminUserBrief>> {
  const q = new URLSearchParams();
  if (params?.page) q.set('page', String(params.page));
  if (params?.limit) q.set('limit', String(params.limit));
  if (params?.search) q.set('search', params.search);
  if (params?.role) q.set('role', params.role);
  if (params?.isActive !== undefined)
    q.set('is_active', String(params.isActive));
  if (params?.sort) q.set('sort', params.sort);
  if (params?.order) q.set('order', params.order);
  const qs = q.toString();
  const result = await apiFetchWithMeta<UserAdminBriefRaw[]>(
    `/admin/users${qs ? `?${qs}` : ''}`
  );
  return {
    data: (result.data ?? []).map(mapAdminUserBrief),
    meta: result.meta,
  };
}

export async function adminGetUserStats(): Promise<AdminUserListStats> {
  const raw = await apiFetch<UserListStatsRaw>('/admin/users/stats');
  if (!raw) throw new ApiError(500, 'Пустой ответ API');
  return {
    total: raw.total,
    active: raw.active,
    inactive: raw.inactive,
    byRole: raw.by_role,
    totalArticles: raw.total_articles,
  };
}

export async function adminUpdateUser(
  userId: string,
  data: {
    name?: string;
    email?: string;
    role?: string;
    is_active?: boolean;
    bio?: string | null;
    social_links?: Record<string, string> | null;
  }
): Promise<AdminUserBrief> {
  const raw = await apiMutate<UserAdminBriefRaw>(
    `/admin/users/${encodeURIComponent(userId)}`,
    { method: 'PATCH', body: data }
  );
  if (!raw) throw new ApiError(500, 'Пустой ответ API');
  return mapAdminUserBrief(raw);
}

export async function adminDeleteUser(userId: string): Promise<void> {
  await apiMutate(`/admin/users/${encodeURIComponent(userId)}`, {
    method: 'DELETE',
  });
}

function mapAdminUserDetail(raw: UserAdminDetailRaw): AdminUserDetail {
  return {
    ...mapAdminUserBrief(raw),
    bio: raw.bio,
    socialLinks: raw.social_links,
    oauthProviders: raw.oauth_providers,
    hasPassword: raw.has_password,
    updatedAt: raw.updated_at,
  };
}

export async function adminGetUserDetail(
  userId: string
): Promise<AdminUserDetail> {
  const raw = await apiFetch<UserAdminDetailRaw>(
    `/admin/users/${encodeURIComponent(userId)}`
  );
  if (!raw) throw new ApiError(500, 'Пустой ответ API');
  return mapAdminUserDetail(raw);
}

export async function adminUploadUserAvatar(
  userId: string,
  file: File
): Promise<AdminUserDetail> {
  const formData = new FormData();
  formData.append('file', file);
  const res = await fetch(
    `${API_BASE}/admin/users/${encodeURIComponent(userId)}/avatar`,
    {
      method: 'POST',
      credentials: 'include',
      body: formData,
    }
  );
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new ApiError(res.status, err.detail ?? 'Ошибка загрузки аватара');
  }
  const json: ApiResponseRaw<UserAdminDetailRaw> = await res.json();
  if (!json.data) throw new ApiError(500, 'Пустой ответ API');
  return mapAdminUserDetail(json.data);
}

export async function adminDeleteUserAvatar(
  userId: string
): Promise<AdminUserDetail> {
  const raw = await apiMutate<UserAdminDetailRaw>(
    `/admin/users/${encodeURIComponent(userId)}/avatar`,
    { method: 'DELETE' }
  );
  if (!raw) throw new ApiError(500, 'Пустой ответ API');
  return mapAdminUserDetail(raw);
}

export async function adminSetUserPassword(
  userId: string,
  newPassword: string
): Promise<AdminUserDetail> {
  const raw = await apiMutate<UserAdminDetailRaw>(
    `/admin/users/${encodeURIComponent(userId)}/password`,
    { method: 'POST', body: { new_password: newPassword } }
  );
  if (!raw) throw new ApiError(500, 'Пустой ответ API');
  return mapAdminUserDetail(raw);
}

// ---------------------------------------------------------------------------
// PW-047: Admin SEO Settings API
// ---------------------------------------------------------------------------

/** Raw-тип ответа API (snake_case JSONB) */
interface SeoSettingsRaw {
  sitemap_config: {
    enabled: boolean;
    include_articles: boolean;
    include_categories: boolean;
    include_tags: boolean;
    include_static_pages: boolean;
    priorities: Record<string, number>;
    changefreq: Record<string, string>;
  };
  robots_txt: string;
  rss_config: {
    enabled: boolean;
    format: 'rss2' | 'atom';
    item_count: number;
    content_mode: 'full' | 'excerpt';
    include_articles: boolean;
    include_category_updates: boolean;
  };
  default_meta_directives: Record<
    string,
    { index: boolean; follow: boolean; noarchive: boolean }
  >;
  metrika_config: {
    counter_id: string;
    clickmap: boolean;
    track_links: boolean;
    accurate_track_bounce: boolean;
    webvisor: boolean;
    track_hash: boolean;
  };
}

/** Публичные типы SEO-настроек (camelCase) */
export interface SeoSettings {
  sitemapConfig: {
    enabled: boolean;
    includeArticles: boolean;
    includeCategories: boolean;
    includeTags: boolean;
    includeStaticPages: boolean;
    priorities: Record<string, number>;
    changefreq: Record<string, string>;
  };
  robotsTxt: string;
  rssConfig: {
    enabled: boolean;
    format: 'rss2' | 'atom';
    itemCount: number;
    contentMode: 'full' | 'excerpt';
    includeArticles: boolean;
    includeCategoryUpdates: boolean;
  };
  defaultMetaDirectives: Record<
    string,
    { index: boolean; follow: boolean; noarchive: boolean }
  >;
  metrikaConfig: {
    counterId: string;
    clickmap: boolean;
    trackLinks: boolean;
    accurateTrackBounce: boolean;
    webvisor: boolean;
    trackHash: boolean;
  };
}

function mapSeoSettings(raw: SeoSettingsRaw): SeoSettings {
  return {
    sitemapConfig: {
      enabled: raw.sitemap_config.enabled,
      includeArticles: raw.sitemap_config.include_articles,
      includeCategories: raw.sitemap_config.include_categories,
      includeTags: raw.sitemap_config.include_tags,
      includeStaticPages: raw.sitemap_config.include_static_pages,
      priorities: raw.sitemap_config.priorities,
      changefreq: raw.sitemap_config.changefreq,
    },
    robotsTxt: raw.robots_txt,
    rssConfig: {
      enabled: raw.rss_config.enabled,
      format: raw.rss_config.format,
      itemCount: raw.rss_config.item_count,
      contentMode: raw.rss_config.content_mode,
      includeArticles: raw.rss_config.include_articles,
      includeCategoryUpdates: raw.rss_config.include_category_updates,
    },
    defaultMetaDirectives: raw.default_meta_directives,
    metrikaConfig: {
      counterId: raw.metrika_config.counter_id,
      clickmap: raw.metrika_config.clickmap,
      trackLinks: raw.metrika_config.track_links,
      accurateTrackBounce: raw.metrika_config.accurate_track_bounce,
      webvisor: raw.metrika_config.webvisor,
      trackHash: raw.metrika_config.track_hash,
    },
  };
}

function unmapSeoSettings(data: Partial<SeoSettings>): Record<string, unknown> {
  const body: Record<string, unknown> = {};
  if (data.sitemapConfig) {
    body.sitemap_config = {
      enabled: data.sitemapConfig.enabled,
      include_articles: data.sitemapConfig.includeArticles,
      include_categories: data.sitemapConfig.includeCategories,
      include_tags: data.sitemapConfig.includeTags,
      include_static_pages: data.sitemapConfig.includeStaticPages,
      priorities: data.sitemapConfig.priorities,
      changefreq: data.sitemapConfig.changefreq,
    };
  }
  if (data.robotsTxt !== undefined) {
    body.robots_txt = data.robotsTxt;
  }
  if (data.rssConfig) {
    body.rss_config = {
      enabled: data.rssConfig.enabled,
      format: data.rssConfig.format,
      item_count: data.rssConfig.itemCount,
      content_mode: data.rssConfig.contentMode,
      include_articles: data.rssConfig.includeArticles,
      include_category_updates: data.rssConfig.includeCategoryUpdates,
    };
  }
  if (data.defaultMetaDirectives) {
    body.default_meta_directives = data.defaultMetaDirectives;
  }
  if (data.metrikaConfig) {
    body.metrika_config = {
      counter_id: data.metrikaConfig.counterId,
      clickmap: data.metrikaConfig.clickmap,
      track_links: data.metrikaConfig.trackLinks,
      accurate_track_bounce: data.metrikaConfig.accurateTrackBounce,
      webvisor: data.metrikaConfig.webvisor,
      track_hash: data.metrikaConfig.trackHash,
    };
  }
  return body;
}

export async function getSeoSettings(): Promise<SeoSettings> {
  const raw = await apiFetch<SeoSettingsRaw>('/admin/seo/settings');
  if (!raw) throw new ApiError(500, 'Пустой ответ API');
  return mapSeoSettings(raw);
}

export async function updateSeoSettings(
  data: Partial<SeoSettings>
): Promise<SeoSettings> {
  const body = unmapSeoSettings(data);
  const raw = await apiMutate<SeoSettingsRaw>('/admin/seo/settings', {
    method: 'PATCH',
    body,
  });
  if (!raw) throw new ApiError(500, 'Пустой ответ API');
  return mapSeoSettings(raw);
}

// ---------------------------------------------------------------------------
// PW-048: Yandex OAuth + Stats API
// ---------------------------------------------------------------------------

/** Статус подключения Yandex OAuth */
export interface YandexConnectionStatus {
  connected: boolean;
  account: string | null;
  permissions: string[] | null;
  connectedAt: string | null;
}

interface YandexConnectionStatusRaw {
  connected: boolean;
  account: string | null;
  permissions: string[] | null;
  connected_at: string | null;
}

function mapYandexStatus(
  raw: YandexConnectionStatusRaw
): YandexConnectionStatus {
  return {
    connected: raw.connected,
    account: raw.account,
    permissions: raw.permissions,
    connectedAt: raw.connected_at,
  };
}

export async function getYandexAuthUrl(): Promise<string> {
  const data = await apiFetch<{ url: string }>('/admin/seo/yandex/auth-url');
  if (!data) throw new ApiError(500, 'Пустой ответ API');
  return data.url;
}

export async function connectYandex(
  code: string
): Promise<YandexConnectionStatus> {
  const raw = await apiMutate<YandexConnectionStatusRaw>(
    '/admin/seo/yandex/connect',
    {
      method: 'POST',
      body: { code },
    }
  );
  if (!raw) throw new ApiError(500, 'Пустой ответ API');
  return mapYandexStatus(raw);
}

export async function disconnectYandex(): Promise<YandexConnectionStatus> {
  const raw = await apiMutate<YandexConnectionStatusRaw>(
    '/admin/seo/yandex/disconnect',
    {
      method: 'POST',
      body: {},
    }
  );
  if (!raw) throw new ApiError(500, 'Пустой ответ API');
  return mapYandexStatus(raw);
}

export async function getYandexStatus(): Promise<YandexConnectionStatus> {
  const raw = await apiFetch<YandexConnectionStatusRaw>(
    '/admin/seo/yandex/status'
  );
  if (!raw) throw new ApiError(500, 'Пустой ответ API');
  return mapYandexStatus(raw);
}

/** Статистика Метрики */
export interface MetrikaStatsData {
  period: string;
  visitors: { value: number; change: number };
  pageviews: { value: number; change: number };
  pageDepth: { value: number; change: number };
  avgDuration: { value: number; change: number };
  bounceRate: { value: number; change: number };
  dailyVisits: number[];
}

interface MetrikaStatsRaw {
  period: string;
  visitors: { value: number; change: number };
  pageviews: { value: number; change: number };
  page_depth: { value: number; change: number };
  avg_duration: { value: number; change: number };
  bounce_rate: { value: number; change: number };
  daily_visits: number[];
}

function mapMetrikaStats(raw: MetrikaStatsRaw): MetrikaStatsData {
  return {
    period: raw.period,
    visitors: raw.visitors,
    pageviews: raw.pageviews,
    pageDepth: raw.page_depth,
    avgDuration: raw.avg_duration,
    bounceRate: raw.bounce_rate,
    dailyVisits: raw.daily_visits,
  };
}

export async function getMetrikaStats(
  period = '7d'
): Promise<MetrikaStatsData> {
  const raw = await apiFetch<MetrikaStatsRaw>(
    `/admin/seo/metrika/stats?period=${period}`
  );
  if (!raw) throw new ApiError(500, 'Пустой ответ API');
  return mapMetrikaStats(raw);
}

/** Данные Вебмастера */
export interface WebmasterSummaryData {
  sqi: number;
  searchablePages: number;
  excludedPages: number;
  siteProblems: number;
  sqiHistory: number[];
}

interface WebmasterSummaryRaw {
  sqi: number;
  searchable_pages: number;
  excluded_pages: number;
  site_problems: number;
  sqi_history: number[];
}

export async function getWebmasterSummary(): Promise<WebmasterSummaryData> {
  const raw = await apiFetch<WebmasterSummaryRaw>(
    '/admin/seo/webmaster/summary'
  );
  if (!raw) throw new ApiError(500, 'Пустой ответ API');
  return {
    sqi: raw.sqi,
    searchablePages: raw.searchable_pages,
    excludedPages: raw.excluded_pages,
    siteProblems: raw.site_problems,
    sqiHistory: raw.sqi_history,
  };
}

export interface WebmasterIndexingData {
  indexed: { count: number; percent: number };
  pending: { count: number; percent: number };
  excluded: { count: number; percent: number };
  history: number[];
  lastUpdated: string;
}

interface WebmasterIndexingRaw {
  indexed: { count: number; percent: number };
  pending: { count: number; percent: number };
  excluded: { count: number; percent: number };
  history: number[];
  last_updated: string;
}

export async function getWebmasterIndexing(): Promise<WebmasterIndexingData> {
  const raw = await apiFetch<WebmasterIndexingRaw>(
    '/admin/seo/webmaster/indexing'
  );
  if (!raw) throw new ApiError(500, 'Пустой ответ API');
  return {
    indexed: raw.indexed,
    pending: raw.pending,
    excluded: raw.excluded,
    history: raw.history,
    lastUpdated: raw.last_updated,
  };
}

export interface WebmasterQueryData {
  query: string;
  position: number;
  impressions: number;
}

export async function getWebmasterQueries(): Promise<WebmasterQueryData[]> {
  const raw = await apiFetch<{ queries: WebmasterQueryData[] }>(
    '/admin/seo/webmaster/queries'
  );
  if (!raw) throw new ApiError(500, 'Пустой ответ API');
  return raw.queries;
}

// ---------------------------------------------------------------------------
// MCP API-ключи (PW-061-C)
// ---------------------------------------------------------------------------

interface McpKeyRaw {
  id: string;
  name: string;
  key_prefix: string;
  scope: string;
  is_active: boolean;
  last_used_at: string | null;
  expires_at: string | null;
  created_at: string | null;
  user_name: string | null;
}

interface McpKeyCreateResponseRaw {
  id: string;
  name: string;
  raw_key: string;
  key_prefix: string;
  scope: string;
  is_active: boolean;
  expires_at: string | null;
  created_at: string | null;
}

interface AuditLogEntryRaw {
  id: string;
  timestamp: string;
  user_name: string | null;
  action: string;
  resource_type: string;
  resource_id: string | null;
  changes: Record<string, unknown> | null;
}

function mapMcpKey(raw: McpKeyRaw): McpApiKey {
  return {
    id: raw.id,
    name: raw.name,
    keyPrefix: raw.key_prefix,
    scope: raw.scope as McpApiKey['scope'],
    isActive: raw.is_active,
    lastUsedAt: raw.last_used_at,
    expiresAt: raw.expires_at,
    createdAt: raw.created_at ?? '',
    userName: raw.user_name ?? undefined,
  };
}

function mapMcpKeyCreateResponse(
  raw: McpKeyCreateResponseRaw
): McpApiKeyCreateResult {
  return {
    id: raw.id,
    name: raw.name,
    rawKey: raw.raw_key,
    keyPrefix: raw.key_prefix,
    scope: raw.scope as McpApiKey['scope'],
    isActive: raw.is_active,
    expiresAt: raw.expires_at,
    createdAt: raw.created_at ?? '',
  };
}

function mapMcpAuditEntry(raw: AuditLogEntryRaw): McpAuditEntry {
  const changes = raw.changes ?? {};
  return {
    id: raw.id,
    timestamp: raw.timestamp,
    keyPrefix: (changes.key_prefix as string) ?? '',
    keyName: (changes.key_name as string) ?? '',
    tool: raw.action.replace('mcp.', ''),
    resourceType: raw.resource_type !== 'mcp' ? raw.resource_type : null,
    resourceId: raw.resource_id ? String(raw.resource_id) : null,
    userName: raw.user_name,
  };
}

export async function getMcpKeys(): Promise<McpApiKey[]> {
  const data = await apiFetch<McpKeyRaw[]>('/admin/mcp-keys');
  return (data ?? []).map(mapMcpKey);
}

export async function createMcpKey(
  payload: McpKeyCreatePayload
): Promise<McpApiKeyCreateResult> {
  const raw = await apiMutate<McpKeyCreateResponseRaw>('/admin/mcp-keys', {
    method: 'POST',
    body: payload,
  });
  if (!raw) throw new ApiError(500, 'Пустой ответ API');
  return mapMcpKeyCreateResponse(raw);
}

export async function toggleMcpKey(keyId: string): Promise<McpApiKey> {
  const raw = await apiMutate<McpKeyRaw>(
    `/admin/mcp-keys/${encodeURIComponent(keyId)}/toggle`,
    { method: 'PATCH' }
  );
  if (!raw) throw new ApiError(500, 'Пустой ответ API');
  return mapMcpKey(raw);
}

export async function deleteMcpKey(keyId: string): Promise<void> {
  await apiMutate(`/admin/mcp-keys/${encodeURIComponent(keyId)}`, {
    method: 'DELETE',
  });
}

export interface McpAuditParams {
  limit?: number;
  offset?: number;
  dateRange?: '24h' | '7d' | '30d';
}

export async function getMcpAuditLog(
  params?: McpAuditParams
): Promise<{ data: McpAuditEntry[]; total: number }> {
  const q = new URLSearchParams();
  q.set('actionPrefix', 'mcp.');
  if (params?.limit) q.set('limit', String(params.limit));
  if (params?.offset) q.set('offset', String(params.offset));
  if (params?.dateRange) q.set('dateRange', params.dateRange);
  const qs = q.toString();
  const result = await apiFetchWithMeta<AuditLogEntryRaw[]>(
    `/admin/audit${qs ? `?${qs}` : ''}`
  );
  return {
    data: (result.data ?? []).map(mapMcpAuditEntry),
    total: result.meta.total ?? 0,
  };
}

export async function testMcpConnection(): Promise<McpConnectionStatus> {
  const data = await apiFetch<{ available: boolean; tool_count: number }>(
    '/admin/mcp-keys/health'
  );
  return {
    available: data?.available ?? false,
    toolCount: data?.tool_count ?? 0,
  };
}
