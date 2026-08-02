'use client';

import { useQuery } from '@tanstack/react-query';
import { getOwnComments } from '@/lib/api-client';
import { queryKeys } from '@/lib/query-keys';

/**
 * React Query hook для загрузки комментариев текущего пользователя.
 *
 * PW-072 | SSR-prefetch не поддерживается осознанно: `/users/me/comments`
 * требует авторизации, а куки сессии в серверный fetch не попадают. Запрос
 * выполняется только когда пользователь известен (`enabled`).
 */
export function useOwnComments(enabled: boolean, query?: string) {
  return useQuery({
    queryKey: queryKeys.comments.own(query),
    queryFn: () => getOwnComments(query ? { query } : undefined),
    enabled,
  });
}
