/** Тип медиафайла */
export type FileType = 'image' | 'video' | 'audio' | 'document';

/** Режим отображения файлов */
export type ViewMode = 'grid' | 'list';

/** Медиафайл */
export interface MediaFile {
  id: string;
  name: string;
  type: FileType;
  url: string;
  size: number;
  uploadedAt: Date;
  usedIn: number;
  purposes: string[];
  thumbnail?: string;
  dimensions?: { width: number; height: number };
  duration?: number;
  seo?: {
    filename: string;
    alt: string;
    caption: string;
  };
  exif?: {
    dateTaken?: string;
    camera?: string;
    lens?: string;
    iso?: string;
    aperture?: string;
    shutterSpeed?: string;
    focalLength?: string;
  };
  resizes?: Array<{
    name: string;
    width: number;
    height: number;
    size: number;
    url: string;
  }>;
  // API-поля (PW-041-B)
  storageKey?: string;
  mimeType?: string;
  slug?: string;
  uploadedById?: string;
  updatedAt?: Date;
}

/** Параметры запроса списка медиафайлов */
export interface MediaListParams {
  page?: number;
  limit?: number;
  file_type?: string;
  purpose?: string;
  search?: string;
  sort_by?: string;
  order?: 'asc' | 'desc';
}

/** Payload обновления медиафайла */
export interface MediaUpdatePayload {
  slug?: string;
  alt?: string;
  caption?: string;
  purposes?: string[];
}

/** Ответ API со статистикой медиатеки */
export interface MediaStatsResponse {
  totalCount: number;
  totalSize: number;
  byType: Record<string, number>;
  allPurposes: string[];
}

/** Резервная копия */
export interface Backup {
  id: string;
  date: Date;
  size: number;
  filesCount: number;
  status: 'completed' | 'in-progress' | 'failed';
  type: 'auto' | 'manual';
}
