'use client';

import React, { useMemo, useState } from 'react';
import { motion, LayoutGroup, AnimatePresence } from 'framer-motion';
import { Article } from './types';
import { useResponsiveColumns } from './hooks/useResponsiveColumns';
import { usePreferReducedMotion } from './hooks/usePreferReducedMotion';
import { distributeArticles } from './utils';
import ArticleCard from './ArticleCard';
import LoadMoreButton from './LoadMoreButton';
import './ArticleList.scss';

interface ArticleListProps {
  articles: Article[];
  initialCount?: number;
  loadMoreCount?: number;
}

/**
 * Client Component для отображения masonry-сетки с анимациями
 *
 * Особенности:
 * - Адаптивное количество колонок (1-6 в зависимости от разрешения)
 * - Staggered анимации появления
 * - Layout animations при resize окна
 * - Debounced resize events для производительности
 * - Поддержка prefers-reduced-motion
 * - Кнопка "Загрузить ещё" с имитацией загрузки
 */
const ArticleList = ({
  articles,
  initialCount = 12,
  loadMoreCount = 12,
}: ArticleListProps) => {
  const columnCount = useResponsiveColumns(100);
  const prefersReducedMotion = usePreferReducedMotion();

  // Состояние для управления отображаемыми статьями
  const [displayCount, setDisplayCount] = useState(initialCount);
  const [isLoading, setIsLoading] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  // Отображаемые статьи
  const displayedArticles = useMemo(
    () => articles.slice(0, displayCount),
    [articles, displayCount]
  );

  // Распределяем статьи по колонкам
  // На сервере всегда используем 3 колонки для предсказуемого SSR
  const effectiveColumnCount = isMounted ? columnCount : 3;

  const columns = useMemo(
    () => distributeArticles(displayedArticles, effectiveColumnCount),
    [displayedArticles, effectiveColumnCount]
  );

  // Обработчик загрузки
  const handleLoadMore = () => {
    setIsLoading(true);

    // Имитация загрузки
    setTimeout(() => {
      setDisplayCount(prev => prev + loadMoreCount);
      setIsLoading(false);
    }, 800);
  };

  // Проверяем, есть ли ещё статьи
  const hasMore = displayCount < articles.length;

  // Эффект для предотвращения hydration mismatch
  // После первого рендера — переключаемся на реальное значение
  React.useEffect(() => {
    setIsMounted(true); // применяется columnCount
  }, []);

  // Transition для карточек
  const cardTransition = {
    duration: prefersReducedMotion ? 0 : 0.25,
    ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number],
  };

  return (
    <>
      <LayoutGroup>
        <div className='article-list'>
          {columns.map((column, columnIndex) => (
            <div key={columnIndex} className='article-list__column'>
              <AnimatePresence mode='popLayout'>
                {column.map((article, articleIndex) => {
                  const globalIndex =
                    columnIndex + articleIndex * columns.length;
                  return (
                    <motion.div
                      key={article.id}
                      initial={{ opacity: 0, y: 20, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      transition={{
                        ...cardTransition,
                        delay: prefersReducedMotion ? 0 : globalIndex * 0.015,
                      }}
                      layout
                    >
                      <ArticleCard
                        article={article}
                        isPriority={columnIndex === 0 && articleIndex < 2}
                      />
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </LayoutGroup>

      {/* Кнопка "Загрузить ещё" */}
      {hasMore && (
        <LoadMoreButton onClick={handleLoadMore} isLoading={isLoading} />
      )}
    </>
  );
};

export default ArticleList;
