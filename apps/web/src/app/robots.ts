/**
 * PW-049-B | Динамический robots.txt
 * Возвращает текст из SEO-настроек API.
 * Next.js Metadata API генерирует /robots.txt автоматически.
 */

import type { MetadataRoute } from 'next';

import { baseUrl } from '@/config/metadata';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin/', '/api/', '/preview/'],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: 'profitableweb.ru',
  };
}
