import { useArticles, useCategories } from '@/hooks/api';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/app/components/ui/card';
import { FileText, FolderOpen, Eye, TrendingUp } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  description?: string;
}

function StatCard({ title, value, icon, description }: StatCardProps) {
  return (
    <Card>
      <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
        <CardTitle className='text-sm font-medium'>{title}</CardTitle>
        <div className='h-4 w-4 text-muted-foreground'>{icon}</div>
      </CardHeader>
      <CardContent>
        <div className='text-2xl font-bold'>{value}</div>
        {description && (
          <p className='text-xs text-muted-foreground mt-1'>{description}</p>
        )}
      </CardContent>
    </Card>
  );
}

export function BlogStats() {
  const { data: result, isLoading: articlesLoading } = useArticles();
  const { data: categories, isLoading: categoriesLoading } = useCategories();

  const isLoading = articlesLoading || categoriesLoading;
  const articles = result?.data ?? [];
  const totalArticles = result?.meta.total ?? articles.length;
  const publishedCount = articles.filter(a => a.publishedAt).length;
  const draftCount = articles.filter(a => !a.publishedAt).length;
  const totalCategories = categories?.length ?? 0;

  const stats = [
    {
      title: 'Всего статей',
      value: isLoading ? '...' : String(totalArticles),
      icon: <FileText className='h-4 w-4' />,
      description: isLoading
        ? undefined
        : `${publishedCount} опубликовано, ${draftCount} черновиков`,
    },
    {
      title: 'Категорий',
      value: isLoading ? '...' : String(totalCategories),
      icon: <FolderOpen className='h-4 w-4' />,
    },
    {
      title: 'Просмотры',
      value: '—',
      icon: <Eye className='h-4 w-4' />,
      description: 'Требуется API статистики',
    },
    {
      title: 'Вовлеченность',
      value: '—',
      icon: <TrendingUp className='h-4 w-4' />,
      description: 'Требуется API статистики',
    },
  ];

  return (
    <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-4'>
      {stats.map(stat => (
        <StatCard key={stat.title} {...stat} />
      ))}
    </div>
  );
}
