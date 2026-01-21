/**
 * Типы для системы комментариев
 */

export interface Comment {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  articleId: string;
  articleSlug: string;
  articleTitle: string;
  content: string;
  createdAt: string;
  updatedAt?: string;
}

export interface CommentSearchParams {
  query?: string;
  limit?: number;
  offset?: number;
}

export interface CommentStats {
  total: number;
  thisWeek: number;
  thisMonth: number;
}
