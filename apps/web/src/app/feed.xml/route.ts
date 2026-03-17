/**
 * PW-049-C | RSS/Atom-фид
 * Генерирует фид на основе SEO-настроек и статей из API.
 */

import { Feed } from 'feed';

import { baseUrl, coreMetadata } from '@/config/metadata';
import { AUTHOR_DATA } from '@/config/author';
import { getAllArticles } from '@/lib/api-client';
import { getSeoConfig } from '@/lib/seo-config';

export const revalidate = 3600; // 1 час

export async function GET() {
  const config = await getSeoConfig();

  if (!config || !config.rssConfig.enabled) {
    return new Response('Feed disabled', { status: 404 });
  }

  const { rssConfig } = config;

  const feed = new Feed({
    title: coreMetadata.title.default,
    description: coreMetadata.description,
    id: baseUrl,
    link: baseUrl,
    language: 'ru',
    image: `${baseUrl}/og-image.jpg`,
    favicon: `${baseUrl}/imgs/favicon/favicon.ico`,
    copyright: `© ${new Date().getFullYear()} ${coreMetadata.siteName}`,
    updated: new Date(),
    feedLinks: {
      atom: `${baseUrl}/feed.xml`,
    },
    author: {
      name: AUTHOR_DATA.name,
      email: AUTHOR_DATA.email,
      link: AUTHOR_DATA.url,
    },
  });

  if (rssConfig.includeArticles) {
    const articles = await getAllArticles();
    const items = articles.slice(0, rssConfig.itemCount);

    for (const article of items) {
      feed.addItem({
        title: article.title,
        id: `${baseUrl}/${article.slug}`,
        link: `${baseUrl}/${article.slug}`,
        description: article.summary || article.subtitle || '',
        date: article.createdAt ? new Date(article.createdAt) : new Date(),
        image: article.imageUrl ? `${baseUrl}${article.imageUrl}` : undefined,
        author: [
          {
            name: AUTHOR_DATA.name,
            email: AUTHOR_DATA.email,
            link: AUTHOR_DATA.url,
          },
        ],
      });
    }
  }

  const isAtom = rssConfig.format === 'atom';
  let xml = isAtom ? feed.atom1() : feed.rss2();

  // Вставляем XSL processing instruction после XML-декларации
  xml = xml.replace(
    /(<\?xml[^?]*\?>)/,
    '$1\n<?xml-stylesheet type="text/xsl" href="/feed.xsl"?>'
  );

  // application/xml позволяет браузерам применить XSL-стилизацию;
  // RSS-ридеры корректно определяют формат по содержимому XML.
  return new Response(xml, {
    headers: { 'Content-Type': 'application/xml; charset=utf-8' },
  });
}
