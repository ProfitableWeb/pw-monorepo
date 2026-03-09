import { useState, useRef, useEffect, useCallback } from 'react';

interface UseFileDropZoneOptions {
  onFilesDropped: (files: FileList) => void;
  disabled?: boolean;
}

interface UseFileDropZoneReturn {
  dropRef: React.RefObject<HTMLDivElement | null>;
  isDragging: boolean;
}

/**
 * Хук для нативного HTML5 drag & drop файлов.
 * dragCounter решает проблему ложных dragleave при переходе между дочерними элементами.
 */
export function useFileDropZone({
  onFilesDropped,
  disabled = false,
}: UseFileDropZoneOptions): UseFileDropZoneReturn {
  const dropRef = useRef<HTMLDivElement>(null);
  const dragCounter = useRef(0);
  const [isDragging, setIsDragging] = useState(false);

  const handleDragEnter = useCallback(
    (e: DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      if (disabled) return;
      dragCounter.current += 1;
      if (dragCounter.current === 1) {
        setIsDragging(true);
      }
    },
    [disabled]
  );

  const handleDragLeave = useCallback((e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounter.current -= 1;
    if (dragCounter.current === 0) {
      setIsDragging(false);
    }
  }, []);

  const handleDragOver = useCallback((e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer) {
      e.dataTransfer.dropEffect = 'copy';
    }
  }, []);

  const handleDrop = useCallback(
    (e: DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      dragCounter.current = 0;
      setIsDragging(false);

      if (disabled) return;
      if (e.dataTransfer?.files && e.dataTransfer.files.length > 0) {
        onFilesDropped(e.dataTransfer.files);
      }
    },
    [disabled, onFilesDropped]
  );

  useEffect(() => {
    const el = dropRef.current;
    if (!el) return;

    el.addEventListener('dragenter', handleDragEnter);
    el.addEventListener('dragleave', handleDragLeave);
    el.addEventListener('dragover', handleDragOver);
    el.addEventListener('drop', handleDrop);

    return () => {
      el.removeEventListener('dragenter', handleDragEnter);
      el.removeEventListener('dragleave', handleDragLeave);
      el.removeEventListener('dragover', handleDragOver);
      el.removeEventListener('drop', handleDrop);
    };
  }, [handleDragEnter, handleDragLeave, handleDragOver, handleDrop]);

  return { dropRef, isDragging };
}
