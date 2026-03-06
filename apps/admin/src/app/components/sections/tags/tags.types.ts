/** Интерфейс метки */
export interface Tag {
  id: string;
  name: string;
  slug: string;
  color: string;
  articlesCount: number;
  category?: string;
  createdAt: Date;
}

/** Режим отображения меток */
export type ViewMode = 'cloud' | 'grid' | 'list';
