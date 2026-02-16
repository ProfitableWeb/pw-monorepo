// === Исследования ===

export type ResearchStatus =
  | 'idea'
  | 'in_progress'
  | 'review'
  | 'completed'
  | 'archived';

export interface Research {
  id: string;
  title: string;
  description: string;
  status: ResearchStatus;
  categoryId?: string;
  createdAt: string;
  updatedAt: string;
  members: ResearchMember[];
}

export interface ResearchMember {
  userId: string;
  role: 'owner' | 'editor' | 'viewer';
  user: { id: string; name: string; avatarUrl?: string };
}

// === Внутренние сущности ===

export interface ResearchNote {
  id: string;
  researchId: string;
  title: string;
  content: string; // markdown
  authorId: string;
  createdAt: string;
  updatedAt: string;
}

export interface ResearchSource {
  id: string;
  researchId: string;
  title: string;
  url?: string;
  annotation?: string;
  quotes: string[];
  authorId: string;
  createdAt: string;
}

export interface ResearchDraft {
  id: string;
  researchId: string;
  title: string;
  content: string; // markdown
  authorId: string;
  createdAt: string;
  updatedAt: string;
}

export interface ResearchMedia {
  id: string;
  researchId: string;
  fileName: string;
  fileUrl: string;
  mimeType: string;
  size: number;
  authorId: string;
  createdAt: string;
}

export interface ResearchPublication {
  id: string;
  researchId: string;
  type: 'article' | 'social_post';
  title: string;
  articleId?: string;
  status: 'draft' | 'published';
}

// === Utility types ===

export type ResearchContentItem =
  | { type: 'note'; data: ResearchNote }
  | { type: 'source'; data: ResearchSource }
  | { type: 'draft'; data: ResearchDraft }
  | { type: 'media'; data: ResearchMedia };
