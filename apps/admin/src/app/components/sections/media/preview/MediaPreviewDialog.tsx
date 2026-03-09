import { Button } from '@/app/components/ui/button';
import { Separator } from '@/app/components/ui/separator';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/app/components/ui/dialog';
import { ScrollArea } from '@/app/components/ui/scroll-area';
import { Download, Trash2, Save, Loader2 } from 'lucide-react';
import type { MediaFile } from '../media.types';
import { getFileIcon, downloadFile } from '../media.utils';
import { useMediaPreviewDialog } from './useMediaPreviewDialog';
import { MediaPreviewPanel } from './assets/MediaPreviewPanel';
import { MediaSeoForm } from './assets/MediaSeoForm';
import { MediaExifForm } from './assets/MediaExifForm';

interface MediaPreviewDialogProps {
  file: MediaFile | null;
  open?: boolean;
  onClose: () => void;
  onDelete: (id: string) => void;
  onSave: (file: MediaFile) => void;
}

export function MediaPreviewDialog({
  file,
  open,
  onClose,
  onDelete,
  onSave,
}: MediaPreviewDialogProps) {
  const {
    editedFile,
    hasChanges,
    isSaving,
    isReplacing,
    replaceInputRef,
    handleFieldChange,
    handleSave,
    handleReplaceFile,
    handleReplaceFileChange,
  } = useMediaPreviewDialog({ file, onSave });

  if (!editedFile) return null;

  const Icon = getFileIcon(editedFile.type);

  return (
    <Dialog open={open ?? true} onOpenChange={onClose}>
      <DialogContent className='w-[95vw] max-w-[1400px] h-[90vh] p-0 gap-0 flex flex-col'>
        {/* Скрытый input для замены файла */}
        <input
          ref={replaceInputRef}
          type='file'
          className='hidden'
          onChange={handleReplaceFileChange}
          accept='image/*,video/*,audio/*,.pdf,.doc,.docx'
        />
        {/* Фиксированный заголовок */}
        <DialogHeader className='px-6 pt-6 pb-4 border-b shrink-0'>
          <DialogTitle className='flex items-center gap-2'>
            <Icon className='h-5 w-5' />
            {editedFile.name}
            {hasChanges && (
              <span className='text-xs text-muted-foreground'>(изменено)</span>
            )}
          </DialogTitle>
          <DialogDescription>
            Редактирование SEO параметров и просмотр метаданных файла
          </DialogDescription>
        </DialogHeader>

        {/* Прокручиваемый контент */}
        <div className='flex-1 overflow-hidden'>
          <ScrollArea className='h-full'>
            <div className='p-6'>
              <div className='grid lg:grid-cols-2 gap-6'>
                {/* Левая колонка — превью */}
                <MediaPreviewPanel
                  file={editedFile}
                  isReplacing={isReplacing}
                  onReplaceFile={handleReplaceFile}
                />

                {/* Правая колонка — параметры */}
                <div className='space-y-6'>
                  <MediaSeoForm
                    file={editedFile}
                    onFieldChange={handleFieldChange}
                  />

                  <Separator />

                  {editedFile.type === 'image' && editedFile.exif && (
                    <MediaExifForm file={editedFile} />
                  )}
                </div>
              </div>
            </div>
          </ScrollArea>
        </div>

        {/* Фиксированный футер */}
        <DialogFooter className='px-6 py-4 border-t flex-row justify-between gap-2'>
          <div className='flex gap-2'>
            <Button
              variant='outline'
              onClick={() => downloadFile(editedFile.url, editedFile.name)}
            >
              <Download className='h-4 w-4 mr-2' />
              Скачать
            </Button>
          </div>
          <div className='flex gap-2'>
            {hasChanges && (
              <Button onClick={handleSave} disabled={isSaving}>
                {isSaving ? (
                  <Loader2 className='h-4 w-4 mr-2 animate-spin' />
                ) : (
                  <Save className='h-4 w-4 mr-2' />
                )}
                Сохранить изменения
              </Button>
            )}
            <Button
              variant='destructive'
              onClick={() => {
                onDelete(editedFile.id);
                onClose();
              }}
            >
              <Trash2 className='h-4 w-4 mr-2' />
              Удалить
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
