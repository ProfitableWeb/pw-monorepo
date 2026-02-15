'use client';

import { useQuery } from '@tanstack/react-query';
import { getArticleCommentThreads } from '@/lib/api-client';
import { queryKeys } from '@/lib/query-keys';
import type { ArticleCommentThread } from '@profitable-web/types';

/**
 * React Query hook для загрузки комментариев статьи.
 * Поддерживает SSR-prefetch через initialData.
 */
export function useArticleComments(
  articleSlug: string,
  initialData?: ArticleCommentThread[]
) {
  return useQuery({
    queryKey: queryKeys.comments.byArticle(articleSlug),
    queryFn: () => getArticleCommentThreads(articleSlug),
    initialData,
  });
}
