/**
 * Типы редактора статей.
 *
 * ArticleFormData — полная форма статьи (react-hook-form).
 * PreviewArticleData / PreviewMessage / PreviewResponse — postMessage-протокол
 * между админкой и iframe-превью web-приложения.
 *
 * @see store/article-editor-store.ts — глобальное состояние редактора
 * @see components/article-workbench/ — UI вкладок и превью
 */
export type EditorMode = 'markdown' | 'html' | 'visual';
export type DeviceType = 'desktop' | 'tablet' | 'mobile';
export type AutosaveStatus = 'saved' | 'syncing' | 'offline';
export type ArticleStatus = 'draft' | 'published' | 'archived' | 'scheduled';

export interface SelfCheckItem {
  id: string;
  question: string;
  answer: string;
}

export type SourceType = 'article' | 'book' | 'video' | 'tool';

export interface SourceItem {
  id: string;
  title: string;
  url: string;
  type: SourceType;
}

export interface GlossaryItem {
  id: string;
  term: string;
  definition: string;
}

export interface ArtifactsData {
  selfCheck: { enabled: boolean; items: SelfCheckItem[] };
  sources: { enabled: boolean; items: SourceItem[] };
  glossary: { enabled: boolean; items: GlossaryItem[] };
  provenance: { enabled: boolean; workspaceId: string; showLink: boolean };
}

export interface ArticleFormData {
  h1: string;
  subtitle: string;
  title: string;
  slug: string;
  status: ArticleStatus;
  /** ISO-строка даты публикации (для scheduled и published) */
  publishedAt: string;
  /** Часовой пояс публикации (UTC-смещение, напр. '+03:00') */
  publishTimezone: string;
  category: string;
  tags: string[];
  excerpt: string;
  imageUrl?: string;
  imageAlt?: string;
  content: string;
  metaDescription: string;
  canonicalUrl: string;
  ogTitle: string;
  ogDescription: string;
  ogImage: string;
  focusKeyword: string;
  seoKeywords: string[];
  robotsNoIndex: boolean;
  robotsNoFollow: boolean;
  schemaType: string;
  author: string;
  artifacts: ArtifactsData;
}

/** Данные статьи для передачи в iframe-предпросмотр через postMessage */
export interface PreviewArticleData {
  h1: string;
  subtitle: string;
  content: string;
  author: string;
  category: string;
  tags: string[];
  imageUrl?: string;
}

/** postMessage: admin → iframe */
export type PreviewMessage =
  | { type: 'preview:update'; data: PreviewArticleData }
  | { type: 'preview:scroll'; deltaY: number }
  | { type: 'preview:ping' };

/** postMessage: iframe → admin */
export type PreviewResponse =
  | { type: 'preview:ready' }
  | { type: 'preview:pong' };

export interface RevisionEntry {
  id: string;
  date: string;
  author: string;
  summary: string;
  content: string;
}

export interface ResearchMaterial {
  id: string;
  title: string;
  type: 'note' | 'source' | 'media';
  url?: string;
}
