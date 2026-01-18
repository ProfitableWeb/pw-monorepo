/**
 * Category type
 */
export interface Category {
  id: string;
  name: string;
  slug: string;
  subtitle?: string;
  description?: string;
  icon?: string;
  color?: string;
  articleCount?: number;
}
