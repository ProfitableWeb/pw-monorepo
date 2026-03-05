export type EditorMode = 'markdown' | 'html' | 'visual';
export type DeviceType = 'desktop' | 'tablet' | 'mobile';
export type AutosaveStatus = 'saved' | 'syncing' | 'offline';

export interface ArticleFormData {
  h1: string;
  title: string;
  slug: string;
  category: string;
  tags: string[];
  excerpt: string;
  imageUrl?: string;
  content: string;
}

export interface RevisionEntry {
  id: string;
  date: string;
  author: string;
  summary: string;
}

export interface ResearchMaterial {
  id: string;
  title: string;
  type: 'note' | 'source' | 'media';
  url?: string;
}
