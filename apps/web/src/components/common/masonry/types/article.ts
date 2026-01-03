/**
 * Интерфейс статьи для masonry-сетки
 */
export interface Article {
  /** Уникальный идентификатор статьи */
  id: string;
  /** Заголовок статьи */
  title: string;
  /** Подзаголовок статьи */
  subtitle: string;
  /** Дата создания в ISO 8601 формате */
  createdAt: string;
  /** Краткая аннотация статьи (HTML-разметка) */
  summary: string;
  /** URL изображения (опционально) */
  imageUrl?: string;
  /** Alt текст для изображения */
  imageAlt?: string;
  /** URL-friendly идентификатор для SEO */
  slug: string;
  /** Категория статьи */
  category?: string;
  /** Время чтения в минутах */
  readTime?: number;
  /** Blur placeholder для изображения */
  blurDataURL?: string;
}


