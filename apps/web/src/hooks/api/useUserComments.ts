'use client';

import { useQuery } from '@tanstack/react-query';
import { getUserComments } from '@/lib/api-client';
import { queryKeys } from '@/lib/query-keys';
import type { Comment } from '@profitable-web/types';

/**
 * React Query hook для загрузки комментариев пользователя.
 * Поддерживает SSR-prefetch через initialData.
 */
export function useUserComments(
  userId: string,
  query?: string,
  initialData?: Comment[]
) {
  return useQuery({
    queryKey: queryKeys.comments.byUser(userId, query),
    queryFn: () => getUserComments(userId, query ? { query } : undefined),
    initialData,
    enabled: !!userId,
  });
}
