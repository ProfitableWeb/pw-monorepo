import { useHeaderStore } from '@/app/store/header-store';
import { breadcrumbPresets } from '@/app/utils/breadcrumbs-helper';

import { useState, useRef, useEffect, useCallback } from 'react';
import { Button } from '@/app/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/app/components/ui/alert-dialog';
import { ScrollArea } from '@/app/components/ui/scroll-area';
import { Loader2, ImageOff, Upload } from 'lucide-react';
import { toast } from 'sonner';

import {
  useMediaList,
  useMediaStats,
  useUploadMedia,
  useDeleteMedia,
} from '@/hooks/api';

import { MediaSidebar } from './MediaSidebar';
import { MediaControls } from './MediaControls';
import { MediaGrid } from './MediaGrid';
import { MediaList } from './MediaList';
import { MediaPreviewDialog } from './preview';
import { useFileDropZone } from './useFileDropZone';
import type { ViewMode, MediaFile } from './media.types';

export function MediaSection() {
  // --- UI state ---
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFiles, setSelectedFiles] = useState<string[]>([]);
  const [selectedFolder, setSelectedFolder] = useState('all');
  const [selectedFileType, setSelectedFileType] = useState('all');
  const [sortBy, setSortBy] = useState('created_at');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [previewFile, setPreviewFile] = useState<MediaFile | null>(null);

  // --- Delete confirmation state ---
  const [deleteTarget, setDeleteTarget] = useState<{
    ids: string[];
    label: string;
  } | null>(null);

  // --- Upload ref ---
  const fileInputRef = useRef<HTMLInputElement>(null);

  // --- Хлебные крошки ---
  const { setBreadcrumbs, reset } = useHeaderStore();
  useEffect(() => {
    setBreadcrumbs(breadcrumbPresets.media());
    return () => reset();
  }, [setBreadcrumbs, reset]);

  // --- API queries (useInfiniteQuery для «Загрузить ещё») ---
  const filterParams = {
    limit: 24,
    ...(searchQuery && { search: searchQuery }),
    ...(selectedFolder !== 'all' && { purpose: selectedFolder }),
    ...(selectedFileType !== 'all' && { file_type: selectedFileType }),
    sort_by: sortBy,
    order: sortOrder as 'asc' | 'desc',
  };

  const {
    data: infiniteData,
    isLoading,
    isError,
    refetch,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useMediaList(filterParams);

  const { data: stats } = useMediaStats();
  const uploadMutation = useUploadMedia();
  const deleteMutation = useDeleteMedia();

  // Все загруженные файлы (аккумуляция страниц)
  const files = infiniteData?.pages.flatMap(p => p.data) ?? [];
  const totalFiles = infiniteData?.pages[0]?.meta?.total ?? 0;

  // Сброс выделения при смене фильтров
  useEffect(() => {
    setSelectedFiles([]);
  }, [searchQuery, selectedFolder, selectedFileType, sortBy, sortOrder]);

  // --- Handlers ---
  const handleFileSelect = (id: string) => {
    setSelectedFiles(prev =>
      prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedFiles.length === files.length) {
      setSelectedFiles([]);
    } else {
      setSelectedFiles(files.map(f => f.id));
    }
  };

  const handleUpload = () => {
    fileInputRef.current?.click();
  };

  // Общая логика загрузки — используется и для <input>, и для drag & drop
  const processFiles = useCallback(
    async (fileList: FileList) => {
      for (const file of Array.from(fileList)) {
        try {
          await uploadMutation.mutateAsync(file);
          toast.success(`«${file.name}» загружен`);
        } catch (err) {
          const message =
            err instanceof Error ? err.message : 'Ошибка загрузки';
          toast.error(`Ошибка: ${message}`);
        }
      }
    },
    [uploadMutation]
  );

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileList = e.target.files;
    if (!fileList || fileList.length === 0) return;
    await processFiles(fileList);
    e.target.value = '';
  };

  // --- Drag & Drop ---
  const { dropRef, isDragging } = useFileDropZone({
    onFilesDropped: processFiles,
    disabled: uploadMutation.isPending,
  });

  const handleRequestDelete = useCallback((id: string) => {
    setDeleteTarget({ ids: [id], label: 'этот файл' });
  }, []);

  const handleRequestBulkDelete = () => {
    if (selectedFiles.length === 0) return;
    setDeleteTarget({
      ids: [...selectedFiles],
      label: `выбранные файлы (${selectedFiles.length})`,
    });
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    const { ids } = deleteTarget;
    setDeleteTarget(null);

    // Параллельное удаление (до 5 одновременно)
    const results: PromiseSettledResult<void>[] = [];
    for (let i = 0; i < ids.length; i += 5) {
      const batch = ids.slice(i, i + 5);
      const batchResults = await Promise.allSettled(
        batch.map(id => deleteMutation.mutateAsync(id))
      );
      results.push(...batchResults);
    }

    const failed = results.filter(r => r.status === 'rejected');
    const succeeded = results.filter(r => r.status === 'fulfilled');

    if (succeeded.length > 0) {
      toast.success(
        succeeded.length === 1
          ? 'Файл удалён'
          : `Удалено файлов: ${succeeded.length}`
      );
    }
    if (failed.length > 0) {
      toast.error(`Не удалось удалить: ${failed.length}`);
    }

    setSelectedFiles(prev => prev.filter(id => !ids.includes(id)));
    setPreviewFile(null);
  };

  const handleSaveFile = useCallback((_updatedFile: MediaFile) => {
    // Мутация save происходит в useMediaPreviewDialog через useUpdateMedia
    // MediaSection не управляет save напрямую — данные обновятся через invalidate
  }, []);

  const handleSort = (field: string) => {
    if (sortBy === field) {
      setSortOrder(prev => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortBy(field);
      setSortOrder('desc');
    }
  };

  return (
    <div className='flex h-full overflow-hidden'>
      {/* Скрытый input для загрузки */}
      <input
        ref={fileInputRef}
        type='file'
        multiple
        className='hidden'
        onChange={handleFileChange}
        accept='image/*,video/*,audio/*,.pdf,.doc,.docx'
      />

      {/* Боковая навигация */}
      <MediaSidebar
        stats={stats}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedFolder={selectedFolder}
        onFolderChange={setSelectedFolder}
        selectedFileType={selectedFileType}
        onFileTypeChange={setSelectedFileType}
      />

      {/* Основной контент */}
      <div
        ref={dropRef}
        className='flex-1 flex flex-col min-w-0 min-h-0 relative'
      >
        {/* Drag & Drop overlay */}
        {isDragging && (
          <div className='absolute inset-0 z-50 flex items-center justify-center bg-primary/5 border-2 border-dashed border-primary rounded-lg pointer-events-none'>
            <div className='text-center'>
              <Upload className='h-12 w-12 mx-auto mb-3 text-primary' />
              <p className='text-lg font-medium text-primary'>
                Перетащите файлы сюда
              </p>
              <p className='text-sm text-muted-foreground mt-1'>
                для загрузки в медиатеку
              </p>
            </div>
          </div>
        )}

        <MediaControls
          totalFiles={totalFiles}
          visibleCount={files.length}
          stats={stats}
          selectedFiles={selectedFiles}
          viewMode={viewMode}
          isUploading={uploadMutation.isPending}
          sortBy={sortBy}
          sortOrder={sortOrder}
          onSort={handleSort}
          onUpload={handleUpload}
          onBulkDelete={handleRequestBulkDelete}
          onSelectAll={handleSelectAll}
          onViewModeChange={setViewMode}
        />

        {/* Отображение файлов */}
        <ScrollArea className='flex-1 min-h-0'>
          <div className='p-4 lg:p-6 space-y-6'>
            {/* Loading state */}
            {isLoading && (
              <div className='flex flex-col items-center justify-center py-20 text-muted-foreground'>
                <Loader2 className='h-8 w-8 animate-spin mb-3' />
                <p className='text-sm'>Загрузка медиафайлов...</p>
              </div>
            )}

            {/* Error state */}
            {isError && !isLoading && (
              <div className='flex flex-col items-center justify-center py-20 text-muted-foreground'>
                <p className='text-sm'>Ошибка загрузки данных</p>
                <Button
                  variant='outline'
                  size='sm'
                  className='mt-3'
                  onClick={() => refetch()}
                >
                  Попробовать снова
                </Button>
              </div>
            )}

            {/* Empty state */}
            {!isLoading && !isError && files.length === 0 && (
              <div className='flex flex-col items-center justify-center py-20 text-muted-foreground'>
                <ImageOff className='h-12 w-12 mb-4 opacity-40' />
                <p className='text-lg font-medium mb-1'>Нет файлов</p>
                <p className='text-sm mb-4'>
                  {searchQuery ||
                  selectedFolder !== 'all' ||
                  selectedFileType !== 'all'
                    ? 'Попробуйте изменить фильтры или поисковый запрос'
                    : 'Загрузите первый файл в медиатеку'}
                </p>
                {!searchQuery &&
                  selectedFolder === 'all' &&
                  selectedFileType === 'all' && (
                    <Button onClick={handleUpload}>
                      <Upload className='h-4 w-4 mr-2' />
                      Загрузить файл
                    </Button>
                  )}
              </div>
            )}

            {/* Content */}
            {!isLoading &&
              !isError &&
              files.length > 0 &&
              (viewMode === 'grid' ? (
                <MediaGrid
                  files={files}
                  selectedFiles={selectedFiles}
                  hasMore={!!hasNextPage}
                  isFetchingMore={isFetchingNextPage}
                  onFileSelect={handleFileSelect}
                  onPreview={setPreviewFile}
                  onDelete={handleRequestDelete}
                  onLoadMore={() => fetchNextPage()}
                />
              ) : (
                <MediaList
                  files={files}
                  selectedFiles={selectedFiles}
                  hasMore={!!hasNextPage}
                  isFetchingMore={isFetchingNextPage}
                  onFileSelect={handleFileSelect}
                  onPreview={setPreviewFile}
                  onDelete={handleRequestDelete}
                  onLoadMore={() => fetchNextPage()}
                />
              ))}
          </div>
        </ScrollArea>
      </div>

      {/* Диалог превью */}
      {previewFile && (
        <MediaPreviewDialog
          file={previewFile}
          onClose={() => setPreviewFile(null)}
          onDelete={handleRequestDelete}
          onSave={handleSaveFile}
        />
      )}

      {/* Подтверждение удаления */}
      <AlertDialog
        open={!!deleteTarget}
        onOpenChange={open => !open && setDeleteTarget(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Удалить {deleteTarget?.label}?</AlertDialogTitle>
            <AlertDialogDescription>
              Это действие нельзя отменить. Файлы будут удалены из хранилища.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Отмена</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              className='bg-destructive text-destructive-foreground hover:bg-destructive/90'
            >
              Удалить
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
