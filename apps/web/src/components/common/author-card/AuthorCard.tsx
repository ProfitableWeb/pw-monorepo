'use client';

import React from 'react';
import SocialIcons from '@/components/common/social-icons';
import './AuthorCard.scss';

interface AuthorCardProps {
  name: string;
  description: string;
  subscribeLink?: string;
}

export const AuthorCard: React.FC<AuthorCardProps> = ({
  name,
  description,
  subscribeLink = '#',
}) => {
  return (
    <div className="author-card">
      <h3 className="author-card__title">Автор</h3>
      <h4 className="author-card__name">{name}</h4>
      
      <div className="author-card__socials">
        <SocialIcons size="sm" />
      </div>
      
      <p className="author-card__description">{description}</p>
      
      <a
        href={subscribeLink}
        className="author-card__subscribe-btn"
        target="_blank"
        rel="noopener noreferrer"
      >
        Подписаться на <span className="author-card__subscribe-btn-accent">PW</span>
      </a>
    </div>
  );
};
