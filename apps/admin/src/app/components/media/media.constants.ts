import {
  FolderOpen,
  FileText,
  Image as ImageIcon,
  FileAudio,
  File,
  Video,
  Music,
} from 'lucide-react';

/** Фильтры по назначению файлов */
export const PURPOSES = [
  { id: 'all', name: 'Все файлы', icon: FolderOpen },
  { id: 'articles', name: 'Статьи', icon: FileText },
  { id: 'covers', name: 'Обложки', icon: ImageIcon },
  { id: 'logos', name: 'Логотипы', icon: ImageIcon },
  { id: 'ai-audio', name: 'AI Аудио', icon: FileAudio },
  { id: 'documents', name: 'Документы', icon: File },
];

/** Фильтры по типу файлов */
export const FILE_TYPES = [
  { id: 'all', name: 'Все типы', icon: FolderOpen },
  { id: 'image', name: 'Изображения', icon: ImageIcon },
  { id: 'video', name: 'Видео', icon: Video },
  { id: 'audio', name: 'Аудио', icon: Music },
  { id: 'document', name: 'Документы', icon: FileText },
];
