'use client';

import React from 'react';
import SocialIcons from '@/components/common/social-icons';
import { SOCIAL_LINKS_AUTHOR } from '@/components/common/social-icons';
import './AuthorCard.scss';

interface AuthorCardProps {
  name?: string;
  description?: string;
}

// Моковые данные по умолчанию
const DEFAULT_AUTHOR = {
  name: 'Николай Егоров',
  description:
    'Исследую веб-разработку, AI-автоматизацию, цифровой дизайн и экономику.',
};

export const AuthorCard = ({
  name = DEFAULT_AUTHOR.name,
  description = DEFAULT_AUTHOR.description,
}: AuthorCardProps) => {
  return (
    <div className='author-card'>
      <div className='author-card__header'>
        <div className='author-card__avatar'>
          <img
            src='/imgs/author/avatar.jpg'
            alt={name}
            className='author-card__avatar-img'
          />
        </div>
        <div className='author-card__meta'>
          <h3 className='author-card__title'>Автор</h3>
          <h4 className='author-card__name'>{name}</h4>
        </div>
      </div>

      <div className='author-card__socials'>
        <SocialIcons
          size='md'
          className='author-card__socials-icons'
          links={SOCIAL_LINKS_AUTHOR}
        />
      </div>

      <p className='author-card__description'>{description}</p>
    </div>
  );
};
