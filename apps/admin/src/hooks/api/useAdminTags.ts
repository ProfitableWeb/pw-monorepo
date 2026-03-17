import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  getAdminTags,
  createTag,
  updateTag,
  deleteTag,
  type TagCreatePayload,
} from '@/lib/api-client';
import { adminArticleKeys, adminTagKeys } from '@/lib/query-keys';

/** Инвалидирует кеши меток и статей (статьи содержат теги) */
function invalidateTags(qc: ReturnType<typeof useQueryClient>) {
  qc.invalidateQueries({ queryKey: adminTagKeys.all });
  qc.invalidateQueries({ queryKey: adminArticleKeys.all });
}

export function useAdminTags() {
  return useQuery({
    queryKey: adminTagKeys.all,
    queryFn: getAdminTags,
    staleTime: 5 * 60 * 1000,
  });
}

export function useCreateTag() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: TagCreatePayload) => createTag(data),
    onSuccess: () => invalidateTags(qc),
  });
}

export function useUpdateTag() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: Partial<TagCreatePayload>;
    }) => updateTag(id, data),
    onSuccess: () => invalidateTags(qc),
  });
}

export function useDeleteTag() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteTag(id),
    onSuccess: () => invalidateTags(qc),
  });
}
