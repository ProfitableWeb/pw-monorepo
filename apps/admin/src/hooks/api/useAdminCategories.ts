import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  getAdminCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  reorderCategories,
  type CategoryCreatePayload,
} from '@/lib/api-client';
import { adminCategoryKeys, queryKeys } from '@/lib/query-keys';

/** Инвалидирует и админские, и публичные кеши категорий */
function invalidateCategories(qc: ReturnType<typeof useQueryClient>) {
  qc.invalidateQueries({ queryKey: adminCategoryKeys.all });
  qc.invalidateQueries({ queryKey: queryKeys.categories.all });
}

export function useAdminCategories() {
  return useQuery({
    queryKey: adminCategoryKeys.all,
    queryFn: getAdminCategories,
    staleTime: 5 * 60 * 1000,
  });
}

export function useCreateCategory() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: CategoryCreatePayload) => createCategory(data),
    onSuccess: () => invalidateCategories(qc),
  });
}

export function useUpdateCategory() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: Partial<CategoryCreatePayload>;
    }) => updateCategory(id, data),
    onSuccess: () => invalidateCategories(qc),
  });
}

export function useDeleteCategory() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteCategory(id),
    onSuccess: () => invalidateCategories(qc),
  });
}

export function useReorderCategories() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (
      items: { id: string; parent_id: string | null; order: number }[]
    ) => reorderCategories(items),
    onSuccess: () => invalidateCategories(qc),
  });
}
