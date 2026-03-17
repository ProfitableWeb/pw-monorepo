/**
 * PW-049-A | Динамический sitemap.xml
 * Генерируется на основе SEO-настроек из API + контента (статьи, категории).
 */

import type { MetadataRoute } from 'next';

import { baseUrl } from '@/config/metadata';
import { getAllArticles, getAllCategories } from '@/lib/api-client';
import { getSeoConfig } from '@/lib/seo-config';

export const revalidate = 3600; // 1 час

type ChangeFrequency = MetadataRoute.Sitemap[number]['changeFrequency'];

const VALID_FREQUENCIES = new Set([
  'always',
  'hourly',
  'daily',
  'weekly',
  'monthly',
  'yearly',
  'never',
]);

function toChangeFrequency(value: string | undefined): ChangeFrequency {
  return value && VALID_FREQUENCIES.has(value)
    ? (value as ChangeFrequency)
    : 'weekly';
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const config = await getSeoConfig();

  if (!config || !config.sitemapConfig.enabled) return [];

  const { sitemapConfig } = config;

  // Параллельная загрузка контента
  const [articles, categories] = await Promise.all([
    sitemapConfig.includeArticles ? getAllArticles() : [],
    sitemapConfig.includeCategories ? getAllCategories() : [],
  ]);

  const entries: MetadataRoute.Sitemap = [];

  // Главная
  entries.push({
    url: baseUrl,
    lastModified: new Date(),
    changeFrequency: toChangeFrequency(sitemapConfig.changefreq.home),
    priority: sitemapConfig.priorities.home,
  });

  // Статьи
  for (const article of articles) {
    entries.push({
      url: `${baseUrl}/${article.slug}`,
      lastModified: article.createdAt
        ? new Date(article.createdAt)
        : new Date(),
      changeFrequency: toChangeFrequency(sitemapConfig.changefreq.articles),
      priority: sitemapConfig.priorities.articles,
    });
  }

  // Категории
  for (const category of categories) {
    entries.push({
      url: `${baseUrl}/${category.slug}`,
      lastModified: new Date(),
      changeFrequency: toChangeFrequency(sitemapConfig.changefreq.categories),
      priority: sitemapConfig.priorities.categories,
    });
  }

  // Статические страницы
  if (sitemapConfig.includeStaticPages) {
    const staticPages = ['about'];
    for (const page of staticPages) {
      entries.push({
        url: `${baseUrl}/${page}`,
        lastModified: new Date(),
        changeFrequency: toChangeFrequency(sitemapConfig.changefreq.static),
        priority: sitemapConfig.priorities.static,
      });
    }
  }

  return entries;
}
