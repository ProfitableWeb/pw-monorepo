'use client';

import React from 'react';
import SocialIcons from '@/components/common/social-icons';
import { SOCIAL_LINKS_AUTHOR } from '@/components/common/social-icons';
import './ArticleAuthorBlock.scss';

interface ArticleAuthorBlockProps {
  /**
   * Имя автора
   */
  name?: string;

  /**
   * Описание/биография автора
   */
  description?: string;

  /**
   * Дополнительный CSS класс
   */
  className?: string;
}

// Моковые данные по умолчанию
const DEFAULT_AUTHOR = {
  name: 'Николай Егоров',
  description:
    'Фуллстек-разработчик и дизайнер с опытом более 15 лет. Исследователь агентных систем, AI-автоматизации.',
};

/**
 * ArticleAuthorBlock - блок автора статьи
 *
 * Отображается под заголовком статьи.
 * Содержит аватар (пока серый кружок), имя, социальные сети и описание автора.
 *
 * Пример использования:
 * ```tsx
 * <ArticleAuthorBlock
 *   name="Николай Егоров"
 *   description="Полимат: фуллстек-разработчик, дизайнер и исследователь агентных систем. Опыт более 15 лет."
 * />
 * ```
 */
export const ArticleAuthorBlock: React.FC<ArticleAuthorBlockProps> = ({
  name = DEFAULT_AUTHOR.name,
  description = DEFAULT_AUTHOR.description,
  className = '',
}) => {
  return (
    <div className={`article-author-block ${className}`}>
      {/* Аватар */}
      <div className='article-author-block__avatar'>
        <img
          src='/imgs/author/avatar.jpg'
          alt={name}
          className='article-author-block__avatar-img'
        />
      </div>

      {/* Имя и социальные сети */}
      <div className='article-author-block__meta'>
        <span className='article-author-block__label'>Автор статьи</span>
        <h3 className='article-author-block__name'>{name}</h3>

        {/* Социальные сети */}
        <div className='article-author-block__socials'>
          <SocialIcons
            size='md'
            className='article-author-block__socials-icons'
            links={SOCIAL_LINKS_AUTHOR}
          />
        </div>
      </div>

      {/* Разделитель и описание */}
      {description && (
        <>
          <span className='article-author-block__divider' aria-hidden='true' />
          <div className='article-author-block__description-container'>
            <p className='article-author-block__description'>{description}</p>
            <a href='/author' className='article-author-block__link'>
              Подробнее
            </a>
          </div>
        </>
      )}
    </div>
  );
};
