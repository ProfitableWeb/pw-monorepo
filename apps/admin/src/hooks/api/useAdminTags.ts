import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getAdminTags, createTag } from '@/lib/api-client';
import { adminTagKeys } from '@/lib/query-keys';

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
    mutationFn: (name: string) => createTag(name),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: adminTagKeys.all });
    },
  });
}
