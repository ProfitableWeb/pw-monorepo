import { cn } from '@/app/components/ui/utils';
import { Button } from '@/app/components/ui/button';
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
  Check,
  RefreshCw,
} from 'lucide-react';
import { MediaImageWithLoader } from './MediaImageWithLoader';
import { formatBytes, getFileIcon, handleCopyUrl } from './media.utils';
import type { MediaFile } from './media.types';

interface MediaListProps {
  files: MediaFile[];
  selectedFiles: string[];
  hasMore: boolean;
  onFileSelect: (id: string) => void;
  onPreview: (file: MediaFile) => void;
  onDelete: (id: string) => void;
  onLoadMore: () => void;
}

/** Список файлов (list view) */
export function MediaList({
  files,
  selectedFiles,
  hasMore,
  onFileSelect,
  onPreview,
  onDelete,
  onLoadMore,
}: MediaListProps) {
  return (
    <div className='space-y-2'>
      {files.map(file => {
        const Icon = getFileIcon(file.type);
        const isSelected = selectedFiles.includes(file.id);

        return (
          <div
            key={file.id}
            className={cn(
              'group flex items-center gap-4 p-3 border rounded-lg bg-card transition-all cursor-pointer hover:shadow-sm',
              isSelected && 'ring-2 ring-primary'
            )}
            onClick={() => onPreview(file)}
          >
            {/* Чекбокс выбора */}
            <div onClick={e => e.stopPropagation()}>
              <button
                onClick={() => onFileSelect(file.id)}
                className={cn(
                  'w-5 h-5 rounded border-2 flex items-center justify-center transition-all',
                  isSelected
                    ? 'bg-primary border-primary'
                    : 'bg-background border-muted-foreground/50'
                )}
              >
                {isSelected && (
                  <Check className='h-3 w-3 text-primary-foreground' />
                )}
              </button>
            </div>

            {/* Миниатюра */}
            <div className='w-16 h-16 bg-muted rounded flex items-center justify-center flex-shrink-0 overflow-hidden'>
              {file.type === 'image' ? (
                <MediaImageWithLoader
                  src={file.url}
                  alt={file.name}
                  className='w-full h-full object-cover'
                />
              ) : (
                <Icon className='h-8 w-8 text-muted-foreground' />
              )}
            </div>

            {/* Информация */}
            <div className='flex-1 min-w-0'>
              <p className='font-medium truncate'>{file.name}</p>
              <div className='flex items-center gap-3 mt-1 text-sm text-muted-foreground'>
                <span>{formatBytes(file.size)}</span>
                <span>•</span>
                <span>{file.uploadedAt.toLocaleDateString('ru-RU')}</span>
                {file.usedIn > 0 && (
                  <>
                    <span>•</span>
                    <span>Использован: {file.usedIn}</span>
                  </>
                )}
              </div>
            </div>

            {/* Действия */}
            <div onClick={e => e.stopPropagation()}>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button size='icon' variant='ghost' className='h-8 w-8'>
                    <MoreVertical className='h-4 w-4' />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align='end'>
                  <DropdownMenuItem onClick={() => handleCopyUrl(file.url)}>
                    <Copy className='h-4 w-4 mr-2' />
                    Копировать URL
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Download className='h-4 w-4 mr-2' />
                    Скачать
                  </DropdownMenuItem>
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

      {/* Загрузить ещё */}
      {hasMore && (
        <div className='flex justify-center pt-4'>
          <Button variant='outline' onClick={onLoadMore}>
            <RefreshCw className='h-4 w-4 mr-2' />
            Загрузить ещё
          </Button>
        </div>
      )}
    </div>
  );
}
