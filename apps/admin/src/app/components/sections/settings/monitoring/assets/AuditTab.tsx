/**
 * PW-042-D3 | Таб «Аудит» — таблица действий, фильтры, diff изменений.
 */

import { Fragment, useState } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/app/components/ui/card';
import { Badge } from '@/app/components/ui/badge';
import { Button } from '@/app/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/app/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/app/components/ui/table';
import { ScrollArea } from '@/app/components/ui/scroll-area';
import { ChevronDown, ChevronRight, Info } from 'lucide-react';
import type {
  AuditLogEntry,
  AuditFilters,
  LoadMoreState,
} from '../monitoring.types';
import { formatDate, PER_PAGE_OPTIONS } from '../monitoring.utils';
import { RequestDetailDialog, type RequestDetail } from './RequestDetailDialog';

interface AuditTabProps {
  entries: AuditLogEntry[];
  total: number;
  filters: AuditFilters;
  onFiltersChange: (f: AuditFilters) => void;
  loadMore: LoadMoreState;
  hasMore: boolean;
  onLoadMore: () => void;
  onPerPageChange: (perPage: number) => void;
  uniqueActions: string[];
  uniqueUsers: [string, string][];
}

/** Русское название действия */
function actionLabel(action: string): string {
  const map: Record<string, string> = {
    'article.created': 'Создание статьи',
    'article.updated': 'Обновление статьи',
    'article.published': 'Публикация статьи',
    'article.deleted': 'Удаление статьи',
    'media.uploaded': 'Загрузка файла',
    'media.deleted': 'Удаление файла',
    'auth.login': 'Вход в систему',
    'auth.login_failed': 'Неудачный вход',
    'auth.logout': 'Выход из системы',
    'user.role_changed': 'Смена роли',
    'category.created': 'Создание категории',
    'tag.created': 'Создание метки',
    'settings.updated': 'Изменение настроек',
    'storage.sync': 'Синхронизация',
  };
  return map[action] ?? action;
}

/** Цвет бэджа действия */
function actionBadge(action: string) {
  if (action.includes('delete'))
    return (
      <Badge variant='destructive' className='text-xs'>
        {actionLabel(action)}
      </Badge>
    );
  if (action.includes('login_failed'))
    return (
      <Badge
        variant='default'
        className='bg-amber-500/15 text-amber-600 border-amber-500/25 hover:bg-amber-500/15 text-xs'
      >
        {actionLabel(action)}
      </Badge>
    );
  return (
    <Badge variant='secondary' className='text-xs'>
      {actionLabel(action)}
    </Badge>
  );
}

