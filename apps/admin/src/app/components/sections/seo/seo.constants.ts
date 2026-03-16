import {
  Globe,
  FileText,
  Link,
  Code,
  BarChart3,
  Search,
  Zap,
  Target,
  BookOpen,
} from 'lucide-react';
import type {
  SeoCategory,
  SitemapConfig,
  RssConfig,
  MetaDirectives,
  MetrikaCounterConfig,
  YandexApiConnection,
  MetrikaStats,
  WebmasterSummary,
  WebmasterIndexing,
  WebmasterQuery,
} from './seo.types';

/** Список категорий для навигации в SEO-разделе */
export const seoCategories: SeoCategory[] = [
  { id: 'general', label: 'Общие настройки', icon: Globe },
  { id: 'meta', label: 'Мета-теги', icon: FileText },
  { id: 'indexing', label: 'Индексация и фиды', icon: Link },
  { id: 'schema', label: 'Структурированные данные', icon: Code },
  { id: 'metrika', label: 'Яндекс.Метрика', icon: BarChart3 },
  { id: 'webmaster', label: 'Яндекс Вебмастер', icon: Search },
  { id: 'performance', label: 'Производительность', icon: Zap },
  { id: 'urls', label: 'URL и редиректы', icon: Link },
  { id: 'content', label: 'Контент-анализ', icon: Target },
  { id: 'knowledge-base', label: 'База знаний', icon: BookOpen },
];

// --- Mock-данные: Индексация и фиды (PW-046-A) ---

export const MOCK_SITEMAP_CONFIG: SitemapConfig = {
  enabled: true,
  includeArticles: true,
  includeCategories: true,
  includeTags: false,
  includeStaticPages: true,
  priorities: {
    home: 1.0,
    articles: 0.8,
    categories: 0.6,
    tags: 0.4,
    staticPages: 0.5,
  },
  changefreq: {
    home: 'daily',
    articles: 'weekly',
    categories: 'weekly',
    tags: 'monthly',
    staticPages: 'monthly',
  },
  urlCount: 47,
  lastUpdated: '2026-03-16T10:30:00Z',
};

export const MOCK_ROBOTS_TXT = `User-agent: *
Allow: /
Disallow: /admin/
Disallow: /api/
Disallow: /preview/

Sitemap: https://profitableweb.ru/sitemap.xml

Host: profitableweb.ru`;

export const MOCK_RSS_CONFIG: RssConfig = {
  enabled: true,
  format: 'atom',
  itemCount: 20,
  contentMode: 'excerpt',
  includeArticles: true,
  includeCategoryUpdates: false,
};

export const MOCK_DEFAULT_DIRECTIVES: Record<string, MetaDirectives> = {
  articles: { index: true, follow: true, noarchive: false },
  categories: { index: true, follow: true, noarchive: false },
  tags: { index: false, follow: true, noarchive: false },
};

// --- Mock-данные: Яндекс.Метрика (PW-046-B) ---

export const MOCK_METRIKA_CONFIG: MetrikaCounterConfig = {
  counterId: '12345678',
  clickmap: true,
  trackLinks: true,
  accurateTrackBounce: true,
  webvisor: true,
  trackHash: false,
};

export const MOCK_YANDEX_API_CONNECTION: YandexApiConnection = {
  connected: true,
  account: 'ivan@yandex.ru',
  permissions: ['metrika:read', 'webmaster:hostinfo'],
  counterId: '12345678',
  hostId: 'profitableweb.ru',
};

export const MOCK_METRIKA_STATS: MetrikaStats = {
  period: '7d',
  visitors: { value: 1247, change: 12.0 },
  pageviews: { value: 3891, change: 8.0 },
  pageDepth: { value: 4.2, change: -0.3 },
  avgDuration: { value: '2:34', change: 15 },
  bounceRate: { value: 32.1, change: -2.4 },
  dailyVisits: [
    120, 145, 198, 230, 280, 310, 350, 380, 340, 290, 270, 265, 295, 340,
  ],
};

// --- Mock-данные: Яндекс Вебмастер (PW-046-C) ---

export const MOCK_WEBMASTER_SUMMARY: WebmasterSummary = {
  sqi: 40,
  searchablePages: 142,
  excludedPages: 6,
  siteProblems: 3,
  sqiHistory: [10, 12, 14, 18, 20, 22, 25, 28, 30, 32, 34, 36, 38, 40],
};

export const MOCK_WEBMASTER_INDEXING: WebmasterIndexing = {
  indexed: { count: 142, percent: 91 },
  pending: { count: 8, percent: 5 },
  excluded: { count: 6, percent: 4 },
  history: [
    110, 112, 115, 118, 120, 122, 125, 128, 130, 132, 134, 135, 136, 137, 138,
    139, 140, 140, 141, 141, 142, 142, 142, 142, 142, 142, 142, 142, 142, 142,
  ],
  lastUpdated: '2026-03-16T08:15:00Z',
};

export const MOCK_WEBMASTER_QUERIES: WebmasterQuery[] = [
  { query: 'ai автоматизация труда', position: 5, impressions: 1200 },
  { query: 'монетизация хобби', position: 8, impressions: 890 },
  { query: 'profitableweb', position: 1, impressions: 450 },
  { query: 'цифровые активы заработок', position: 12, impressions: 320 },
  { query: 'трансформация труда ии', position: 7, impressions: 280 },
];
