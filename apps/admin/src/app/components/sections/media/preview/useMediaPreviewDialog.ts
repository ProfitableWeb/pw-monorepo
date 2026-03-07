import { useState, useEffect } from 'react';
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

  useEffect(() => {
    if (file) {
      setEditedFile({ ...file });
      setHasChanges(false);
    }
  }, [file]);

  const handleFieldChange = (
    section: 'seo' | 'exif',
    field: string,
    value: string
  ) => {
    if (!editedFile) return;

    setEditedFile({
      ...editedFile,
      [section]: {
        ...editedFile[section],
        [field]: value,
      },
    });
    setHasChanges(true);
  };

  const handleSave = () => {
    if (editedFile) {
      onSave(editedFile);
      setHasChanges(false);
    }
  };

  const handleReplaceFile = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept =
      file?.type === 'image'
        ? 'image/*'
        : file?.type === 'video'
          ? 'video/*'
          : file?.type === 'audio'
            ? 'audio/*'
            : '*/*';
    input.onchange = e => {
      const target = e.target as HTMLInputElement;
      if (target.files && target.files[0]) {
        console.log('New file selected:', target.files[0]);
        // TODO: Upload new file and update editedFile
      }
    };
    input.click();
  };

  return {
    editedFile,
    hasChanges,
    handleFieldChange,
    handleSave,
    handleReplaceFile,
  };
}
