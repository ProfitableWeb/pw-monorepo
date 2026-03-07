import { useHeaderStore } from '@/app/store/header-store';
import { useNavigationStore } from '@/app/store/navigation-store';
import { breadcrumbPresets } from '@/app/utils/breadcrumbs-helper';
import { useArticles, useCategories } from '@/hooks/api';
import { useState, useEffect, useMemo } from 'react';
import { Button } from '@/app/components/ui/button';
import { Plus, Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/app/components/ui/card';

import type { Article } from './articles.types';
import { filterArticles } from './articles.utils';
import { StatsCards } from './assets/StatsCards';
import { FiltersToolbar } from './assets/FiltersToolbar';
import { ArticlesTable } from './assets/ArticlesTable';

export function ArticlesSection() {
  const { data: result, isLoading } = useArticles();
  const { data: apiCategories } = useCategories();
  const { navigateTo } = useNavigationStore();

  const articles: Article[] = useMemo(
    () =>
      (result?.data ?? []).map(a => ({
        id: a.id,
        title: a.title,
        status: (a.publishedAt ? 'published' : 'draft') as Article['status'],
        category: a.category,
        author: a.author ?? '—',
        views: a.views,
        date: a.publishedAt ?? '',
      })),
    [result]
  );

  const categoryNames = useMemo(
    () => (apiCategories ?? []).map(c => c.name),
    [apiCategories]
  );

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [dateRange, setDateRange] = useState<{ from?: Date; to?: Date }>({});

  const { setBreadcrumbs, reset } = useHeaderStore();

  useEffect(() => {
    setBreadcrumbs(breadcrumbPresets.articles());
    return () => reset();
  }, [setBreadcrumbs, reset]);

  const toggleStatus = (status: string) => {
    setSelectedStatuses(prev =>
      prev.includes(status) ? prev.filter(s => s !== status) : [...prev, status]
    );
  };

  const toggleCategory = (category: string) => {
    setSelectedCategories(prev =>
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  const clearAllFilters = () => {
    setSelectedStatuses([]);
    setSelectedCategories([]);
    setDateRange({});
    setSearchQuery('');
  };

  const filteredArticles = filterArticles(
    articles,
    searchQuery,
    selectedStatuses,
    selectedCategories,
    dateRange
  );

  const publishedCount = articles.filter(a => a.status === 'published').length;
  const draftCount = articles.filter(a => a.status === 'draft').length;
  const totalViews = articles.reduce((sum, a) => sum + a.views, 0);

  useEffect(() => {
    useHeaderStore.setState({ title: 'Управление статьями' });
  }, []);

  return (
    <div className='p-6 space-y-6'>
      {/* Заголовок */}
      <div className='flex items-center justify-between'>
        <div>
          <h1 className='text-3xl font-bold'>Управление статьями</h1>
          <p className='text-muted-foreground mt-1'>
            {isLoading
              ? 'Загрузка...'
              : `${result?.meta.total ?? articles.length} статей • ${publishedCount} опубликовано • ${draftCount} черновиков • ${totalViews.toLocaleString()} просмотров`}
          </p>
        </div>
        <Button onClick={() => navigateTo('article-editor')}>
          <Plus className='h-4 w-4 mr-2' />
          Новая статья
        </Button>
      </div>

      {/* Карточки статистики */}
      <StatsCards
        total={result?.meta.total ?? articles.length}
        publishedCount={publishedCount}
        draftCount={draftCount}
        totalViews={totalViews}
      />

      {/* Фильтры и таблица */}
      <Card className='sticky top-16 z-10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80'>
        <CardHeader>
          <FiltersToolbar
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            selectedStatuses={selectedStatuses}
            onToggleStatus={toggleStatus}
            selectedCategories={selectedCategories}
            onToggleCategory={toggleCategory}
            categoryNames={categoryNames}
            dateRange={dateRange}
            onDateRangeChange={setDateRange}
            onClearAll={clearAllFilters}
          />
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className='flex items-center justify-center py-8 text-muted-foreground'>
              <Loader2 className='h-5 w-5 animate-spin mr-2' />
              Загрузка статей...
            </div>
          ) : (
            <ArticlesTable
              articles={filteredArticles}
              onEdit={() => navigateTo('article-editor')}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
