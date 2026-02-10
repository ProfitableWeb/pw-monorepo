'use client';

import React from 'react';
import './LoadMoreButton.scss';

interface LoadMoreButtonProps {
  onClick: () => void;
  isLoading: boolean;
  disabled?: boolean;
}

/**
 * Кнопка "Загрузить ещё" для masonry-сетки
 *
 * @param onClick - Обработчик клика
 * @param isLoading - Состояние загрузки
 * @param disabled - Отключена ли кнопка
 */
const LoadMoreButton: React.FC<LoadMoreButtonProps> = ({
  onClick,
  isLoading,
  disabled = false,
}) => {
  return (
    <div className='load-more'>
      <button
        className='load-more__button'
        onClick={onClick}
        disabled={disabled || isLoading}
      >
        {isLoading ? (
          <>
            <span className='load-more__spinner' />
            <span>Загрузка...</span>
          </>
        ) : (
          <span>Загрузить ещё</span>
        )}
      </button>
    </div>
  );
};

export default LoadMoreButton;
