import { useHeaderStore } from '@/app/store/header-store';
import { useNavigationStore } from '@/app/store/navigation-store';
import { breadcrumbPresets } from '@/app/utils/breadcrumbs-helper';
import {
  useAdminArticles,
  useAdminArticleStats,
  useAdminCategories,
} from '@/hooks/api';
import { useState, useEffect, useMemo } from 'react';
import { Button } from '@/app/components/ui/button';
import { Plus } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/app/components/ui/card';
import { LoadingSpinner } from '@/app/components/common';

import type { Article } from './articles.types';
import { VALID_STATUSES } from './articles.constants';
import { StatsCards } from './assets/StatsCards';
import { FiltersToolbar } from './assets/FiltersToolbar';
import { ArticlesTable } from './assets/ArticlesTable';

export function ArticlesSection() {
  const { navigateToArticleEditor, navigateToUserProfile } =
    useNavigationStore();
  const { data: apiCategories } = useAdminCategories();

  // --- Server-side filter state ---
  const [searchInput, setSearchInput] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string | undefined>();
  const [selectedCategory, setSelectedCategory] = useState<
    string | undefined
  >();

  // Debounce search input 300ms
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(searchInput), 300);
    return () => clearTimeout(timer);
  }, [searchInput]);

  // Map category name → slug for API
  const categorySlugMap = useMemo(() => {
    const map = new Map<string, string>();
    for (const c of apiCategories ?? []) {
      map.set(c.name, c.slug);
    }
    return map;
  }, [apiCategories]);

  const categoryNames = useMemo(
    () => (apiCategories ?? []).map(c => c.name),
    [apiCategories]
  );

  // Build API params
  const apiParams = useMemo(
    () => ({
      limit: 100,
      type: 'article' as const,
      search: debouncedSearch || undefined,
      status: selectedStatus,
      category: selectedCategory
        ? categorySlugMap.get(selectedCategory)
        : undefined,
    }),
    [debouncedSearch, selectedStatus, selectedCategory, categorySlugMap]
  );

  const { data: adminResult, isLoading } = useAdminArticles(apiParams);
  const { data: stats } = useAdminArticleStats();

  const articles: Article[] = useMemo(
    () =>
      (adminResult?.data ?? []).map(a => ({
        id: a.id,
        title: a.title,
        slug: a.slug,
        status: (VALID_STATUSES.has(a.status)
          ? a.status
          : 'draft') as Article['status'],
        category: a.primaryCategory.name,
        author: a.author?.name ?? '—',
        authorId: a.author?.id ?? '',
        views: a.views,
        date: a.publishedAt ?? '',
      })),
    [adminResult]
  );

  const { setBreadcrumbs, reset } = useHeaderStore();

  useEffect(() => {
    setBreadcrumbs(breadcrumbPresets.articles());
    return () => reset();
  }, [setBreadcrumbs, reset]);

  useEffect(() => {
    useHeaderStore.setState({ title: 'Управление статьями' });
  }, []);

  const clearAllFilters = () => {
    setSelectedStatus(undefined);
    setSelectedCategory(undefined);
    setSearchInput('');
  };

  const totalArticles = stats?.total ?? articles.length;
  const publishedCount = stats?.published ?? 0;
  const draftCount = stats?.draft ?? 0;
  const totalViews = stats?.views ?? 0;

  return (
    <div className='p-6 space-y-6'>
      {/* Заголовок */}
      <div className='flex items-center justify-between'>
        <div>
          <h1 className='text-3xl font-bold'>Управление статьями</h1>
          <p className='text-muted-foreground mt-1'>
            {isLoading
              ? 'Загрузка...'
              : `${totalArticles} статей • ${publishedCount} опубликовано • ${draftCount} черновиков • ${totalViews.toLocaleString()} просмотров`}
          </p>
        </div>
        <Button onClick={() => navigateToArticleEditor()}>
          <Plus className='h-4 w-4 mr-2' />
          Новая статья
        </Button>
      </div>

      {/* Карточки статистики */}
      <StatsCards
        total={totalArticles}
        publishedCount={publishedCount}
        draftCount={draftCount}
        totalViews={totalViews}
      />

      {/* Фильтры и таблица */}
      <Card className='sticky top-16 z-10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80'>
        <CardHeader>
          <FiltersToolbar
            searchQuery={searchInput}
            onSearchChange={setSearchInput}
            selectedStatus={selectedStatus}
            onStatusChange={setSelectedStatus}
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
            categoryNames={categoryNames}
            onClearAll={clearAllFilters}
          />
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <LoadingSpinner label='Загрузка статей...' size='size-5' />
          ) : (
            <ArticlesTable
              articles={articles}
              onEdit={articleId => navigateToArticleEditor(articleId)}
              onViewAuthor={authorId => navigateToUserProfile(authorId)}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
