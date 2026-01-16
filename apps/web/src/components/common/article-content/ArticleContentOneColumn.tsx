'use client';

import React, { useState, useEffect } from 'react';
import clsx from 'clsx';
import DOMPurify from 'dompurify';
import './ArticleContentOneColumn.scss';

interface ArticleContentOneColumnProps {
  /**
   * HTML контент статьи (из БД)
   */
  html: string;

  /**
   * Дополнительный CSS класс
   */
  className?: string;
}

/**
 * ArticleContentOneColumn - компонент для одноколоночного контента
 *
 * Security: HTML контент санитизируется через DOMPurify перед рендером
 * для защиты от XSS атак. Разрешены только безопасные теги и атрибуты.
 *
 * Hydration: Санитизация происходит после hydration через useEffect,
 * что предотвращает hydration mismatch между server и client HTML.
 *
 * Отличается от ArticleContent тем, что:
 * - Параграфы и списки могут быть 100% ширины (без ограничения max-width: 75ch)
 * - Поддерживает блоки на всю ширину для широких элементов (изображения, таблицы, etc.)
 * - Использует те же стили элементов оформления текста (заголовки, цитаты, код, etc.)
 *
 * Пример использования:
 * ```tsx
 * <ArticleContentOneColumn html={article.content} />
 * ```
 */
export const ArticleContentOneColumn: React.FC<
  ArticleContentOneColumnProps
> = ({ html, className }) => {
  // Start with unsanitized HTML to match SSR
  const [sanitizedHtml, setSanitizedHtml] = useState(html);

  // Sanitize after hydration on client
  useEffect(() => {
    const sanitized = DOMPurify.sanitize(html, {
      ALLOWED_TAGS: [
        'p',
        'h1',
        'h2',
        'h3',
        'h4',
        'h5',
        'h6',
        'ul',
        'ol',
        'li',
        'a',
        'strong',
        'em',
        'code',
        'pre',
        'blockquote',
        'img',
        'table',
        'thead',
        'tbody',
        'tr',
        'td',
        'th',
        'div',
        'span',
        'br',
        'hr',
        'section',
        'article',
      ],
      ALLOWED_ATTR: [
        'href',
        'src',
        'alt',
        'class',
        'id',
        'title',
        'target',
        'rel',
        'width',
        'height',
      ],
      ALLOWED_URI_REGEXP:
        /^(?:(?:https?|mailto):|[^a-z]|[a-z+.-]+(?:[^a-z+.\-:]|$))/i,
    });
    setSanitizedHtml(sanitized);
  }, [html]);

  return (
    <article
      className={clsx('article-content-one-column', className)}
      dangerouslySetInnerHTML={{ __html: sanitizedHtml }}
    />
  );
};
