/**
 * PW-042-D3 | Таб «Ошибки» — таблица ошибок API, фильтры, traceback.
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
import {
  AlertTriangle,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  Info,
  XCircle,
} from 'lucide-react';
import type {
  ErrorLogEntry,
  ErrorStats,
  ErrorFilters,
  ErrorLevel,
  LoadMoreState,
} from '../monitoring.types';
import { formatDate, PER_PAGE_OPTIONS } from '../monitoring.utils';
import { RequestDetailDialog, type RequestDetail } from './RequestDetailDialog';

interface ErrorsTabProps {
  errors: ErrorLogEntry[];
  total: number;
  stats: ErrorStats | null;
  filters: ErrorFilters;
  onFiltersChange: (f: ErrorFilters) => void;
  loadMore: LoadMoreState;
  hasMore: boolean;
  onLoadMore: () => void;
  onPerPageChange: (perPage: number) => void;
  onResolve: (id: string) => void;
}

const LEVEL_LABELS: Record<ErrorLevel, string> = {
  warning: 'Предупреждение',
  error: 'Ошибка',
  critical: 'Критическая',
};

function levelBadge(level: ErrorLevel) {
  const config = {
    warning: {
      variant: 'default' as const,
      className:
        'bg-amber-500/15 text-amber-600 border-amber-500/25 hover:bg-amber-500/15',
      icon: <AlertTriangle className='size-3 mr-1' />,
    },
    error: {
      variant: 'destructive' as const,
      className: '',
      icon: <XCircle className='size-3 mr-1' />,
    },
    critical: {
      variant: 'destructive' as const,
      className: 'bg-red-700 hover:bg-red-700',
      icon: <XCircle className='size-3 mr-1' />,
    },
  };
  const c = config[level];
  return (
    <Badge variant={c.variant} className={c.className}>
      {c.icon}
      {LEVEL_LABELS[level]}
    </Badge>
  );
}

export function ErrorsTab({
  errors,
  total,
  stats,
  filters,
  onFiltersChange,
  loadMore,
  hasMore,
  onLoadMore,
  onPerPageChange,
  onResolve,
}: ErrorsTabProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [detailEntry, setDetailEntry] = useState<RequestDetail | null>(null);

  return (
    <div className='flex flex-col flex-1 min-h-0 gap-4'>
      <Card className='flex-1 min-h-0 flex flex-col'>
        <CardHeader className='py-2 px-4'>
          <div className='flex items-center gap-2 flex-wrap'>
            <CardTitle className='text-base'>Журнал ошибок</CardTitle>

            {stats && (
              <div className='flex items-center gap-3 mr-auto ml-4 text-xs text-muted-foreground bg-muted/50 rounded-md px-3 py-1'>
                <span>
                  24ч:{' '}
                  <span className='font-medium text-foreground'>
                    {stats.last24h}
                  </span>
                </span>
                <span>
                  7д:{' '}
                  <span className='font-medium text-foreground'>
                    {stats.last7d}
                  </span>
                </span>
                <span>
                  30д:{' '}
                  <span className='font-medium text-foreground'>
                    {stats.last30d}
                  </span>
                </span>
              </div>
            )}
            {!stats && <div className='mr-auto' />}

            <Select
              value={filters.level ?? 'all'}
              onValueChange={v =>
                onFiltersChange({
                  ...filters,
                  level: v === 'all' ? null : (v as ErrorLevel),
                })
              }
            >
              <SelectTrigger className='w-[130px] shrink-0 h-7 text-xs'>
                <SelectValue placeholder='Уровень' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='all'>Все уровни</SelectItem>
                <SelectItem value='warning'>Предупреждение</SelectItem>
                <SelectItem value='error'>Ошибка</SelectItem>
                <SelectItem value='critical'>Критическая</SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={
                filters.resolved === null
                  ? 'all'
                  : filters.resolved
                    ? 'resolved'
                    : 'unresolved'
              }
              onValueChange={v =>
                onFiltersChange({
                  ...filters,
                  resolved: v === 'all' ? null : v === 'resolved',
                })
              }
            >
              <SelectTrigger className='w-[130px] shrink-0 h-7 text-xs'>
                <SelectValue placeholder='Статус' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='all'>Все</SelectItem>
                <SelectItem value='unresolved'>Не решённые</SelectItem>
                <SelectItem value='resolved'>Решённые</SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={filters.dateRange}
              onValueChange={v =>
                onFiltersChange({
                  ...filters,
                  dateRange: v as ErrorFilters['dateRange'],
                })
              }
            >
              <SelectTrigger className='w-[110px] shrink-0 h-7 text-xs'>
                <SelectValue placeholder='Период' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='all'>Всё время</SelectItem>
                <SelectItem value='24h'>24 часа</SelectItem>
                <SelectItem value='7d'>7 дней</SelectItem>
                <SelectItem value='30d'>30 дней</SelectItem>
              </SelectContent>
            </Select>

            <span className='text-xs text-muted-foreground shrink-0'>
              {total}
            </span>
            <Select
              value={String(loadMore.perPage)}
              onValueChange={v => onPerPageChange(Number(v))}
            >
              <SelectTrigger className='w-[68px] shrink-0 h-7 text-xs'>
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
                  <TableHead className='w-[130px]'>Уровень</TableHead>
                  <TableHead className='w-[140px]'>Пользователь</TableHead>
                  <TableHead>Событие</TableHead>
                  <TableHead className='w-[180px]'>Путь</TableHead>
                  <TableHead className='w-[60px]'>Код</TableHead>
                  <TableHead className='w-[80px]'>Статус</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {errors.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className='text-center py-8'>
                      <p className='text-sm text-muted-foreground'>
                        Ошибок не найдено
                      </p>
                    </TableCell>
                  </TableRow>
                ) : (
                  errors.map(entry => (
                    <Fragment key={entry.id}>
                      <TableRow
                        className='cursor-pointer hover:bg-muted/50'
                        onClick={() =>
                          setExpandedId(
                            expandedId === entry.id ? null : entry.id
                          )
                        }
                      >
                        <TableCell className='px-2'>
                          {expandedId === entry.id ? (
                            <ChevronDown className='size-4 text-muted-foreground' />
                          ) : (
                            <ChevronRight className='size-4 text-muted-foreground' />
                          )}
                        </TableCell>
                        <TableCell className='text-xs font-mono'>
                          {formatDate(entry.timestamp)}
                        </TableCell>
                        <TableCell>{levelBadge(entry.level)}</TableCell>
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
                              —
                            </span>
                          )}
                        </TableCell>
                        <TableCell className='text-sm font-medium truncate max-w-[200px]'>
                          {entry.event}
                        </TableCell>
                        <TableCell className='text-xs font-mono text-muted-foreground truncate max-w-[200px]'>
                          {entry.requestMethod} {entry.requestPath}
                        </TableCell>
                        <TableCell className='text-xs font-mono'>
                          {entry.statusCode}
                        </TableCell>
                        <TableCell>
                          {entry.resolved ? (
                            <CheckCircle2 className='size-4 text-emerald-500' />
                          ) : (
                            <XCircle className='size-4 text-muted-foreground' />
                          )}
                        </TableCell>
                      </TableRow>

                      {/* Развёрнутая строка */}
                      {expandedId === entry.id && (
                        <TableRow>
                          <TableCell colSpan={8} className='bg-muted/30 p-4'>
                            <div className='space-y-3'>
                              <p className='text-sm font-medium'>
                                {entry.message}
                              </p>

                              {entry.traceback && (
                                <pre className='text-xs bg-muted p-3 rounded overflow-x-auto max-h-[300px] overflow-y-auto font-mono'>
                                  {entry.traceback}
                                </pre>
                              )}

                              {entry.context && (
                                <div>
                                  <p className='text-xs font-medium text-muted-foreground mb-1'>
                                    Контекст:
                                  </p>
                                  <pre className='text-xs bg-muted p-3 rounded font-mono'>
                                    {JSON.stringify(entry.context, null, 2)}
                                  </pre>
                                </div>
                              )}

                              <div className='flex items-center gap-2'>
                                <Button
                                  size='sm'
                                  variant='ghost'
                                  className='text-xs'
                                  onClick={e => {
                                    e.stopPropagation();
                                    setDetailEntry(entry);
                                  }}
                                >
                                  <Info className='size-3.5 mr-1.5' />
                                  Подробности запроса
                                </Button>

                                {!entry.resolved && (
                                  <Button
                                    size='sm'
                                    variant='outline'
                                    onClick={e => {
                                      e.stopPropagation();
                                      onResolve(entry.id);
                                    }}
                                  >
                                    <CheckCircle2 className='size-4 mr-2' />
                                    Пометить решённой
                                  </Button>
                                )}
                              </div>
                            </div>
                          </TableCell>
                        </TableRow>
                      )}
                    </Fragment>
                  ))
                )}
                {hasMore && (
                  <TableRow>
                    <TableCell colSpan={8} className='text-center py-3'>
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
