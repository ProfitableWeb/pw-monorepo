/**
 * PW-049-A / PW-050-A | Стилизованный sitemap.xml
 * Route Handler вместо Metadata API — для поддержки XSL-стилизации.
 */

import { baseUrl } from '@/config/metadata';
import { getAllArticles, getAllCategories } from '@/lib/api-client';
import { getSeoConfig } from '@/lib/seo-config';

export const revalidate = 3600;

const VALID_FREQUENCIES = new Set([
  'always',
  'hourly',
  'daily',
  'weekly',
  'monthly',
  'yearly',
  'never',
]);

function freq(value: string | undefined): string {
  return value && VALID_FREQUENCIES.has(value) ? value : 'weekly';
}

function escapeXml(str: string): string {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

interface SitemapEntry {
  url: string;
  lastmod: string;
  changefreq: string;
  priority: number;
}

export async function GET() {
  const config = await getSeoConfig();

  if (!config || !config.sitemapConfig.enabled) {
    return new Response(
      '<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"/>',
      {
        headers: { 'Content-Type': 'application/xml; charset=utf-8' },
      }
    );
  }

  const { sitemapConfig } = config;

  const [articles, categories] = await Promise.all([
    sitemapConfig.includeArticles ? getAllArticles() : [],
    sitemapConfig.includeCategories ? getAllCategories() : [],
  ]);

  const entries: SitemapEntry[] = [];

  // Главная
  entries.push({
    url: baseUrl,
    lastmod: new Date().toISOString(),
    changefreq: freq(sitemapConfig.changefreq.home),
    priority: sitemapConfig.priorities.home ?? 1,
  });

  // Статьи
  for (const article of articles) {
    entries.push({
      url: `${baseUrl}/${article.slug}`,
      lastmod: article.createdAt
        ? new Date(article.createdAt).toISOString()
        : new Date().toISOString(),
      changefreq: freq(sitemapConfig.changefreq.articles),
      priority: sitemapConfig.priorities.articles ?? 0.8,
    });
  }

  // Категории
  for (const category of categories) {
    entries.push({
      url: `${baseUrl}/${category.slug}`,
      lastmod: new Date().toISOString(),
      changefreq: freq(sitemapConfig.changefreq.categories),
      priority: sitemapConfig.priorities.categories ?? 0.6,
    });
  }

  // Статические страницы
  if (sitemapConfig.includeStaticPages) {
    for (const page of ['about']) {
      entries.push({
        url: `${baseUrl}/${page}`,
        lastmod: new Date().toISOString(),
        changefreq: freq(sitemapConfig.changefreq.static),
        priority: sitemapConfig.priorities.static ?? 0.5,
      });
    }
  }

  const urls = entries
    .map(
      e => `  <url>
    <loc>${escapeXml(e.url)}</loc>
    <lastmod>${e.lastmod}</lastmod>
    <changefreq>${e.changefreq}</changefreq>
    <priority>${e.priority}</priority>
  </url>`
    )
    .join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<?xml-stylesheet type="text/xsl" href="/sitemap.xsl"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`;

  return new Response(xml, {
    headers: { 'Content-Type': 'application/xml; charset=utf-8' },
  });
}
