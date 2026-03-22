/**
 * PW-030 | Типизированный API-клиент для Backend Content API.
 *
 * Все функции повторяют контракт mock-api.ts, чтобы замена была прозрачной.
 * snake_case ответов API преобразуется в camelCase фронтенд-типов.
 * credentials: 'include' для httpOnly cookies аутентификации.
 */

import { Category } from '@/types';
import { Article } from '@/components/common/masonry/types';
import {
  Comment,
  CommentSearchParams,
  ArticleCommentThread,
} from '@profitable-web/types';

import { API_BASE } from './api-base';

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
  is_default?: boolean;
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

interface AuthorRaw {
  id: string;
  name: string;
  job_title?: string | null;
  avatar?: string | null;
  bio?: string | null;
  email?: string | null;
  social_links?: Record<string, string> | null;
}

interface AuthorProfileRaw extends AuthorRaw {
  article_count: number;
}

/** Полный ответ статьи (включая content, toc, artifacts, layout) */
interface ArticleFullRaw extends ArticleListItemRaw {
  content: string;
  author?: AuthorRaw | null;
  views?: number;
  layout?: string | null;
  toc?: TocItemRaw[] | null;
  artifacts?: ArtifactsRaw | null;
  updated_at?: string | null;
}

interface TocItemRaw {
  id: string;
  text: string;
  level: number;
  enabled: boolean;
}

interface SelfCheckItemRaw {
  id: string;
  question: string;
  answer: string;
}

interface SourceItemRaw {
  id: string;
  title: string;
  url: string;
  type?: string;
}

interface ArtifactsRaw {
  selfCheck?: { enabled: boolean; items: SelfCheckItemRaw[] };
  sources?: { enabled: boolean; items: SourceItemRaw[] };
  glossary?: { enabled: boolean; items: unknown[] };
  provenance?: { enabled: boolean; workspaceId: string; showLink: boolean };
}

export interface Author {
  id: string;
  name: string;
  jobTitle?: string;
  avatar?: string;
  bio?: string;
  email?: string;
  socialLinks?: Record<string, string>;
}

/** Расширенный публичный профиль автора */
export interface AuthorProfile extends Author {
  articleCount: number;
}

/** Полная статья для страницы */
export interface FullArticle {
  id: string;
  title: string;
  subtitle: string;
  slug: string;
  content: string;
  excerpt: string;
  category: string;
  categories: string[];
  tags: string[];
  author?: Author;
  readTime?: number;
  imageUrl?: string;
  imageAlt?: string;
  publishedAt: string;
  updatedAt?: string;
  layout: string;
  toc: { id: string; text: string; level: number; enabled: boolean }[];
  selfCheck: { id: string; question: string; answer: string }[];
  sources: { id: string; title: string; url: string }[];
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
    isDefault: raw.is_default,
  };
}

