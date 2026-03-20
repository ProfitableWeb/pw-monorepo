export interface Article {
  id: string;
  title: string;
  slug: string;
  status: 'published' | 'draft' | 'scheduled' | 'archived';
  category: string;
  author: string;
  authorId: string;
  views: number;
  date: string;
}
