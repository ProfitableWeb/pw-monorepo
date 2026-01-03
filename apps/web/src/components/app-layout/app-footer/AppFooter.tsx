'use client';

import React from 'react';
import { SOCIAL_LINKS } from '@/components/common/social-icons';
import './AppFooter.scss';

/**
 * Компонент крупных иконок социальных сетей для футера
 */
const FooterSocialIcons: React.FC = () => {
  return (
    <div className='footer-social-icons'>
      {SOCIAL_LINKS.map(link => (
        <a
          key={link.name}
          href={link.href}
          className='footer-social-icons__link'
          aria-label={link.name}
          target='_blank'
          rel='noopener noreferrer'
        >
          <svg
            width='48'
            height='48'
            viewBox='0 0 24 24'
            fill='none'
            xmlns='http://www.w3.org/2000/svg'
          >
            {link.icon}
          </svg>
        </a>
      ))}
    </div>
  );
};

/**
 * Компонент футера приложения
 */
const AppFooter: React.FC = () => {
  return (
    <footer className='app-footer'>
      <div className='app-footer__container'>
        <div className='app-footer__content'>
          <p className='app-footer__text'>
            Паблики проекта{' '}
            <span className='app-footer__brand'>
              Profitable<span className='app-footer__brand--accent'>Web</span>
            </span>
            .ru
            <br />в социальных сетях:
          </p>
          <FooterSocialIcons />
        </div>
      </div>
    </footer>
  );
};

export default AppFooter;
