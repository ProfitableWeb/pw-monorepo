'use client';

import React, { useState, useEffect, useRef } from 'react';
import clsx from 'clsx';
import DOMPurify from 'dompurify';
import './ArticleContent.scss';
import { headingToId } from './heading-id';
import { useCopyCodeButtons } from './use-copy-code-buttons';

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
export const ArticleContent = ({ html, className }: ArticleContentProps) => {
  const containerRef = useRef<HTMLElement>(null);
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
        'mark',
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
        'style',
        'tabindex',
      ],
      ALLOWED_URI_REGEXP:
        /^(?:(?:https?|mailto):|[^a-z]|[a-z+.-]+(?:[^a-z+.\-:]|$))/i,
    });
    // Добавляем id к заголовкам h2-h4 для навигации через ToC
    const withHeadingIds = sanitized.replace(
      /<h([2-4])([^>]*)>([\s\S]*?)<\/h[2-4]>/gi,
      (match, level, attrs, inner) => {
        if (/id\s*=/i.test(attrs)) return match;
        const text = inner.replace(/<[^>]+>/g, '').trim();
        const id = headingToId(text);
        return `<h${level}${attrs} id="${id}">${inner}</h${level}>`;
      }
    );

    setSanitizedHtml(withHeadingIds);
  }, [html]);

  useCopyCodeButtons(containerRef, sanitizedHtml);

  return (
    <article
      ref={containerRef}
      className={clsx('article-content', className)}
      dangerouslySetInnerHTML={{ __html: sanitizedHtml }}
    />
  );
};
