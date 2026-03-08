export interface Article {
  id: string;
  title: string;
  status: 'published' | 'draft' | 'scheduled' | 'archived';
  category: string;
  author: string;
  views: number;
  date: string;
}

export interface ArticlesFilterState {
  searchQuery: string;
  selectedStatuses: string[];
  selectedCategories: string[];
  dateRange: { from?: Date; to?: Date };
}
