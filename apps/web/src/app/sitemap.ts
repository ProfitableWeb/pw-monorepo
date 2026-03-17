/**
 * PW-049-A | Динамический sitemap.xml
 * Генерируется на основе SEO-настроек из API + контента (статьи, категории).
 */

import type { MetadataRoute } from 'next';

import { baseUrl } from '@/config/metadata';
import { getAllArticles, getAllCategories } from '@/lib/api-client';
import { getSeoConfig } from '@/lib/seo-config';

export const revalidate = 3600; // 1 час

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const config = await getSeoConfig();

  if (!config || !config.sitemapConfig.enabled) return [];

  const { sitemapConfig } = config;
  const entries: MetadataRoute.Sitemap = [];

  // Главная
  entries.push({
    url: baseUrl,
    lastModified: new Date(),
    changeFrequency: sitemapConfig.changefreq
      .home as MetadataRoute.Sitemap[number]['changeFrequency'],
    priority: sitemapConfig.priorities.home,
  });

  // Статьи
  if (sitemapConfig.includeArticles) {
    const articles = await getAllArticles();
    for (const article of articles) {
      entries.push({
        url: `${baseUrl}/${article.slug}`,
        lastModified: article.createdAt
          ? new Date(article.createdAt)
          : new Date(),
        changeFrequency: sitemapConfig.changefreq
          .articles as MetadataRoute.Sitemap[number]['changeFrequency'],
        priority: sitemapConfig.priorities.articles,
      });
    }
  }

  // Категории
  if (sitemapConfig.includeCategories) {
    const categories = await getAllCategories();
    for (const category of categories) {
      entries.push({
        url: `${baseUrl}/${category.slug}`,
        lastModified: new Date(),
        changeFrequency: sitemapConfig.changefreq
          .categories as MetadataRoute.Sitemap[number]['changeFrequency'],
        priority: sitemapConfig.priorities.categories,
      });
    }
  }

  // Статические страницы
  if (sitemapConfig.includeStaticPages) {
    const staticPages = ['about'];
    for (const page of staticPages) {
      entries.push({
        url: `${baseUrl}/${page}`,
        lastModified: new Date(),
        changeFrequency: sitemapConfig.changefreq
          .static as MetadataRoute.Sitemap[number]['changeFrequency'],
        priority: sitemapConfig.priorities.static,
      });
    }
  }

  return entries;
}
