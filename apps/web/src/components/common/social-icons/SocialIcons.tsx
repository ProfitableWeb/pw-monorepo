'use client';

import React from 'react';
import { SOCIAL_LINKS, SocialLink } from './socialLinks';
import './SocialIcons.scss';

interface SocialIconsProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showLabels?: boolean;
  links?: SocialLink[]; // Кастомный список иконок
}

const SocialIcons = ({
  className = '',
  size = 'md',
  showLabels = false,
  links,
}: SocialIconsProps) => {
  const displayLinks = links || SOCIAL_LINKS;

  return (
    <div className={`social-icons social-icons--${size} ${className}`}>
      {displayLinks.map(link => (
        <a
          key={link.name}
          href={link.href}
          className='social-icons__link'
          aria-label={link.name}
          target='_blank'
          rel='noopener noreferrer'
        >
          <span className='social-icons__icon'>
            <svg
              width='24'
              height='24'
              viewBox='0 0 24 24'
              fill='none'
              xmlns='http://www.w3.org/2000/svg'
            >
              {link.icon}
            </svg>
          </span>
          {showLabels && (
            <span className='social-icons__label'>{link.name}</span>
          )}
        </a>
      ))}
    </div>
  );
};

export default SocialIcons;
