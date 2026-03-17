/**
 * PW-049 | Загрузка публичной SEO-конфигурации с бэкенда.
 * Используется sitemap.ts, feed.xml/route.ts и layout.tsx (Метрика).
 */

const API_BASE =
  process.env.NEXT_PUBLIC_API_URL ||
  (typeof window === 'undefined' ? 'http://localhost:8000/api' : '/api');

// ---------------------------------------------------------------------------
// Типы (camelCase, маппятся из snake_case API)
// ---------------------------------------------------------------------------

export interface SitemapConfig {
  enabled: boolean;
  includeArticles: boolean;
  includeCategories: boolean;
  includeTags: boolean;
  includeStaticPages: boolean;
  priorities: Record<string, number>;
  changefreq: Record<string, string>;
}

export interface RssConfig {
  enabled: boolean;
  format: 'rss2' | 'atom';
  itemCount: number;
  contentMode: 'full' | 'excerpt';
  includeArticles: boolean;
  includeCategoryUpdates: boolean;
}

export interface MetrikaConfig {
  counterId: string;
  clickmap: boolean;
  trackLinks: boolean;
  accurateTrackBounce: boolean;
  webvisor: boolean;
  trackHash: boolean;
}

export interface SeoConfig {
  sitemapConfig: SitemapConfig;
  robotsTxt: string;
  rssConfig: RssConfig;
  metrikaConfig: MetrikaConfig;
}

// ---------------------------------------------------------------------------
// Raw API types (snake_case)
// ---------------------------------------------------------------------------

interface SeoConfigRaw {
  sitemap_config: {
    enabled: boolean;
    include_articles: boolean;
    include_categories: boolean;
    include_tags: boolean;
    include_static_pages: boolean;
    priorities: Record<string, number>;
    changefreq: Record<string, string>;
  };
  robots_txt: string;
  rss_config: {
    enabled: boolean;
    format: 'rss2' | 'atom';
    item_count: number;
    content_mode: 'full' | 'excerpt';
    include_articles: boolean;
    include_category_updates: boolean;
  };
  metrika_config: {
    counter_id: string;
    clickmap: boolean;
    track_links: boolean;
    accurate_track_bounce: boolean;
    webvisor: boolean;
    track_hash: boolean;
  };
}

function mapSeoConfig(raw: SeoConfigRaw): SeoConfig {
  return {
    sitemapConfig: {
      enabled: raw.sitemap_config.enabled,
      includeArticles: raw.sitemap_config.include_articles,
      includeCategories: raw.sitemap_config.include_categories,
      includeTags: raw.sitemap_config.include_tags,
      includeStaticPages: raw.sitemap_config.include_static_pages,
      priorities: raw.sitemap_config.priorities,
      changefreq: raw.sitemap_config.changefreq,
    },
    robotsTxt: raw.robots_txt,
    rssConfig: {
      enabled: raw.rss_config.enabled,
      format: raw.rss_config.format,
      itemCount: raw.rss_config.item_count,
      contentMode: raw.rss_config.content_mode,
      includeArticles: raw.rss_config.include_articles,
      includeCategoryUpdates: raw.rss_config.include_category_updates,
    },
    metrikaConfig: {
      counterId: raw.metrika_config.counter_id,
      clickmap: raw.metrika_config.clickmap,
      trackLinks: raw.metrika_config.track_links,
      accurateTrackBounce: raw.metrika_config.accurate_track_bounce,
      webvisor: raw.metrika_config.webvisor,
      trackHash: raw.metrika_config.track_hash,
    },
  };
}

// ---------------------------------------------------------------------------
// Публичная функция
// ---------------------------------------------------------------------------

export async function getSeoConfig(): Promise<SeoConfig | null> {
  try {
    const res = await fetch(`${API_BASE}/seo/config`, {
      next: { revalidate: 3600 },
    });
    if (!res.ok) return null;
    const json = await res.json();
    return mapSeoConfig(json.data);
  } catch {
    return null;
  }
}
