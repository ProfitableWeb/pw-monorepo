'use client';

import React from 'react';
import SocialIcons from '@/components/common/social-icons';
import {
  SOCIAL_LINKS_AUTHOR,
  buildSocialLinks,
} from '@/components/common/social-icons';
import { AUTHOR_FALLBACK } from '@/config/author';
import type { Author } from '@/lib/api-client';
import './AuthorCard.scss';

interface AuthorCardProps {
  author?: Author;
}

export const AuthorCard = ({ author }: AuthorCardProps) => {
  const name = author?.name ?? AUTHOR_FALLBACK.name;
  const bio = author?.bio ?? AUTHOR_FALLBACK.description;
  const avatar = author?.avatar ?? AUTHOR_FALLBACK.avatar;
  const socialLinks = author?.socialLinks
    ? buildSocialLinks(author.socialLinks)
    : SOCIAL_LINKS_AUTHOR;
  const hasSocials = socialLinks.length > 0;

  return (
    <div className='author-card'>
      <div className='author-card__header'>
        <div className='author-card__avatar'>
          <img src={avatar} alt={name} className='author-card__avatar-img' />
        </div>
        <div className='author-card__meta'>
          <h3 className='author-card__title'>Автор</h3>
          <h4 className='author-card__name'>{name}</h4>
        </div>
      </div>

      {hasSocials && (
        <div className='author-card__socials'>
          <SocialIcons
            size='md'
            className='author-card__socials-icons'
            links={socialLinks}
          />
        </div>
      )}

      {bio && <p className='author-card__description'>{bio}</p>}
    </div>
  );
};
