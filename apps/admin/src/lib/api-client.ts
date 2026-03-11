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
  method: 'POST' | 'PATCH' | 'DELETE';
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
  category: { id: string; name: string; slug: string };
  tags: { id: string; name: string; slug: string }[];
  author: { id: string; name: string } | null;
  artifacts: any;
  revision_count: number;
}

interface AdminArticleListItemRaw {
  id: string;
  title: string;
  slug: string;
  status: string;
  excerpt: string;
  category: { id: string; name: string; slug: string };
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
  article_count: number;
}

interface AdminCategoryFullRaw {
  id: string;
  name: string;
  slug: string;
  subtitle: string | null;
  description: string | null;
  icon: string | null;
  color: string | null;
  article_count: number;
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
    category: raw.category,
    tags: raw.tags,
    author: raw.author,
    artifacts: raw.artifacts,
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
    category: raw.category,
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
    articleCount: raw.article_count,
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
    articleCount: raw.article_count,
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
  const qs = q.toString();
  const result = await apiFetchWithMeta<AdminArticleListItemRaw[]>(
    `/admin/articles${qs ? `?${qs}` : ''}`
  );
  return {
    data: (result.data ?? []).map(mapAdminArticleListItem),
    meta: result.meta,
  };
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

export async function createTag(name: string): Promise<AdminTagType> {
  const raw = await apiMutate<AdminTagRaw>('/admin/tags', {
    method: 'POST',
    body: { name },
  });
  if (!raw) throw new ApiError(500, 'Пустой ответ API');
  return mapAdminTagItem(raw);
}

// ---------------------------------------------------------------------------
// Admin Categories API
// ---------------------------------------------------------------------------

export async function getAdminCategories(): Promise<AdminCategoryFull[]> {
  const data = await apiFetch<AdminCategoryFullRaw[]>('/admin/categories');
  return (data ?? []).map(mapAdminCategoryFullItem);
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
