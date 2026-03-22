'use client';

import React from 'react';
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
  google: {
    viewBox: '0 0 24 24',
    content: (
      <path
        d='M21.35 11.1h-9.18v2.73h5.51c-.24 1.28-.99 2.37-2.11 3.1v2.57h3.41c2-1.84 3.15-4.55 3.15-7.77 0-.53-.05-1.04-.14-1.53l-.64-.1zM12.17 22c2.85 0 5.24-.95 6.99-2.57l-3.41-2.57c-.95.63-2.16 1.01-3.58 1.01-2.75 0-5.08-1.86-5.91-4.36H2.72v2.65C4.46 19.82 8.03 22 12.17 22zM6.26 13.51a5.99 5.99 0 010-3.02V7.84H2.72a10.02 10.02 0 000 8.32l3.54-2.65zM12.17 5.87c1.55 0 2.94.53 4.03 1.58l3.02-3.02C17.4 2.77 15.01 1.82 12.17 1.82 8.03 1.82 4.46 3.99 2.72 7.66l3.54 2.65c.83-2.5 3.16-4.44 5.91-4.44z'
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

// Telegram использует Login Widget (не OAuth redirect), поэтому обрабатывается отдельно
const OAUTH_PROVIDERS: { id: AuthProvider; name: string }[] = [
  { id: 'yandex', name: 'Яндекс' },
  { id: 'google', name: 'Google' },
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
      </div>
    </Modal>
  );
};
