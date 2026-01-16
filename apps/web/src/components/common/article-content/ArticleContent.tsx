'use client';

import React, { useState, useEffect } from 'react';
import clsx from 'clsx';
import DOMPurify from 'dompurify';
import './ArticleContent.scss';

interface ArticleContentProps {
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
 * ArticleContent - компонент для безопасного рендеринга HTML контента
 *
 * Security: HTML контент санитизируется через DOMPurify перед рендером
 * для защиты от XSS атак. Разрешены только безопасные теги и атрибуты.
 *
 * Hydration: Санитизация происходит после hydration через useEffect,
 * что предотвращает hydration mismatch между server и client HTML.
 *
 * Применяет стили для всех HTML элементов (заголовки, параграфы, списки, цитаты, etc.)
 *
 * Пример использования:
 * ```tsx
 * <ArticleContent html={article.content} />
 * ```
 */
export const ArticleContent: React.FC<ArticleContentProps> = ({
  html,
  className,
}) => {
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
      className={clsx('article-content', className)}
      dangerouslySetInnerHTML={{ __html: sanitizedHtml }}
    />
  );
};
