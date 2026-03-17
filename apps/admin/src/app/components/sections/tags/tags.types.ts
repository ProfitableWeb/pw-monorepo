/** Интерфейс метки (UI-представление) */
export interface Tag {
  id: string;
  name: string;
  slug: string;
  color: string;
  articlesCount: number;
  group: string | null;
  createdAt: string | null;
}

/** Режим отображения меток */
export type ViewMode = 'cloud' | 'grid' | 'list';

/** Данные формы создания/редактирования метки */
export interface TagFormData {
  name: string;
  slug: string;
  color: string;
  group: string;
}
