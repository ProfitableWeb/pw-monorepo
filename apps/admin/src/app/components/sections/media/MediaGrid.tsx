import { cn } from '@/app/components/ui/utils';
import { Button } from '@/app/components/ui/button';
import { Badge } from '@/app/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/app/components/ui/dropdown-menu';
import {
  MoreVertical,
  Download,
  Trash2,
  Copy,
  ExternalLink,
  Check,
  ChevronDown,
  Loader2,
} from 'lucide-react';
import { MediaImageWithLoader } from './MediaImageWithLoader';
import {
  formatBytes,
  formatDuration,
  getFileIcon,
  handleCopyUrl,
  downloadFile,
} from './media.utils';
import type { MediaFile } from './media.types';

interface MediaGridProps {
  files: MediaFile[];
  selectedFiles: string[];
  hasMore: boolean;
  isFetchingMore: boolean;
  onFileSelect: (id: string) => void;
  onPreview: (file: MediaFile) => void;
  onDelete: (id: string) => void;
  onLoadMore: () => void;
}

/** Сетка файлов (grid view) */
export function MediaGrid({
  files,
  selectedFiles,
  hasMore,
  isFetchingMore,
  onFileSelect,
  onPreview,
  onDelete,
  onLoadMore,
}: MediaGridProps) {
  return (
    <>
      <div className='grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-3 lg:gap-4'>
        {files.map(file => {
          const Icon = getFileIcon(file.type);
          const isSelected = selectedFiles.includes(file.id);

          return (
            <div
              key={file.id}
              role='button'
              tabIndex={0}
              aria-label={`${file.name}, ${formatBytes(file.size)}`}
              className={cn(
                'group relative border rounded-lg overflow-hidden bg-card transition-all cursor-pointer hover:shadow-md',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
                isSelected && 'ring-2 ring-primary'
              )}
              onClick={() => onPreview(file)}
              onKeyDown={e => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  onPreview(file);
                }
              }}
            >
              {/* Чекбокс выбора */}
              <div
                className='absolute top-2 left-2 z-10'
                onClick={e => e.stopPropagation()}
              >
                <button
                  onClick={() => onFileSelect(file.id)}
                  className={cn(
                    'w-5 h-5 rounded border-2 flex items-center justify-center transition-all',
                    isSelected
                      ? 'bg-primary border-primary'
                      : 'bg-background/80 border-muted-foreground/50 opacity-0 group-hover:opacity-100'
                  )}
                >
                  {isSelected && (
                    <Check className='h-3 w-3 text-primary-foreground' />
                  )}
                </button>
              </div>

              {/* Миниатюра */}
              <div
                className={cn(
                  'aspect-square bg-muted flex items-center justify-center relative overflow-hidden transition-opacity',
                  isSelected && 'opacity-60'
                )}
              >
                {file.type === 'image' ? (
                  <MediaImageWithLoader
                    src={file.url}
                    alt={file.name}
                    className='w-full h-full object-cover'
                  />
                ) : (
                  <Icon className='h-12 w-12 lg:h-16 lg:w-16 text-muted-foreground' />
                )}

                {(file.type === 'video' || file.type === 'audio') &&
                  file.duration && (
                    <div className='absolute bottom-2 right-2 px-1.5 py-0.5 bg-black/70 text-white text-xs rounded'>
                      {formatDuration(file.duration)}
                    </div>
                  )}
              </div>

              {/* Информация */}
              <div className='p-2 lg:p-3'>
                <p
                  className='text-xs lg:text-sm font-medium truncate'
                  title={file.name}
                >
                  {file.name}
                </p>
                <div className='flex items-center justify-between mt-1 text-xs text-muted-foreground'>
                  <span>{formatBytes(file.size)}</span>
                  {file.usedIn > 0 && (
                    <Badge variant='secondary' className='text-xs px-1.5 py-0'>
                      {file.usedIn}
                    </Badge>
                  )}
                </div>
              </div>

              {/* Быстрые действия */}
              <div
                className='absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity'
                onClick={e => e.stopPropagation()}
              >
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      size='icon'
                      variant='secondary'
                      className='h-7 w-7 bg-background/80 backdrop-blur-sm'
                    >
                      <MoreVertical className='h-3.5 w-3.5' />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align='end'>
                    <DropdownMenuItem onClick={() => handleCopyUrl(file.url)}>
                      <Copy className='h-4 w-4 mr-2' />
                      Копировать URL
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => downloadFile(file.url, file.name)}
                    >
                      <Download className='h-4 w-4 mr-2' />
                      Скачать
                    </DropdownMenuItem>
                    {file.type === 'image' && (
                      <DropdownMenuItem
                        onClick={() => window.open(file.url, '_blank')}
                      >
                        <ExternalLink className='h-4 w-4 mr-2' />
                        Открыть в новой вкладке
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      className='text-destructive'
                      onClick={() => onDelete(file.id)}
                    >
                      <Trash2 className='h-4 w-4 mr-2' />
                      Удалить
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          );
        })}
      </div>

      {/* Загрузить ещё */}
      {hasMore && (
        <div className='flex justify-center pt-4'>
          <Button
            variant='outline'
            onClick={onLoadMore}
            disabled={isFetchingMore}
          >
            {isFetchingMore ? (
              <Loader2 className='h-4 w-4 mr-2 animate-spin' />
            ) : (
              <ChevronDown className='h-4 w-4 mr-2' />
            )}
            {isFetchingMore ? 'Загрузка...' : 'Загрузить ещё'}
          </Button>
        </div>
      )}
    </>
  );
}
