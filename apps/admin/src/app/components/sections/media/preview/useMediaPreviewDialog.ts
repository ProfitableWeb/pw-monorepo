import { useState, useEffect, useRef } from 'react';
import { toast } from 'sonner';
import { useUpdateMedia, useReplaceMedia } from '@/hooks/api';
import type { MediaFile } from '../media.types';

interface UseMediaPreviewDialogParams {
  file: MediaFile | null;
  onSave: (file: MediaFile) => void;
}

/** Логика редактирования медиафайла в диалоге превью */
export function useMediaPreviewDialog({
  file,
  onSave,
}: UseMediaPreviewDialogParams) {
  const [editedFile, setEditedFile] = useState<MediaFile | null>(null);
  const [hasChanges, setHasChanges] = useState(false);
  const updateMutation = useUpdateMedia();
  const replaceMutation = useReplaceMedia();
  const replaceInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (file) {
      setEditedFile({ ...file });
      setHasChanges(false);
    }
  }, [file]);

  const handleFieldChange = (_section: 'seo', field: string, value: string) => {
    if (!editedFile) return;

    const currentSeo = editedFile.seo ?? { filename: '', alt: '', caption: '' };
    setEditedFile({
      ...editedFile,
      seo: { ...currentSeo, [field]: value },
    });
    setHasChanges(true);
  };

  const handleSave = async () => {
    if (!editedFile) return;

    try {
      await updateMutation.mutateAsync({
        mediaId: editedFile.id,
        data: {
          slug: editedFile.seo?.filename,
          alt: editedFile.seo?.alt,
          caption: editedFile.seo?.caption,
        },
      });
      toast.success('Изменения сохранены');
      setHasChanges(false);
      onSave(editedFile);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Ошибка сохранения';
      toast.error(message);
    }
  };

  const handleReplaceFile = () => {
    replaceInputRef.current?.click();
  };

  const handleReplaceFileChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const fileList = e.target.files;
    if (!fileList || fileList.length === 0 || !editedFile) return;

    const newFile = fileList[0] as File;
    try {
      const updated = await replaceMutation.mutateAsync({
        mediaId: editedFile.id,
        file: newFile,
      });
      toast.success(`Файл заменён на «${newFile.name}»`);
      setEditedFile(updated);
      setHasChanges(false);
      onSave(updated);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Ошибка замены файла';
      toast.error(message);
    }

    e.target.value = '';
  };

  return {
    editedFile,
    hasChanges,
    isSaving: updateMutation.isPending,
    isReplacing: replaceMutation.isPending,
    replaceInputRef,
    handleFieldChange,
    handleSave,
    handleReplaceFile,
    handleReplaceFileChange,
  };
}