/** Отображение diff: old → new */
function ChangesDiff({
  changes,
}: {
  changes: Record<string, { old: unknown; new: unknown }>;
}) {
  const entries = Object.entries(changes);
  if (entries.length === 0) return null;

  return (
    <div className='space-y-2'>
      <p className='text-xs font-medium text-muted-foreground'>Изменения:</p>
      <div className='space-y-1'>
        {entries.map(([field, { old: oldVal, new: newVal }]) => (
          <div key={field} className='text-xs font-mono bg-muted p-2 rounded'>
            <span className='text-muted-foreground'>{field}:</span>{' '}
            <span className='text-red-500 line-through'>
              {formatValue(oldVal)}
            </span>{' '}
            <span className='text-muted-foreground'>&rarr;</span>{' '}
            <span className='text-emerald-500'>{formatValue(newVal)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function formatValue(val: unknown): string {
  if (val === null || val === undefined) return 'null';
  if (typeof val === 'string') return `"${val}"`;
  if (Array.isArray(val)) return JSON.stringify(val);
  return String(val);
}

export function AuditTab({
  entries,
  total,
  filters,
  onFiltersChange,
  loadMore,
  hasMore,
  onLoadMore,
  onPerPageChange,
  uniqueActions,
  uniqueUsers,
}: AuditTabProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [detailEntry, setDetailEntry] = useState<RequestDetail | null>(null);

  return (
    <div className='flex flex-col flex-1 min-h-0 gap-4'>
      <Card className='flex-1 min-h-0 flex flex-col'>
        <CardHeader className='py-2 px-4'>
          <div className='flex items-center gap-2 flex-wrap'>
            <CardTitle className='text-base mr-auto'>Журнал аудита</CardTitle>

            <Select
              value={filters.action ?? 'all'}
              onValueChange={v =>
                onFiltersChange({ ...filters, action: v === 'all' ? null : v })
              }
            >
              <SelectTrigger className='w-[140px] h-7 text-xs'>
                <SelectValue placeholder='Действие' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='all'>Все действия</SelectItem>
                {uniqueActions.map(a => (
                  <SelectItem key={a} value={a}>
                    {actionLabel(a)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={filters.userId ?? 'all'}
              onValueChange={v =>
                onFiltersChange({ ...filters, userId: v === 'all' ? null : v })
              }
            >
              <SelectTrigger className='w-[140px] h-7 text-xs'>
                <SelectValue placeholder='Пользователь' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='all'>Все пользователи</SelectItem>
                {uniqueUsers.map(([id, name]) => (
                  <SelectItem key={id} value={id}>
                    {name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={filters.dateRange}
              onValueChange={v =>
                onFiltersChange({
                  ...filters,
                  dateRange: v as AuditFilters['dateRange'],
                })
              }
            >
              <SelectTrigger className='w-[110px] h-7 text-xs'>
                <SelectValue placeholder='Период' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='all'>Всё время</SelectItem>
                <SelectItem value='24h'>24 часа</SelectItem>
                <SelectItem value='7d'>7 дней</SelectItem>
                <SelectItem value='30d'>30 дней</SelectItem>
              </SelectContent>
            </Select>

            <span className='text-xs text-muted-foreground'>{total}</span>
            <Select
              value={String(loadMore.perPage)}
              onValueChange={v => onPerPageChange(Number(v))}
            >
              <SelectTrigger className='w-[60px] h-7 text-xs'>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {PER_PAGE_OPTIONS.map(n => (
                  <SelectItem key={n} value={String(n)}>
                    {n}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent className='p-0 flex-1 min-h-0 flex flex-col'>
          <ScrollArea className='flex-1 min-h-0 monitoring-table'>
            <Table>
              <TableHeader className='sticky top-0 z-10 bg-card shadow-[0_1px_0_0_var(--border)]'>
                <TableRow>
                  <TableHead className='w-8' />
                  <TableHead className='w-[100px]'>Дата</TableHead>
                  <TableHead className='w-[160px]'>Пользователь</TableHead>
                  <TableHead className='w-[180px]'>Действие</TableHead>
                  <TableHead>Ресурс</TableHead>
                  <TableHead className='w-[100px]'>Детали</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {entries.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className='text-center py-8'>
                      <p className='text-sm text-muted-foreground'>
                        Записей не найдено
                      </p>
                    </TableCell>
                  </TableRow>
                ) : (
                  entries.map(entry => (
                    <Fragment key={entry.id}>
                      <TableRow
                        className={`cursor-pointer hover:bg-muted/50 ${entry.changes ? '' : 'cursor-default'}`}
                        onClick={() => {
                          if (!entry.changes) return;
                          setExpandedId(
                            expandedId === entry.id ? null : entry.id
                          );
                        }}
                      >
                        <TableCell className='px-2'>
                          {entry.changes ? (
                            expandedId === entry.id ? (
                              <ChevronDown className='size-4 text-muted-foreground' />
                            ) : (
                              <ChevronRight className='size-4 text-muted-foreground' />
                            )
                          ) : (
                            <span className='size-4 block' />
                          )}
                        </TableCell>
                        <TableCell className='text-xs font-mono'>
                          {formatDate(entry.timestamp)}
                        </TableCell>
                        <TableCell>
                          {entry.userName ? (
                            <div>
                              <p className='text-sm font-medium'>
                                {entry.userName}
                              </p>
                              <p className='text-xs text-muted-foreground'>
                                {entry.userEmail}
                              </p>
                            </div>
                          ) : (
                            <span className='text-xs text-muted-foreground'>
                              Система
                            </span>
                          )}
                        </TableCell>
                        <TableCell>{actionBadge(entry.action)}</TableCell>
                        <TableCell className='text-xs'>
                          <span className='text-muted-foreground'>
                            {entry.resourceType}
                          </span>
                          {entry.resourceId && (
                            <code className='ml-1 font-mono text-[10px] bg-muted px-1 py-0.5 rounded'>
                              {entry.resourceId.slice(0, 8)}...
                            </code>
                          )}
                        </TableCell>
                        <TableCell>
                          <Button
                            size='sm'
                            variant='ghost'
                            className='text-xs h-auto py-1 px-2'
                            onClick={e => {
                              e.stopPropagation();
                              setDetailEntry(entry);
                            }}
                          >
                            <Info className='size-3 mr-1' />
                            Инфо
                          </Button>
                        </TableCell>
                      </TableRow>

                      {/* Развёрнутая строка — diff */}
                      {expandedId === entry.id && entry.changes && (
                        <TableRow>
                          <TableCell colSpan={6} className='bg-muted/30 p-4'>
                            <ChangesDiff changes={entry.changes} />
                            {entry.requestId && (
                              <p className='text-xs text-muted-foreground mt-2'>
                                Request ID:{' '}
                                <code className='font-mono'>
                                  {entry.requestId}
                                </code>
                              </p>
                            )}
                          </TableCell>
                        </TableRow>
                      )}
                    </Fragment>
                  ))
                )}
                {hasMore && (
                  <TableRow>
                    <TableCell colSpan={6} className='text-center py-3'>
                      <Button variant='outline' size='sm' onClick={onLoadMore}>
                        Загрузить ещё
                      </Button>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </ScrollArea>
        </CardContent>
      </Card>

      {/* Модалка подробностей запроса */}
      <RequestDetailDialog
        open={detailEntry !== null}
        onOpenChange={open => !open && setDetailEntry(null)}
        detail={detailEntry}
      />
    </div>
  );
}
