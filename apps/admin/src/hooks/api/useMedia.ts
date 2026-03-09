import {
  useQuery,
  useInfiniteQuery,
  useMutation,
  useQueryClient,
  keepPreviousData,
} from '@tanstack/react-query';
import {
  getMediaList,
  getMedia,
  uploadMedia,
  replaceMediaFile,
  updateMedia,
  deleteMedia,
  getMediaStats,
} from '@/lib/api-client';
import { adminMediaKeys } from '@/lib/query-keys';
import type {
  MediaListParams,
  MediaUpdatePayload,
} from '@/app/components/sections/media/media.types';

/** Параметры фильтрации без page (page управляется useInfiniteQuery) */
type MediaFilterParams = Omit<MediaListParams, 'page'>;

export function useMediaList(params?: MediaFilterParams) {
  return useInfiniteQuery({
    queryKey: adminMediaKeys.list(params),
    queryFn: ({ pageParam }) => getMediaList({ ...params, page: pageParam }),
    initialPageParam: 1,
    getNextPageParam: lastPage =>
      lastPage.meta?.hasMore ? (lastPage.meta.page ?? 1) + 1 : undefined,
    placeholderData: keepPreviousData,
  });
}

export function useMedia(id: string | null) {
  return useQuery({
    queryKey: adminMediaKeys.detail(id ?? ''),
    queryFn: () => getMedia(id!),
    enabled: !!id,
  });
}

export function useMediaStats() {
  return useQuery({
    queryKey: adminMediaKeys.stats(),
    queryFn: () => getMediaStats(),
    staleTime: 60_000,
  });
}

export function useUploadMedia() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (file: File) => uploadMedia(file),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: adminMediaKeys.lists() });
      qc.invalidateQueries({ queryKey: adminMediaKeys.stats() });
    },
  });
}

export function useUpdateMedia() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      mediaId,
      data,
    }: {
      mediaId: string;
      data: MediaUpdatePayload;
    }) => updateMedia(mediaId, data),
    onSuccess: (_data, { mediaId }) => {
      qc.invalidateQueries({ queryKey: adminMediaKeys.detail(mediaId) });
      qc.invalidateQueries({ queryKey: adminMediaKeys.lists() });
    },
  });
}

export function useReplaceMedia() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ mediaId, file }: { mediaId: string; file: File }) =>
      replaceMediaFile(mediaId, file),
    onSuccess: (_data, { mediaId }) => {
      qc.invalidateQueries({ queryKey: adminMediaKeys.detail(mediaId) });
      qc.invalidateQueries({ queryKey: adminMediaKeys.lists() });
      qc.invalidateQueries({ queryKey: adminMediaKeys.stats() });
    },
  });
}

export function useDeleteMedia() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (mediaId: string) => deleteMedia(mediaId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: adminMediaKeys.lists() });
      qc.invalidateQueries({ queryKey: adminMediaKeys.stats() });
    },
  });
}
