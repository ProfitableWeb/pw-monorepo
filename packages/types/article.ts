/**
 * Article type for blog posts
 */
export interface Article {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  category: string;
  tags: string[];
  publishedAt: Date;
  updatedAt: Date;
  author?: string;
  readingTime?: number;
  views?: number;
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
}
