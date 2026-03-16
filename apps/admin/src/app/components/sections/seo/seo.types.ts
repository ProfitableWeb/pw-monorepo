import type { LucideIcon } from 'lucide-react';

/** ID категории навигации в SEO-разделе */
export type SeoCategoryId =
  | 'general'
  | 'meta'
  | 'indexing'
  | 'schema'
  | 'metrika'
  | 'webmaster'
  | 'performance'
  | 'urls'
  | 'content'
  | 'knowledge-base';

/** Категория навигации в SEO-настройках */
export interface SeoCategory {
  id: SeoCategoryId;
  label: string;
  icon: LucideIcon;
}

/** Конфигурация sitemap */
export interface SitemapConfig {
  enabled: boolean;
  includeArticles: boolean;
  includeCategories: boolean;
  includeTags: boolean;
  includeStaticPages: boolean;
  priorities: Record<string, number>;
  changefreq: Record<string, string>;
  urlCount: number;
  lastUpdated: string;
}

/** Конфигурация RSS-фида */
export interface RssConfig {
  enabled: boolean;
  format: 'rss2' | 'atom';
  itemCount: number;
  contentMode: 'full' | 'excerpt';
  includeArticles: boolean;
  includeCategoryUpdates: boolean;
}

/** Мета-директивы по умолчанию для типа контента */
export interface MetaDirectives {
  index: boolean;
  follow: boolean;
  noarchive: boolean;
}

/** Настройки счётчика Яндекс.Метрики */
export interface MetrikaCounterConfig {
  counterId: string;
  clickmap: boolean;
  trackLinks: boolean;
  accurateTrackBounce: boolean;
  webvisor: boolean;
  trackHash: boolean;
}

/** Подключение к Яндекс API (OAuth) */
export interface YandexApiConnection {
  connected: boolean;
  account: string;
  permissions: string[];
  counterId: string;
  hostId: string;
}

/** Метрика с изменением */
export interface MetricWithChange {
  value: number | string;
  change: number;
}

/** Статистика посещаемости из Яндекс.Метрики */
export interface MetrikaStats {
  period: string;
  visitors: MetricWithChange;
  pageviews: MetricWithChange;
  pageDepth: MetricWithChange;
  avgDuration: MetricWithChange;
  bounceRate: MetricWithChange;
  dailyVisits: number[];
}

/** Обзорные данные из Яндекс Вебмастера */
export interface WebmasterSummary {
  sqi: number;
  searchablePages: number;
  excludedPages: number;
  siteProblems: number;
  sqiHistory: number[];
}

/** Статус индексации из Яндекс Вебмастера */
export interface WebmasterIndexing {
  indexed: { count: number; percent: number };
  pending: { count: number; percent: number };
  excluded: { count: number; percent: number };
  history: number[];
  lastUpdated: string;
}

/** Поисковый запрос из Яндекс Вебмастера */
export interface WebmasterQuery {
  query: string;
  position: number;
  impressions: number;
}
