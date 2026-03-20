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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/app/components/ui/table';
import { MoreHorizontal, ExternalLink, Eye, Edit, Trash2 } from 'lucide-react';
import { formatDate } from '@/app/components/common';
import { WEB_URL } from '../../article-workbench/preview/preview.types';
import type { Article } from '../articles.types';
import { getStatusColor, getStatusLabel } from '../articles.utils';

interface ArticlesTableProps {
  articles: Article[];
  onEdit: (articleId: string) => void;
  onViewAuthor: (authorId: string) => void;
}

export function ArticlesTable({
  articles,
  onEdit,
  onViewAuthor,
}: ArticlesTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Заголовок</TableHead>
          <TableHead>Автор</TableHead>
          <TableHead>Статус</TableHead>
          <TableHead>Категория</TableHead>
          <TableHead>Просмотры</TableHead>
          <TableHead>Дата</TableHead>
          <TableHead className='text-right'>Действия</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {articles.length === 0 ? (
          <TableRow>
            <TableCell
              colSpan={7}
              className='text-center h-24 text-muted-foreground'
            >
              Статьи не найдены
            </TableCell>
          </TableRow>
        ) : (
          articles.map(article => (
            <TableRow key={article.id}>
              <TableCell className='font-medium max-w-md truncate'>
                <button
                  onClick={() => onEdit(article.id)}
                  className='hover:underline text-left'
                >
                  {article.title}
                </button>
              </TableCell>
              <TableCell>
                {article.authorId ? (
                  <button
                    onClick={() => onViewAuthor(article.authorId)}
                    className='hover:underline text-left'
                  >
                    {article.author}
                  </button>
                ) : (
                  article.author
                )}
              </TableCell>
              <TableCell>
                <Badge className={getStatusColor(article.status)}>
                  {getStatusLabel(article.status)}
                </Badge>
              </TableCell>
              <TableCell>{article.category}</TableCell>
              <TableCell>
                <div className='flex items-center gap-1'>
                  <Eye className='h-3 w-3 text-muted-foreground' />
                  {article.views.toLocaleString()}
                </div>
              </TableCell>
              <TableCell>{formatDate(article.date)}</TableCell>
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
                    <DropdownMenuItem asChild>
                      <a
                        href={`${WEB_URL}/${article.slug}`}
                        target='_blank'
                        rel='noopener noreferrer'
                      >
                        <ExternalLink className='mr-2 h-4 w-4' />
                        Просмотр на сайте
                      </a>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onEdit(article.id)}>
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
          ))
        )}
      </TableBody>
    </Table>
  );
}
