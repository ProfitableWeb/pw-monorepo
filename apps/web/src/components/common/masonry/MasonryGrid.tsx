import React from 'react';
import { Article } from './types';
import ArticleList from './ArticleList';
import './MasonryGrid.scss';

interface MasonryGridProps {
  articles: Article[];
  className?: string;
}

/**
 * Server Component для masonry-сетки статей
 *
 * SEO-friendly рендеринг на сервере.
 * Все статьи доступны для индексации поисковыми роботами.
 *
 * @param articles - Массив статей для отображения
 * @param className - Дополнительный CSS класс
 */
const MasonryGrid: React.FC<MasonryGridProps> = ({
  articles,
  className = '',
}) => {
  return (
    <section className={`masonry-grid ${className}`} aria-label='Статьи блога'>
      {/* Fallback для ботов без JS */}
      <noscript>
        <div className='masonry-grid__fallback'>
          {articles.map(article => (
            <article key={article.id} className='masonry-grid__fallback-card'>
              <a href={`/articles/${article.slug}`}>
                <h2>{article.title}</h2>
                <p>{article.subtitle}</p>
                <time dateTime={article.createdAt}>
                  {new Date(article.createdAt).toLocaleDateString('ru-RU')}
                </time>
              </a>
            </article>
          ))}
        </div>
      </noscript>

      {/* Интерактивная версия с анимациями */}
      <ArticleList articles={articles} />
    </section>
  );
};

export default MasonryGrid;
