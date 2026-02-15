import { useQuery } from '@tanstack/react-query';
import {
  getArticles,
  getArticleBySlug,
  type ArticlesParams,
} from '@/lib/api-client';
import { queryKeys } from '@/lib/query-keys';

export function useArticles(params?: ArticlesParams) {
  return useQuery({
    queryKey: queryKeys.articles.list(params),
    queryFn: () => getArticles(params),
  });
}

export function useArticle(slug: string) {
  return useQuery({
    queryKey: queryKeys.articles.bySlug(slug),
    queryFn: () => getArticleBySlug(slug),
    enabled: !!slug,
  });
}
