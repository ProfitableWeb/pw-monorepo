/**
 * Layout types for articles/pages
 */
export type ArticleLayoutType =
  | "three-column"
  | "two-column"
  | "full-width"
  | "one-column";

/**
 * Article type for blog posts
 */
export interface Article {
  id: string;
  title: string;
  slug: string;
  content: string; // HTML format
  excerpt: string;
  category: string;
  tags: string[];
  publishedAt: Date;
  updatedAt: Date;
  author?: string;
  readingTime?: number;
  views?: number;
  layout?: ArticleLayoutType; // Layout type (default: 'three-column')
}

/**
 * Article metadata (for listings)
 */
export interface ArticleMeta {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  category: string;
  tags: string[];
  publishedAt: Date;
  readingTime?: number;
  layout?: ArticleLayoutType; // Layout type (default: 'three-column')
}
