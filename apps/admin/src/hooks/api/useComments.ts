import { useQuery } from '@tanstack/react-query';
import { getArticleComments, getUserComments } from '@/lib/api-client';
import { queryKeys } from '@/lib/query-keys';

export function useArticleComments(articleSlug: string) {
  return useQuery({
    queryKey: queryKeys.articles.comments(articleSlug),
    queryFn: () => getArticleComments(articleSlug),
    enabled: !!articleSlug,
  });
}

export function useUserComments(userId: string, query?: string) {
  return useQuery({
    queryKey: queryKeys.users.comments(userId, query),
    queryFn: () => getUserComments(userId, query ? { query } : undefined),
    enabled: !!userId,
  });
}
