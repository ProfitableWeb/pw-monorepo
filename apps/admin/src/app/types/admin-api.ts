/**
 * Типы ответов admin API.
 *
 * Все поля в camelCase (маппинг из snake_case делает api-client).
 * Payload-типы в snake_case — отправляются на сервер как есть.
 *
 * @see lib/api-client.ts — admin-функции
 * @see lib/mappers.ts — трансформация API ↔ ArticleFormData
 */
import type { ArtifactsData } from '@/app/types/article-editor';

// ---------------------------------------------------------------------------
// Admin Articles
// ---------------------------------------------------------------------------

export interface AdminArticleResponse {
  id: string;
  title: string;
  slug: string;
  subtitle: string | null;
  content: string;
  contentFormat: string;
  excerpt: string;
  summary: string | null;
  status: string;
  layout: string;
  imageUrl: string | null;
  imageAlt: string | null;
  readingTime: number | null;
  views: number;
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
  // SEO
  metaTitle: string | null;
  metaDescription: string | null;
  canonicalUrl: string | null;
  ogTitle: string | null;
  ogDescription: string | null;
  ogImage: string | null;
  focusKeyword: string | null;
  seoKeywords: string[];
  schemaType: string | null;
  robotsNoIndex: boolean;
  robotsNoFollow: boolean;
  // Relations
  category: { id: string; name: string; slug: string };
  tags: { id: string; name: string; slug: string }[];
  author: { id: string; name: string } | null;
  // Extra
  artifacts: ArtifactsData | null;
  revisionCount: number;
}

export interface AdminArticleListItem {
  id: string;
  title: string;
  slug: string;
  status: string;
  excerpt: string;
  category: { id: string; name: string; slug: string };
  tags: { id: string; name: string; slug: string }[];
  author: { id: string; name: string } | null;
  imageUrl: string | null;
  readingTime: number | null;
  views: number;
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface AdminArticlesParams {
  page?: number;
  limit?: number;
  status?: string;
  category?: string;
  search?: string;
  sortBy?: string;
  order?: 'asc' | 'desc';
  authorId?: string;
}

// ---------------------------------------------------------------------------
// Payloads (snake_case — отправляются на сервер)
// ---------------------------------------------------------------------------

export interface ArticleCreatePayload {
  title: string;
  subtitle?: string | null;
  slug?: string | null;
  content?: string;
  content_format?: 'html' | 'markdown';
  excerpt?: string;
  category_id: string;
  tags?: string[];
  image_url?: string | null;
  image_alt?: string | null;
  layout?: string;
  meta_title?: string | null;
  meta_description?: string | null;
  focus_keyword?: string | null;
  seo_keywords?: string[];
  schema_type?: string;
  canonical_url?: string | null;
  og_title?: string | null;
  og_description?: string | null;
  og_image?: string | null;
  robots_no_index?: boolean;
  robots_no_follow?: boolean;
  artifacts?: ArtifactsData | null;
}

export interface ArticleUpdatePayload {
  title?: string;
  subtitle?: string | null;
  slug?: string;
  status?: 'draft' | 'published' | 'archived' | 'scheduled';
  published_at?: string | null;
  content?: string;
  content_format?: 'html' | 'markdown';
  excerpt?: string;
  category_id?: string;
  tags?: string[];
  image_url?: string | null;
  image_alt?: string | null;
  layout?: string;
  meta_title?: string | null;
  meta_description?: string | null;
  focus_keyword?: string | null;
  seo_keywords?: string[];
  schema_type?: string;
  canonical_url?: string | null;
  og_title?: string | null;
  og_description?: string | null;
  og_image?: string | null;
  robots_no_index?: boolean;
  robots_no_follow?: boolean;
  artifacts?: ArtifactsData | null;
}

// ---------------------------------------------------------------------------
// Admin Tags & Categories
// ---------------------------------------------------------------------------

export interface AdminTag {
  id: string;
  name: string;
  slug: string;
  articleCount: number;
}

export interface AdminCategoryFull {
  id: string;
  name: string;
  slug: string;
  subtitle: string | null;
  description: string | null;
  icon: string | null;
  color: string | null;
  parentId: string | null;
  order: number;
  articleCount: number;
}

// ---------------------------------------------------------------------------
// System Settings
// ---------------------------------------------------------------------------

export interface SystemSettings {
  timezone: string;
  updatedAt: string;
}

// ---------------------------------------------------------------------------
// Revisions
// ---------------------------------------------------------------------------

export interface RevisionListItem {
  id: string;
  summary: string | null;
  contentFormat: string;
  authorId: string | null;
  createdAt: string;
}

export interface RevisionResponse extends RevisionListItem {
  content: string;
}

// ---------------------------------------------------------------------------
// Pagination
// ---------------------------------------------------------------------------

export interface PaginationParams {
  page?: number;
  limit?: number;
}
