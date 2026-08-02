'use client';

import React from 'react';
import Link from 'next/link';
import { Modal } from '@/components/common/modal';
import { useAuth } from '@/contexts/auth';
import type { AuthProvider } from '@/contexts/auth';
import './AuthModal.scss';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// SVG paths для иконок провайдеров
const PROVIDER_ICONS: Record<
  AuthProvider,
  { viewBox: string; content: React.ReactNode }
> = {
  yandex: {
    viewBox: '0 0 256 512',
    content: (
      <path
        d='M153.1 315.8L65.7 512H2L98 302.2C52.9 279.3 22.8 237.8 22.8 161.1 22.7 53.7 90.8 0 171.7 0H254v512h-55.1V315.8h-45.8zM198.9 46.5h-29.4c-44.4 0-87.4 29.4-87.4 114.6 0 82.3 39.4 108.8 87.4 108.8h29.4V46.5z'
        fill='currentColor'
      />
    ),
  },
  telegram: {
    viewBox: '0 0 24 24',
    content: (
      <path
        d='M20.9439 5.45585L18.0725 19.0357C17.8538 19.9969 17.2932 20.2303 16.4864 19.7772L12.1247 16.5504L10.019 18.5826C9.78658 18.816 9.59516 19.0082 9.14395 19.0082L9.45843 14.5457L17.553 7.19968C17.9085 6.88386 17.4709 6.70536 17.006 7.02117L6.99726 13.3511L2.6902 11.9918C1.74675 11.7034 1.73308 11.0443 2.88163 10.6049L19.7407 4.08276C20.52 3.79442 21.2037 4.26127 20.9439 5.45585Z'
        fill='currentColor'
      />
    ),
  },
};

// Telegram использует Login Widget (не OAuth redirect), поэтому обрабатывается отдельно.
// Иностранные провайдеры входа в проекте не используются — см. ADR-002.
const OAUTH_PROVIDERS: { id: AuthProvider; name: string }[] = [
  { id: 'yandex', name: 'Яндекс' },
];

export const AuthModal = ({ isOpen, onClose }: AuthModalProps) => {
  const { login } = useAuth();

  const handleLogin = (provider: AuthProvider) => {
    login(provider);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title='Вход на сайт'
      subtitle='Выберите способ входа'
      size='small'
      contentPadding={{
        top: 'calc(var(--base-content-padding-top, 24px) - 15px)',
      }}
    >
      <div className='auth-modal'>
        <div className='auth-modal__providers'>
          {OAUTH_PROVIDERS.map(provider => (
            <button
              key={provider.id}
              className='auth-modal__provider'
              onClick={() => handleLogin(provider.id)}
              aria-label={`Войти через ${provider.name}`}
              type='button'
            >
              <svg
                width='48'
                height='48'
                viewBox={PROVIDER_ICONS[provider.id].viewBox}
                fill='none'
                xmlns='http://www.w3.org/2000/svg'
              >
                {PROVIDER_ICONS[provider.id].content}
              </svg>
            </button>
          ))}
        </div>
        <p className='auth-modal__consent'>
          Нажимая кнопку входа, вы соглашаетесь с обработкой персональных данных
          в соответствии с{' '}
          <Link
            href='/privacy'
            className='auth-modal__consent-link'
            target='_blank'
            onClick={onClose}
          >
            Политикой обработки персональных данных
          </Link>
          .
        </p>
      </div>
    </Modal>
  );
};
