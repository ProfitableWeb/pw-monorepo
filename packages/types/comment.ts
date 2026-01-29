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
  /** ID родительского комментария (для ответов) */
  parentId?: string;
}

/** Корневой комментарий и его ответы для отображения под статьёй */
export interface ArticleCommentThread {
  root: Comment;
  replies: Comment[];
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
