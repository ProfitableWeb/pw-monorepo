'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Article } from './types';
import { formatDate, generateArticleJsonLd } from '@/utils/seo';
import { useMediaQuery } from './hooks/useMediaQuery';
import './ArticleCard.scss';

interface ArticleCardProps {
  article: Article;
  isPriority?: boolean;
}

/**
 * Компонент карточки статьи для masonry-сетки
 *
 * Адаптивное поведение:
 * - Desktop/Tablet: показывает все элементы (заголовок, подзаголовок, дата, изображение, аннотация)
 * - Mobile: показывает только заголовок, подзаголовок и дату
 *
 * SEO-оптимизация:
 * - Schema.org разметка (JSON-LD)
 * - Semantic HTML
 * - Правильные meta-теги
 */
const ArticleCard: React.FC<ArticleCardProps> = ({
  article,
  isPriority = false,
}) => {
  const isMobile = useMediaQuery('(max-width: 767px)');
  const jsonLd = generateArticleJsonLd(article);

  return (
    <motion.article
      className='article-card'
      layout
      itemScope
      itemType='https://schema.org/BlogPosting'
    >
      {/* JSON-LD для богатых сниппетов Google */}
      <script
        type='application/ld+json'
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Заголовок и подзаголовок - кликабельная область */}
      <Link href={`/${article.slug}`} className='article-card__header-link'>
        <header>
          <h2 itemProp='headline' className='article-card__title'>
            {article.title}
          </h2>
          <div className='article-card__subtitle-wrap'>
            <p itemProp='description' className='article-card__subtitle'>
              {article.subtitle}
            </p>
          </div>
        </header>
      </Link>

      {/* Дата публикации */}
      <time
        itemProp='datePublished'
        dateTime={article.createdAt}
        className='article-card__date'
      >
        {formatDate(article.createdAt)}
      </time>

      {/* Аннотация - скрывается на мобильных */}
      {!isMobile && (
        <>
          {/* Аннотация */}
          <div
            itemProp='articleBody'
            className='article-card__summary'
            dangerouslySetInnerHTML={{ __html: article.summary }}
          />
        </>
      )}

      {/* SEO metadata */}
      <meta itemProp='url' content={`/${article.slug}`} />
      <meta itemProp='author' content='ProfitableWeb' />
      {article.category && (
        <meta itemProp='articleSection' content={article.category} />
      )}
    </motion.article>
  );
};

export default ArticleCard;
