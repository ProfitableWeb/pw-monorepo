import { Image as ImageIcon, Video, Music, FileText } from 'lucide-react';
import { toast } from 'sonner';
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

/** Копирование URL в буфер обмена с toast-уведомлением */
export const handleCopyUrl = async (url: string) => {
  try {
    await navigator.clipboard.writeText(url);
    toast.success('URL скопирован');
  } catch {
    // Fallback для окружений без Clipboard API
    const textArea = document.createElement('textarea');
    textArea.value = url;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    document.body.appendChild(textArea);
    textArea.select();
    try {
      document.execCommand('copy');
      toast.success('URL скопирован');
    } catch (err) {
      console.error('Failed to copy:', err);
      toast.error('Не удалось скопировать URL');
    } finally {
      document.body.removeChild(textArea);
    }
  }
};

/** Скачивание файла по URL */
export const downloadFile = (url: string, filename: string) => {
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.style.display = 'none';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
};

/** Русская плюрализация: pluralize(1, 'статья', 'статьи', 'статей') → 'статья' */
export const pluralize = (
  n: number,
  one: string,
  few: string,
  many: string
) => {
  const abs = Math.abs(n);
  const mod10 = abs % 10;
  const mod100 = abs % 100;
  if (mod100 >= 11 && mod100 <= 19) return many;
  if (mod10 === 1) return one;
  if (mod10 >= 2 && mod10 <= 4) return few;
  return many;
};
