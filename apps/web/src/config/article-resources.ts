/**
 * Пример ресурсов для статей
 *
 * Моковые данные для тестирования компонента ArticleResources
 */

import { Resource } from '@/components/common/article-resources';

export const exampleArticleResources: Resource[] = [
  {
    id: '1',
    title: 'Оптимальная ширина строки для чтения',
    url: 'https://baymard.com/blog/line-length-readability',
    description: 'Исследование о влиянии длины строки на читаемость текста',
    external: true,
  },
  {
    id: '2',
    title: 'Retrieval Practice: A Powerful Learning Strategy',
    url: 'https://www.retrievalpractice.org/',
    description: 'Официальный ресурс о практике активного вспоминания',
    external: true,
  },
  {
    id: '3',
    title: 'Schema.org FAQPage Documentation',
    url: 'https://schema.org/FAQPage',
    description: 'Документация по использованию FAQPage schema для SEO',
    external: true,
  },
  {
    id: '4',
    title: 'Web Content Accessibility Guidelines (WCAG)',
    url: 'https://www.w3.org/WAI/WCAG21/quickref/',
    description: 'Руководство по доступности веб-контента',
    external: true,
  },
];
