import { Image as ImageIcon, Video, Music, FileText } from 'lucide-react';
import type { FileType } from './media.types';

/** Форматирование размера файла в человекочитаемый вид */
export const formatBytes = (bytes: number) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
};

/** Форматирование длительности в минуты:секунды */
export const formatDuration = (seconds: number) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

/** Иконка по типу файла */
export const getFileIcon = (type: FileType) => {
  switch (type) {
    case 'image':
      return ImageIcon;
    case 'video':
      return Video;
    case 'audio':
      return Music;
    case 'document':
      return FileText;
  }
};

/** Копирование URL в буфер обмена (фоллбэк для окружений без Clipboard API) */
export const handleCopyUrl = (url: string) => {
  const textArea = document.createElement('textarea');
  textArea.value = url;
  textArea.style.position = 'fixed';
  textArea.style.left = '-999999px';
  document.body.appendChild(textArea);
  textArea.select();

  try {
    document.execCommand('copy');
    // TODO: Show toast notification
  } catch (err) {
    console.error('Failed to copy:', err);
  } finally {
    document.body.removeChild(textArea);
  }
};
