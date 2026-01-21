'use client';

import React, { useState, useCallback, useEffect } from 'react';
import { HiSearch } from 'react-icons/hi';
import { IoClose } from 'react-icons/io5';
import './MyCommentsSearch.scss';

interface MyCommentsSearchProps {
  onSearch: (query: string) => void;
  resultCount?: number;
  isLoading?: boolean;
}

/**
 * MyCommentsSearch - компонент поиска по комментариям
 */
export const MyCommentsSearch: React.FC<MyCommentsSearchProps> = ({
  onSearch,
  resultCount,
  isLoading = false,
}) => {
  const [query, setQuery] = useState('');

  // Debounce функция
  const debouncedSearch = useCallback(
    ((fn: (q: string) => void, delay: number) => {
      let timeoutId: NodeJS.Timeout;
      return (q: string) => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => fn(q), delay);
      };
    })(onSearch, 300),
    [onSearch]
  );

  useEffect(() => {
    debouncedSearch(query);
  }, [query, debouncedSearch]);

  const handleClear = () => {
    setQuery('');
  };

  const hasValue = query.trim().length > 0;

  return (
    <div className='my-comments-search'>
      <div className='my-comments-search__container'>
        <div className='my-comments-search__input-wrapper'>
          <HiSearch className='my-comments-search__icon' />
          <input
            type='text'
            className='my-comments-search__input'
            placeholder='Поиск по комментариям...'
            value={query}
            onChange={e => setQuery(e.target.value)}
            aria-label='Поиск по комментариям'
          />
          {hasValue && (
            <button
              className='my-comments-search__clear'
              onClick={handleClear}
              aria-label='Очистить поиск'
            >
              <IoClose />
            </button>
          )}
        </div>

        {(hasValue || isLoading) && (
          <div className='my-comments-search__result'>
            {isLoading ? (
              <span className='my-comments-search__result-text'>Поиск...</span>
            ) : (
              <span className='my-comments-search__result-text'>
                {(resultCount ?? 0) === 0
                  ? 'Поиск не дал результатов'
                  : `Найдено: ${resultCount} ${getCommentNoun(resultCount ?? 0)}`}
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

/**
 * Возвращает правильную форму слова "комментарий"
 */
function getCommentNoun(count: number): string {
  const lastTwo = count % 100;
  const lastOne = count % 10;

  if (lastTwo >= 11 && lastTwo <= 19) return 'комментариев';
  if (lastOne === 1) return 'комментарий';
  if (lastOne >= 2 && lastOne <= 4) return 'комментария';
  return 'комментариев';
}
