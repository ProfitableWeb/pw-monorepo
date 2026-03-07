import { useState } from 'react';
import { cn } from '@/app/components/ui/utils';
import { Paperclip } from 'lucide-react';
import type { Attachment } from '@/app/store/ai-store';

interface DropZoneProps {
  onFilesDropped: (attachments: Attachment[]) => void;
  children: React.ReactNode;
}

export function DropZone({ onFilesDropped, children }: DropZoneProps) {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    if (!e.dataTransfer.files.length) return;

    const newAttachments: Attachment[] = Array.from(e.dataTransfer.files).map(
      file => ({
        id: Math.random().toString(36).substr(2, 9),
        name: file.name,
        size: file.size,
        type: file.type,
      })
    );

    onFilesDropped(newAttachments);
  };

  return (
    <div
      className={cn(
        'relative rounded-lg border-2 border-dashed transition-colors',
        isDragging ? 'border-primary bg-primary/5' : 'border-transparent'
      )}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {isDragging && (
        <div className='absolute inset-0 flex items-center justify-center bg-background/80 rounded-lg z-10'>
          <div className='text-center'>
            <Paperclip className='h-8 w-8 mx-auto mb-2 text-primary' />
            <p className='text-sm font-medium'>Отпустите файлы для загрузки</p>
          </div>
        </div>
      )}
      {children}
    </div>
  );
}
