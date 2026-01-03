'use client';

import React from 'react';
import { SOCIAL_LINKS } from './socialLinks';
import './SocialIcons.scss';

interface SocialIconsProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showLabels?: boolean;
}

const SocialIcons: React.FC<SocialIconsProps> = ({
  className = '',
  size = 'md',
  showLabels = false,
}) => {
  return (
    <div className={`social-icons social-icons--${size} ${className}`}>
      {SOCIAL_LINKS.map(link => (
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
