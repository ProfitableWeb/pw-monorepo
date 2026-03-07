import { useArticles } from '@/hooks/api';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/app/components/ui/table';
import { Badge } from '@/app/components/ui/badge';
import { Button } from '@/app/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/app/components/ui/dropdown-menu';
import { MoreHorizontal, Eye, Edit, Trash2, Loader2 } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/app/components/ui/card';

const statusVariant = {
  published: 'default',
  draft: 'secondary',
} as const;

const statusLabel = {
  published: 'Опубликован',
  draft: 'Черновик',
};

type PostStatus = keyof typeof statusVariant;

export function PostsTable() {
  const { data: result, isLoading } = useArticles({ limit: 5 });

  const posts = (result?.data ?? []).map(a => ({
    id: a.id,
    title: a.title,
    status: (a.publishedAt ? 'published' : 'draft') as PostStatus,
    category: a.category,
    views: a.views,
    date: a.publishedAt ?? '',
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Последние статьи</CardTitle>
        <CardDescription>Управление вашими публикациями</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className='flex items-center justify-center py-8 text-muted-foreground'>
            <Loader2 className='h-5 w-5 animate-spin mr-2' />
            Загрузка...
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Заголовок</TableHead>
                <TableHead>Статус</TableHead>
                <TableHead>Категория</TableHead>
                <TableHead>Просмотры</TableHead>
                <TableHead>Дата</TableHead>
                <TableHead className='text-right'>Действия</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {posts.map(post => (
                <TableRow key={post.id}>
                  <TableCell className='font-medium max-w-md truncate'>
                    {post.title}
                  </TableCell>
                  <TableCell>
                    <Badge variant={statusVariant[post.status]}>
                      {statusLabel[post.status]}
                    </Badge>
                  </TableCell>
                  <TableCell>{post.category}</TableCell>
                  <TableCell>
                    <div className='flex items-center gap-1'>
                      <Eye className='h-3 w-3 text-muted-foreground' />
                      {post.views.toLocaleString()}
                    </div>
                  </TableCell>
                  <TableCell>
                    {post.date
                      ? new Date(post.date).toLocaleDateString('ru-RU')
                      : '—'}
                  </TableCell>
                  <TableCell className='text-right'>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant='ghost' className='h-8 w-8 p-0'>
                          <span className='sr-only'>Открыть меню</span>
                          <MoreHorizontal className='h-4 w-4' />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align='end'>
                        <DropdownMenuLabel>Действия</DropdownMenuLabel>
                        <DropdownMenuItem>
                          <Eye className='mr-2 h-4 w-4' />
                          Просмотр
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Edit className='mr-2 h-4 w-4' />
                          Редактировать
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className='text-destructive'>
                          <Trash2 className='mr-2 h-4 w-4' />
                          Удалить
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}
