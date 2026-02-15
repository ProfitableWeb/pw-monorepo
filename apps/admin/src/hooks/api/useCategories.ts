import { useQuery } from '@tanstack/react-query';
import { getAllCategories } from '@/lib/api-client';
import { queryKeys } from '@/lib/query-keys';

export function useCategories() {
  return useQuery({
    queryKey: queryKeys.categories.all,
    queryFn: getAllCategories,
  });
}
