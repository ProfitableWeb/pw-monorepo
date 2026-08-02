'use client';

import React from 'react';
import Link from 'next/link';
import { SOCIAL_LINKS_FOOTER } from '@/components/common/social-icons';
import { openCookieSettings } from '@/lib/cookie-consent';
import './AppFooter.scss';

/**
 * Компонент крупных иконок социальных сетей для футера
 */
const FooterSocialIcons = () => {
  return (
    <div className='footer-social-icons'>
      {SOCIAL_LINKS_FOOTER.map(link => (
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
const AppFooter = () => {
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
          <nav className='app-footer__legal' aria-label='Правовая информация'>
            <Link href='/privacy' className='app-footer__legal-link'>
              Политика обработки персональных данных
            </Link>
            <span className='app-footer__legal-separator' aria-hidden='true'>
              ·
            </span>
            <button
              type='button'
              className='app-footer__legal-link app-footer__legal-link--button'
              onClick={openCookieSettings}
            >
              Настройки cookie
            </button>
          </nav>
        </div>
      </div>
    </footer>
  );
};

export default AppFooter;
