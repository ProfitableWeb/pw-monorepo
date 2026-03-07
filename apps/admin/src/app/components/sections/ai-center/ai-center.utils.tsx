import { FileText, Image as ImageIcon, File } from 'lucide-react';

export const formatFileSize = (bytes: number) => {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
};

export const getFileIcon = (type: string) => {
  if (type.startsWith('image/')) return <ImageIcon className='h-4 w-4' />;
  if (type.startsWith('text/')) return <FileText className='h-4 w-4' />;
  return <File className='h-4 w-4' />;
};

export const copyToClipboard = (text: string) => {
  navigator.clipboard.writeText(text);
};
