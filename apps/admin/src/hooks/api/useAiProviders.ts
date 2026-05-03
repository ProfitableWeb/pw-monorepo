import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  getAiProviders,
  createAiProvider,
  updateAiProvider,
  deleteAiProvider,
  setDefaultAiProvider,
  toggleAiProvider,
  testAiProvider,
} from '@/lib/api-client';
import type {
  AiProviderCreatePayload,
  AiProviderUpdatePayload,
} from '@/app/components/sections/ai-center/ai-center.types';
import { adminAiProviderKeys } from '@/lib/query-keys';

export function useAiProviders() {
  return useQuery({
    queryKey: adminAiProviderKeys.list(),
    queryFn: getAiProviders,
    staleTime: 30_000,
  });
}

export function useCreateAiProvider() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: AiProviderCreatePayload) => createAiProvider(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: adminAiProviderKeys.all });
    },
  });
}

export function useUpdateAiProvider() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: AiProviderUpdatePayload }) =>
      updateAiProvider(id, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: adminAiProviderKeys.all });
    },
  });
}

export function useDeleteAiProvider() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteAiProvider(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: adminAiProviderKeys.all });
    },
  });
}

export function useSetDefaultAiProvider() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => setDefaultAiProvider(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: adminAiProviderKeys.all });
    },
  });
}

export function useToggleAiProvider() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => toggleAiProvider(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: adminAiProviderKeys.all });
    },
  });
}

export function useTestAiProvider() {
  return useMutation({
    mutationFn: (id: string) => testAiProvider(id),
  });
}
