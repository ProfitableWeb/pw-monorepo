import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getAdminArticles,
  getAdminArticle,
  createArticle,
  updateArticle,
  deleteArticle,
  publishArticle,
  scheduleArticle,
  unpublishArticle,
  restoreRevision,
  getRevisions,
  getRevision,
} from '@/lib/api-client';
import { adminArticleKeys } from '@/lib/query-keys';
import type {
  AdminArticlesParams,
  ArticleCreatePayload,
  ArticleUpdatePayload,
  PaginationParams,
} from '@/app/types/admin-api';

export function useAdminArticles(params?: AdminArticlesParams) {
  return useQuery({
    queryKey: adminArticleKeys.list(params),
    queryFn: () => getAdminArticles(params),
  });
}

export function useAdminArticle(articleId: string | null) {
  return useQuery({
    queryKey: adminArticleKeys.detail(articleId!),
    queryFn: () => getAdminArticle(articleId!),
    enabled: !!articleId,
  });
}

export function useRevisions(
  articleId: string | null,
  params?: PaginationParams
) {
  return useQuery({
    queryKey: adminArticleKeys.revisions(articleId!, params),
    queryFn: () => getRevisions(articleId!, params),
    enabled: !!articleId,
  });
}

export function useRevision(
  articleId: string | null,
  revisionId: string | null
) {
  return useQuery({
    queryKey: [...adminArticleKeys.revisions(articleId!), revisionId],
    queryFn: () => getRevision(articleId!, revisionId!),
    enabled: !!articleId && !!revisionId,
  });
}

export function useCreateArticle() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: ArticleCreatePayload) => createArticle(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: adminArticleKeys.lists() });
    },
  });
}

export function useUpdateArticle() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      articleId,
      data,
    }: {
      articleId: string;
      data: ArticleUpdatePayload;
    }) => updateArticle(articleId, data),
    onSuccess: (_data, { articleId }) => {
      qc.invalidateQueries({ queryKey: adminArticleKeys.detail(articleId) });
      qc.invalidateQueries({ queryKey: adminArticleKeys.lists() });
    },
  });
}

export function useDeleteArticle() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      articleId,
      permanent,
    }: {
      articleId: string;
      permanent?: boolean;
    }) => deleteArticle(articleId, permanent),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: adminArticleKeys.lists() });
    },
  });
}

export function usePublishArticle() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (articleId: string) => publishArticle(articleId),
    onSuccess: (_data, articleId) => {
      qc.invalidateQueries({ queryKey: adminArticleKeys.detail(articleId) });
      qc.invalidateQueries({ queryKey: adminArticleKeys.lists() });
    },
  });
}

export function useScheduleArticle() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      articleId,
      publishedAt,
    }: {
      articleId: string;
      publishedAt: string;
    }) => scheduleArticle(articleId, publishedAt),
    onSuccess: (_data, { articleId }) => {
      qc.invalidateQueries({ queryKey: adminArticleKeys.detail(articleId) });
      qc.invalidateQueries({ queryKey: adminArticleKeys.lists() });
    },
  });
}

export function useUnpublishArticle() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (articleId: string) => unpublishArticle(articleId),
    onSuccess: (_data, articleId) => {
      qc.invalidateQueries({ queryKey: adminArticleKeys.detail(articleId) });
      qc.invalidateQueries({ queryKey: adminArticleKeys.lists() });
    },
  });
}

export function useRestoreRevision() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      articleId,
      revisionId,
    }: {
      articleId: string;
      revisionId: string;
    }) => restoreRevision(articleId, revisionId),
    onSuccess: (_data, { articleId }) => {
      qc.invalidateQueries({ queryKey: adminArticleKeys.detail(articleId) });
      qc.invalidateQueries({ queryKey: adminArticleKeys.revisions(articleId) });
    },
  });
}
