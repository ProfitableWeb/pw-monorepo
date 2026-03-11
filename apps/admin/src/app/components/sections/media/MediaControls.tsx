import { Button } from '@/app/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/app/components/ui/dropdown-menu';
import {
  Upload,
  Grid3x3,
  List,
  Trash2,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Loader2,
} from 'lucide-react';
import { formatBytes, getFileIcon, pluralize } from './media.utils';
import type { ViewMode, MediaStatsResponse } from './media.types';

interface MediaControlsProps {
  totalFiles: number;
  /** Количество видимых (загруженных) файлов — для логики «Выбрать все» */
  visibleCount: number;
  stats?: MediaStatsResponse;
  selectedFiles: string[];
  viewMode: ViewMode;
  isUploading: boolean;
  sortBy: string;
  sortOrder: 'asc' | 'desc';
  onSort: (field: string) => void;
  onUpload: () => void;
  onBulkDelete: () => void;
  onSelectAll: () => void;
  onViewModeChange: (mode: ViewMode) => void;
}

const SORT_OPTIONS = [
  { field: 'created_at', label: 'По дате' },
  { field: 'filename', label: 'По имени' },
  { field: 'size', label: 'По размеру' },
];

const TYPE_NAMES: Record<string, string> = {
  image: 'Изображения',
  video: 'Видео',
  audio: 'Аудио',
  document: 'Документы',
};

/** Управление: заголовок, карточки статистики, сортировка, вид, выбор, загрузка */
export function MediaControls({
  totalFiles,
  visibleCount,
  stats,
  selectedFiles,
  viewMode,
  isUploading,
  sortBy,
  sortOrder,
  onSort,
  onUpload,
  onBulkDelete,
  onSelectAll,
  onViewModeChange,
}: MediaControlsProps) {
  const activeSortLabel =
    SORT_OPTIONS.find(o => o.field === sortBy)?.label ?? 'Сортировка';

  const SortIcon = sortOrder === 'asc' ? ArrowUp : ArrowDown;

  return (
    <>
      {/* Заголовок */}
      <div className='p-4 lg:p-6 border-b space-y-4 flex-shrink-0'>
        <div className='flex items-center justify-between'>
          <div>
            <h1 className='text-2xl font-semibold tracking-tight'>Медиатека</h1>
            <p className='text-sm text-muted-foreground mt-1'>
              {totalFiles} {pluralize(totalFiles, 'файл', 'файла', 'файлов')}
              {stats ? ` • ${formatBytes(stats.totalSize)} использовано` : ''}
            </p>
          </div>
          <Button onClick={onUpload} disabled={isUploading}>
            {isUploading ? (
              <Loader2 className='h-4 w-4 mr-2 animate-spin' />
            ) : (
              <Upload className='h-4 w-4 mr-2' />
            )}
            {isUploading ? 'Загрузка...' : 'Загрузить'}
          </Button>
        </div>

        {/* Карточки статистики */}
        {stats && (
          <div className='grid grid-cols-2 lg:grid-cols-4 gap-3'>
            {(['image', 'video', 'audio', 'document'] as const).map(type => {
              const Icon = getFileIcon(type);
              const count = stats.byType[type] ?? 0;
              return (
                <div key={type} className='p-3 border rounded-lg bg-card'>
                  <div className='flex items-center gap-2 text-muted-foreground mb-1'>
                    <Icon className='h-4 w-4' />
                    <span className='text-xs font-medium'>
                      {TYPE_NAMES[type]}
                    </span>
                  </div>
                  <p className='text-lg font-semibold'>{count}</p>
                </div>
              );
            })}
          </div>
        )}

        {/* Управление */}
        <div className='flex items-center gap-2'>
          {selectedFiles.length > 0 && (
            <>
              <Button
                size='sm'
                variant='outline'
                onClick={onBulkDelete}
                className='text-destructive'
              >
                <Trash2 className='h-4 w-4 mr-2' />
                Удалить ({selectedFiles.length})
              </Button>
              <div className='h-4 w-px bg-border' />
            </>
          )}

          {visibleCount > 0 && (
            <Button size='sm' variant='outline' onClick={onSelectAll}>
              {selectedFiles.length === visibleCount
                ? 'Снять все'
                : 'Выбрать все'}
            </Button>
          )}

          <div className='flex-1' />

          {/* Сортировка */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button size='sm' variant='outline' className='gap-1.5'>
                <ArrowUpDown className='h-3.5 w-3.5' />
                {activeSortLabel}
                <SortIcon className='h-3 w-3 ml-0.5' />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align='end'>
              {SORT_OPTIONS.map(opt => (
                <DropdownMenuItem
                  key={opt.field}
                  onClick={() => onSort(opt.field)}
                  className={sortBy === opt.field ? 'font-medium' : ''}
                >
                  {opt.label}
                  {sortBy === opt.field && (
                    <SortIcon className='h-3 w-3 ml-auto' />
                  )}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Вид */}
          <div className='flex items-center gap-1 border rounded-lg p-1'>
            <Button
              size='sm'
              variant={viewMode === 'grid' ? 'default' : 'ghost'}
              onClick={() => onViewModeChange('grid')}
              className='h-7 w-7 p-0'
            >
              <Grid3x3 className='h-4 w-4' />
            </Button>
            <Button
              size='sm'
              variant={viewMode === 'list' ? 'default' : 'ghost'}
              onClick={() => onViewModeChange('list')}
              className='h-7 w-7 p-0'
            >
              <List className='h-4 w-4' />
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