function mapArticleListItem(raw: ArticleListItemRaw): Article {
  return {
    id: raw.id,
    title: raw.title,
    subtitle: raw.subtitle ?? '',
    slug: raw.slug,
    // excerpt — редакторский текст из админки, приоритетнее автогенерированного summary
    summary: raw.excerpt || raw.summary || '',
    category: raw.category,
    categories: raw.categories ?? [],
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

export class ApiError extends Error {
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
  options?: { next?: NextFetchRequestConfig; method?: string; body?: string }
): Promise<T | null> {
  const url = `${API_BASE}${path}`;

  const res = await fetch(url, {
    headers: {
      Accept: 'application/json',
      ...(options?.body ? { 'Content-Type': 'application/json' } : {}),
    },
    credentials: 'include',
    ...options,
  });

  if (res.status === 404) return null;

  // 401 — пробуем refresh один раз
  if (res.status === 401 && !path.startsWith('/auth/')) {
    const refreshed = await authRefresh();
    if (refreshed) {
      // Повторяем оригинальный запрос
      const retry = await fetch(url, {
        headers: {
          Accept: 'application/json',
          ...(options?.body ? { 'Content-Type': 'application/json' } : {}),
        },
        credentials: 'include',
        ...options,
      });
      if (retry.ok) {
        const json: ApiResponseRaw<T> = await retry.json();
        return json.data ?? null;
      }
    }
    throw new ApiError(401, 'Не авторизован');
  }

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
 * Получает полную статью по slug (content, toc, artifacts, layout)
 */
export async function getFullArticleBySlug(
  slug: string
): Promise<FullArticle | null> {
  const raw = await apiFetch<ArticleFullRaw>(
    `/articles/${encodeURIComponent(slug)}`
  );
  if (!raw) return null;

  const artifacts = raw.artifacts;
  const selfCheck =
    artifacts?.selfCheck?.enabled && artifacts.selfCheck.items.length > 0
      ? artifacts.selfCheck.items
      : [];
  const sources =
    artifacts?.sources?.enabled && artifacts.sources.items.length > 0
      ? artifacts.sources.items.map(s => ({
          id: s.id,
          title: s.title,
          url: s.url,
        }))
      : [];

  return {
    id: raw.id,
    title: raw.title,
    subtitle: raw.subtitle ?? '',
    slug: raw.slug,
    content: raw.content,
    excerpt: raw.excerpt ?? '',
    category: raw.category,
    categories: raw.categories ?? [],
    tags: raw.tags ?? [],
    author: raw.author
      ? {
          id: raw.author.id,
          name: raw.author.name,
          jobTitle: raw.author.job_title ?? undefined,
          avatar: raw.author.avatar ?? undefined,
          bio: raw.author.bio ?? undefined,
          socialLinks: raw.author.social_links ?? undefined,
        }
      : undefined,
    readTime: raw.reading_time ?? undefined,
    imageUrl: raw.image_url ?? undefined,
    imageAlt: raw.image_alt ?? undefined,
    publishedAt: raw.published_at ?? '',
    updatedAt: raw.updated_at ?? undefined,
    layout: raw.layout ?? 'three-column',
    toc: raw.toc ?? [],
    selfCheck,
    sources,
  };
}

/**
 * Получает страницу (type=page) по slug
 */
export async function getPageBySlug(slug: string): Promise<FullArticle | null> {
  const raw = await apiFetch<ArticleFullRaw>(
    `/pages/${encodeURIComponent(slug)}`
  );
  if (!raw) return null;

  const artifacts = raw.artifacts;
  const selfCheck =
    artifacts?.selfCheck?.enabled && artifacts.selfCheck.items.length > 0
      ? artifacts.selfCheck.items
      : [];
  const sources =
    artifacts?.sources?.enabled && artifacts.sources.items.length > 0
      ? artifacts.sources.items.map(s => ({
          id: s.id,
          title: s.title,
          url: s.url,
        }))
      : [];

  return {
    id: raw.id,
    title: raw.title,
    subtitle: raw.subtitle ?? '',
    slug: raw.slug,
    content: raw.content,
    excerpt: raw.excerpt ?? '',
    category: raw.category,
    categories: raw.categories ?? [],
    tags: raw.tags ?? [],
    author: raw.author
      ? {
          id: raw.author.id,
          name: raw.author.name,
          jobTitle: raw.author.job_title ?? undefined,
          avatar: raw.author.avatar ?? undefined,
          bio: raw.author.bio ?? undefined,
          socialLinks: raw.author.social_links ?? undefined,
        }
      : undefined,
    readTime: raw.reading_time ?? undefined,
    imageUrl: raw.image_url ?? undefined,
    imageAlt: raw.image_alt ?? undefined,
    publishedAt: raw.published_at ?? '',
    updatedAt: raw.updated_at ?? undefined,
    layout: raw.layout ?? 'three-column',
    toc: raw.toc ?? [],
    selfCheck,
    sources,
  };
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

function mapAuthorProfile(raw: AuthorProfileRaw): AuthorProfile {
  return {
    id: raw.id,
    name: raw.name,
    jobTitle: raw.job_title ?? undefined,
    avatar: raw.avatar ?? undefined,
    bio: raw.bio ?? undefined,
    email: raw.email ?? undefined,
    socialLinks: raw.social_links ?? undefined,
    articleCount: raw.article_count,
  };
}

/**
 * Получает публичный профиль основного автора сайта
 */
export async function getAuthorProfile(): Promise<AuthorProfile | null> {
  const raw = await apiFetch<AuthorProfileRaw>('/authors/primary');
  if (!raw) return null;
  return mapAuthorProfile(raw);
}

/**
 * Получает публичный профиль автора по ID
 */
export async function getAuthorById(id: string): Promise<AuthorProfile | null> {
  const raw = await apiFetch<AuthorProfileRaw>(
    `/authors/${encodeURIComponent(id)}`
  );
  if (!raw) return null;
  return mapAuthorProfile(raw);
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

// ---------------------------------------------------------------------------
// Auth API
// ---------------------------------------------------------------------------

interface AuthUserRaw {
  id: string;
  name: string;
  email: string;
  avatar?: string | null;
  role: string;
  bio?: string | null;
  social_links?: Record<string, string> | null;
}

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: string;
  bio?: string;
  socialLinks?: Record<string, string>;
}

function mapAuthUser(raw: AuthUserRaw): AuthUser {
  return {
    id: raw.id,
    name: raw.name,
    email: raw.email,
    avatar: raw.avatar ?? undefined,
    role: raw.role,
    bio: raw.bio ?? undefined,
    socialLinks: raw.social_links ?? undefined,
  };
}

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

export async function authRegister(
  email: string,
  password: string,
  name: string
): Promise<AuthUser> {
  const res = await fetch(`${API_BASE}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ email, password, name }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new ApiError(res.status, err.detail ?? 'Ошибка регистрации');
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
  const origin = window.location.origin;
  const res = await fetch(
    `${API_BASE}/auth/${provider}/url?origin=${encodeURIComponent(origin)}`,
    { credentials: 'include' }
  );
  if (!res.ok) throw new ApiError(res.status, 'Ошибка получения OAuth URL');
  const json = await res.json();
  return json.url;
}

// ---------------------------------------------------------------------------
// Profile API (PW-034)
// ---------------------------------------------------------------------------

interface ProfileRaw {
  id: string;
  name: string;
  email: string;
  avatar?: string | null;
  role: string;
  bio?: string | null;
  social_links?: Record<string, string> | null;
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
  socialLinks?: Record<string, string>;
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
    socialLinks: raw.social_links ?? undefined,
    hasPassword: raw.has_password,
    oauthProvider: raw.oauth_provider ?? undefined,
    oauthProviders: raw.oauth_providers ?? [],
  };
}

export async function getProfile(): Promise<UserProfile | null> {
  const data = await apiFetch<ProfileRaw>('/users/me');
  return data ? mapProfile(data) : null;
}

export async function updateProfile(updates: {
  name?: string;
  bio?: string;
  social_links?: Record<string, string>;
}): Promise<UserProfile> {
  const data = await apiFetch<ProfileRaw>('/users/me', {
    method: 'PATCH',
    body: JSON.stringify(updates),
  });
  if (!data) throw new ApiError(500, 'Не удалось обновить профиль');
  return mapProfile(data);
}

export async function setPassword(newPassword: string): Promise<UserProfile> {
  const data = await apiFetch<ProfileRaw>('/users/me/password', {
    method: 'POST',
    body: JSON.stringify({ new_password: newPassword }),
  });
  if (!data) throw new ApiError(500, 'Не удалось установить пароль');
  return mapProfile(data);
}

export async function changePassword(
  oldPassword: string,
  newPassword: string
): Promise<UserProfile> {
  const data = await apiFetch<ProfileRaw>('/users/me/password/change', {
    method: 'POST',
    body: JSON.stringify({
      old_password: oldPassword,
      new_password: newPassword,
    }),
  });
  if (!data) throw new ApiError(500, 'Не удалось сменить пароль');
  return mapProfile(data);
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
  if (!json.data) throw new ApiError(500, 'Нет данных профиля');
  return mapProfile(json.data);
}

export async function deleteAvatar(): Promise<UserProfile> {
  const data = await apiFetch<ProfileRaw>('/users/me/avatar', {
    method: 'DELETE',
  });
  if (!data) throw new ApiError(500, 'Не удалось удалить аватар');
  return mapProfile(data);
}

export async function getOAuthLinkUrl(provider: string): Promise<string> {
  const origin = window.location.origin;
  const res = await fetch(
    `${API_BASE}/auth/${provider}/url?origin=${encodeURIComponent(origin)}&mode=link`,
    { credentials: 'include' }
  );
  if (!res.ok) throw new ApiError(res.status, 'Ошибка получения OAuth URL');
  const json = await res.json();
  return json.url;
}

export async function unlinkOAuth(provider: string): Promise<UserProfile> {
  const data = await apiFetch<ProfileRaw>(`/users/me/oauth/${provider}`, {
    method: 'DELETE',
  });
  if (!data) throw new ApiError(500, 'Не удалось отвязать провайдер');
  return mapProfile(data);
}

export async function createComment(
  articleSlug: string,
  content: string,
  parentId?: string
): Promise<Comment> {
  const body: Record<string, string> = { content };
  if (parentId) body.parent_id = parentId;

  const data = await apiFetch<CommentRaw>(
    `/articles/${encodeURIComponent(articleSlug)}/comments`,
    { method: 'POST', body: JSON.stringify(body) }
  );
  if (!data) throw new ApiError(500, 'Не удалось создать комментарий');
  return mapComment(data);
}
