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
  return mapAdminArticleFull(raw!);
}

export async function updateArticle(
  articleId: string,
  data: ArticleUpdatePayload
): Promise<AdminArticleResponseType> {
  const raw = await apiMutate<AdminArticleRaw>(
    `/admin/articles/${encodeURIComponent(articleId)}`,
    { method: 'PATCH', body: data }
  );
  return mapAdminArticleFull(raw!);
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
  return mapAdminArticleFull(raw!);
}

export async function scheduleArticle(
  articleId: string,
  publishedAt: string
): Promise<AdminArticleResponseType> {
  const raw = await apiMutate<AdminArticleRaw>(
    `/admin/articles/${encodeURIComponent(articleId)}/schedule`,
    { method: 'POST', body: { published_at: publishedAt } }
  );
  return mapAdminArticleFull(raw!);
}

export async function unpublishArticle(
  articleId: string
): Promise<AdminArticleResponseType> {
  const raw = await apiMutate<AdminArticleRaw>(
    `/admin/articles/${encodeURIComponent(articleId)}/unpublish`,
    { method: 'POST' }
  );
  return mapAdminArticleFull(raw!);
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
  return mapAdminArticleFull(raw!);
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
  return mapAdminTagItem(raw!);
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
  return mapSystemSettingsItem(raw!);
}

export async function updateSystemSettings(data: {
  timezone?: string;
}): Promise<SystemSettings> {
  const raw = await apiMutate<SystemSettingsRaw>('/admin/settings', {
    method: 'PATCH',
    body: data,
  });
  return mapSystemSettingsItem(raw!);
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
