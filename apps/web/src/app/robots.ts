/**
 * PW-049-B | robots.txt
 * Статическая конфигурация через Next.js Metadata API.
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
