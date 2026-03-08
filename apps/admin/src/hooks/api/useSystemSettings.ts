import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getSystemSettings, updateSystemSettings } from '@/lib/api-client';
import { settingsKeys } from '@/lib/query-keys';

export function useSystemSettings() {
  return useQuery({
    queryKey: settingsKeys.all,
    queryFn: getSystemSettings,
    staleTime: 10 * 60 * 1000,
  });
}

export function useUpdateSettings() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: { timezone?: string }) => updateSystemSettings(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: settingsKeys.all });
    },
  });
}
