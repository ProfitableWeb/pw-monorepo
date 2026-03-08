import { useQuery } from '@tanstack/react-query';
import { getAdminCategories } from '@/lib/api-client';
import { adminCategoryKeys } from '@/lib/query-keys';

export function useAdminCategories() {
  return useQuery({
    queryKey: adminCategoryKeys.all,
    queryFn: getAdminCategories,
    staleTime: 5 * 60 * 1000,
  });
}
