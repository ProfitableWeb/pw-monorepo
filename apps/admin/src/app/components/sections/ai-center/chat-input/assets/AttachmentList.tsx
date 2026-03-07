import { X } from 'lucide-react';
import type { Attachment } from '@/app/store/ai-store';
import { formatFileSize, getFileIcon } from '../../ai-center.utils';

interface AttachmentListProps {
  attachments: Attachment[];
  onRemove: (id: string) => void;
}

export function AttachmentList({ attachments, onRemove }: AttachmentListProps) {
  if (attachments.length === 0) return null;

  return (
    <div className='mb-3 flex flex-wrap gap-2'>
      {attachments.map(attachment => (
        <div
          key={attachment.id}
          className='flex items-center gap-2 px-3 py-2 rounded-lg bg-muted border text-sm group'
        >
          {getFileIcon(attachment.type)}
          <span className='font-medium'>{attachment.name}</span>
          <span className='text-xs text-muted-foreground'>
            {formatFileSize(attachment.size)}
          </span>
          <button
            onClick={() => onRemove(attachment.id)}
            className='ml-2 opacity-0 group-hover:opacity-100 transition-opacity'
          >
            <X className='h-4 w-4 text-muted-foreground hover:text-foreground' />
          </button>
        </div>
      ))}
    </div>
  );
}
