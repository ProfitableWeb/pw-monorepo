import { useHeaderStore } from '@/app/store/header-store';
import { breadcrumbPresets } from '@/app/utils/breadcrumbs-helper';

import { useState, useMemo, useEffect } from 'react';
import { Button } from '@/app/components/ui/button';
import { Badge } from '@/app/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/app/components/ui/dialog';
import { ScrollArea } from '@/app/components/ui/scroll-area';
import { Archive } from 'lucide-react';

import { MediaSidebar } from './MediaSidebar';
import { MediaControls } from './MediaControls';
import { MediaGrid } from './MediaGrid';
import { MediaList } from './MediaList';
import { MediaPreviewDialog } from './preview';
import { formatBytes } from './media.utils';
import { initialFiles, backupHistory } from './media.mock';
import type { ViewMode, MediaFile } from './media.types';

export function MediaSection() {
  const [files, setFiles] = useState<MediaFile[]>(initialFiles);
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFiles, setSelectedFiles] = useState<string[]>([]);
  const [selectedFolder, setSelectedFolder] = useState('all');
  const [selectedFileType, setSelectedFileType] = useState('all');
  const [previewFile, setPreviewFile] = useState<MediaFile | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [showBackupDialog, setShowBackupDialog] = useState(false);
  const [displayedCount, setDisplayedCount] = useState(12);

  // Стор заголовка для хлебных крошек
  const { setBreadcrumbs, reset } = useHeaderStore();

  // Установить хлебные крошки
  useEffect(() => {
    setBreadcrumbs(breadcrumbPresets.media());

    return () => reset();
  }, [setBreadcrumbs, reset]);

  const filteredFiles = useMemo(() => {
    let result = files;

    // Фильтр по поиску
    if (searchQuery) {
      result = result.filter(file =>
        file.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Фильтр по назначению
    if (selectedFolder !== 'all') {
      result = result.filter(file => file.purposes.includes(selectedFolder));
    }

    // Фильтр по типу файла
    if (selectedFileType !== 'all') {
      result = result.filter(file => file.type === selectedFileType);
    }

    return result;
  }, [files, searchQuery, selectedFolder, selectedFileType]);

  const displayedFiles = useMemo(() => {
    return filteredFiles.slice(0, displayedCount);
  }, [filteredFiles, displayedCount]);

  const hasMore = displayedFiles.length < filteredFiles.length;

  const totalSize = files.reduce((sum, file) => sum + file.size, 0);
  const maxStorage = 10 * 1024 * 1024 * 1024; // 10GB
  const storagePercentage = (totalSize / maxStorage) * 100;

  const fileTypeStats = useMemo(() => {
    const stats = { image: 0, video: 0, audio: 0, document: 0 };
    files.forEach(file => {
      stats[file.type] += file.size;
    });
    return stats;
  }, [files]);

  const handleFileSelect = (id: string) => {
    setSelectedFiles(prev =>
      prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedFiles.length === filteredFiles.length) {
      setSelectedFiles([]);
    } else {
      setSelectedFiles(filteredFiles.map(f => f.id));
    }
  };

  const handleDelete = (id: string) => {
    setFiles(prev => prev.filter(f => f.id !== id));
    setSelectedFiles(prev => prev.filter(f => f !== id));
    setPreviewFile(null);
  };

  const handleBulkDelete = () => {
    setFiles(prev => prev.filter(f => !selectedFiles.includes(f.id)));
    setSelectedFiles([]);
  };

  const handleSaveFile = (updatedFile: MediaFile) => {
    setFiles(prev =>
      prev.map(f => (f.id === updatedFile.id ? updatedFile : f))
    );
    // TODO: Show toast notification
  };

  const handleUpload = () => {
    setIsUploading(true);
    setUploadProgress(0);

    // Симуляция загрузки
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsUploading(false);
          return 0;
        }
        return prev + 10;
      });
    }, 200);
  };

  const handleBackup = () => {
    // Симуляция создания бэкапа
    setShowBackupDialog(false);
    // TODO: Show toast notification
  };

  const lastBackup = backupHistory[0];

  return (
    <div className='flex h-full overflow-hidden'>
      {/* Боковая навигация */}
      <MediaSidebar
        files={files}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedFolder={selectedFolder}
        onFolderChange={setSelectedFolder}
        selectedFileType={selectedFileType}
        onFileTypeChange={setSelectedFileType}
        totalSize={totalSize}
        maxStorage={maxStorage}
        storagePercentage={storagePercentage}
        lastBackup={lastBackup}
        onCreateBackup={() => setShowBackupDialog(true)}
      />

      {/* Основной контент */}
      <div className='flex-1 flex flex-col min-w-0 min-h-0'>
        <MediaControls
          filteredFiles={filteredFiles}
          totalSize={totalSize}
          fileTypeStats={fileTypeStats}
          selectedFiles={selectedFiles}
          viewMode={viewMode}
          isUploading={isUploading}
          uploadProgress={uploadProgress}
          onUpload={handleUpload}
          onBulkDelete={handleBulkDelete}
          onSelectAll={handleSelectAll}
          onViewModeChange={setViewMode}
          onCancelUpload={() => setIsUploading(false)}
        />

        {/* Отображение файлов */}
        <ScrollArea className='flex-1 min-h-0'>
          <div className='p-4 lg:p-6 space-y-6'>
            {viewMode === 'grid' ? (
              <MediaGrid
                files={displayedFiles}
                selectedFiles={selectedFiles}
                hasMore={hasMore}
                onFileSelect={handleFileSelect}
                onPreview={setPreviewFile}
                onDelete={handleDelete}
                onLoadMore={() => setDisplayedCount(prev => prev + 12)}
              />
            ) : (
              <MediaList
                files={displayedFiles}
                selectedFiles={selectedFiles}
                hasMore={hasMore}
                onFileSelect={handleFileSelect}
                onPreview={setPreviewFile}
                onDelete={handleDelete}
                onLoadMore={() => setDisplayedCount(prev => prev + 12)}
              />
            )}
          </div>
        </ScrollArea>
      </div>

      {/* Диалог превью */}
      {previewFile && (
        <MediaPreviewDialog
          file={previewFile}
          onClose={() => setPreviewFile(null)}
          onDelete={handleDelete}
          onSave={handleSaveFile}
        />
      )}

      {/* Диалог бэкапа */}
      <Dialog open={showBackupDialog} onOpenChange={setShowBackupDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Создать резервную копию</DialogTitle>
            <DialogDescription>
              Будет создана резервная копия всех медиафайлов ({files.length}{' '}
              файлов, {formatBytes(totalSize)})
            </DialogDescription>
          </DialogHeader>
          {lastBackup && (
            <div className='py-4'>
              <div className='space-y-3'>
                <div className='p-4 rounded-lg border'>
                  <div className='flex items-center justify-between mb-2'>
                    <span className='text-sm font-medium'>Последняя копия</span>
                    <Badge variant='secondary'>
                      {lastBackup.type === 'auto' ? 'Авто' : 'Ручной'}
                    </Badge>
                  </div>
                  <p className='text-sm text-muted-foreground'>
                    {lastBackup.date.toLocaleDateString('ru-RU', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                  <p className='text-sm text-muted-foreground mt-1'>
                    {formatBytes(lastBackup.size)} • {lastBackup.filesCount}{' '}
                    файлов
                  </p>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button
              variant='outline'
              onClick={() => setShowBackupDialog(false)}
            >
              Отмена
            </Button>
            <Button onClick={handleBackup}>
              <Archive className='h-4 w-4 mr-2' />
              Создать копию
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
