import { useEffect, useMemo } from 'react';
import { useHeaderStore } from '@/app/store/header-store';
import { useNavigationStore } from '@/app/store/navigation-store';
import { breadcrumbPresets } from '@/app/utils/breadcrumbs-helper';
import { useAdminArticles } from '@/hooks/api';
import { Button } from '@/app/components/ui/button';
import { Badge } from '@/app/components/ui/badge';
import { Card, CardContent, CardHeader } from '@/app/components/ui/card';
import { LoadingSpinner } from '@/app/components/common';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/app/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/app/components/ui/dropdown-menu';
import { Plus, MoreHorizontal, Edit, ExternalLink } from 'lucide-react';
import { formatDate } from '@/app/components/common';
import { getStatusColor, getStatusLabel } from '../articles/articles.utils';
import { WEB_URL } from '../article-workbench/preview/preview.types';

export function PagesSection() {
  const { navigateToArticleEditor } = useNavigationStore();
  const { setBreadcrumbs, reset } = useHeaderStore();

  useEffect(() => {
    setBreadcrumbs(breadcrumbPresets.articles());
    useHeaderStore.setState({ title: 'Страницы' });
    return () => reset();
  }, [setBreadcrumbs, reset]);

  const { data: result, isLoading } = useAdminArticles({
    type: 'page',
    limit: 100,
  });

  const pages = useMemo(() => result?.data ?? [], [result]);

  return (
    <div className='p-6 space-y-6'>
      <div className='flex items-center justify-between'>
        <div>
          <h1 className='text-3xl font-bold'>Страницы</h1>
          <p className='text-muted-foreground mt-1'>
            Статические страницы сайта ({pages.length})
          </p>
        </div>
        <Button onClick={() => navigateToArticleEditor()}>
          <Plus className='h-4 w-4 mr-2' />
          Новая страница
        </Button>
      </div>

      <Card>
        <CardContent className='pt-6'>
          {isLoading ? (
            <LoadingSpinner label='Загрузка страниц...' size='size-5' />
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Заголовок</TableHead>
                  <TableHead>Slug</TableHead>
                  <TableHead>Статус</TableHead>
                  <TableHead>Дата</TableHead>
                  <TableHead className='text-right'>Действия</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pages.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={5}
                      className='text-center h-24 text-muted-foreground'
                    >
                      Страницы не найдены
                    </TableCell>
                  </TableRow>
                ) : (
                  pages.map(page => (
                    <TableRow key={page.id}>
                      <TableCell className='font-medium'>
                        <button
                          onClick={() => navigateToArticleEditor(page.id)}
                          className='hover:underline text-left'
                        >
                          {page.title}
                        </button>
                      </TableCell>
                      <TableCell className='text-muted-foreground'>
                        /{page.slug}
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(page.status as any)}>
                          {getStatusLabel(page.status as any)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {page.publishedAt
                          ? formatDate(page.publishedAt)
                          : formatDate(page.createdAt)}
                      </TableCell>
                      <TableCell className='text-right'>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant='ghost' className='h-8 w-8 p-0'>
                              <MoreHorizontal className='h-4 w-4' />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align='end'>
                            <DropdownMenuItem asChild>
                              <a
                                href={`${WEB_URL}/${page.slug}`}
                                target='_blank'
                                rel='noopener noreferrer'
                              >
                                <ExternalLink className='mr-2 h-4 w-4' />
                                Просмотр на сайте
                              </a>
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => navigateToArticleEditor(page.id)}
                            >
                              <Edit className='mr-2 h-4 w-4' />
                              Редактировать
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
