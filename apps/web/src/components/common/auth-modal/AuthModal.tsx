'use client';

import React from 'react';
import { Modal } from '@/components/common/modal';
import { useAuth } from '@/contexts/auth';
import { toast } from '@/components/common/toast';
import type { AuthProvider } from '@/contexts/auth';
import './AuthModal.scss';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// SVG paths для иконок провайдеров
const PROVIDER_ICONS: Record<AuthProvider, React.ReactNode> = {
  vk: (
    <path
      fillRule='evenodd'
      clipRule='evenodd'
      d='M22.9946 5.88952C23.1531 5.37774 22.9946 5 22.2509 5H19.7881C19.1663 5 18.8737 5.329 18.7152 5.68237C18.7152 5.68237 17.4594 8.67994 15.6915 10.6296C15.1185 11.1901 14.8625 11.3729 14.5455 11.3729C14.387 11.3729 14.1553 11.1901 14.1553 10.6783V5.88952C14.1553 5.28026 13.9846 5 13.4604 5H9.59547C9.20532 5 8.97367 5.28026 8.97367 5.56052C8.97367 6.14541 9.86369 6.27945 9.94904 7.91227V11.4703C9.94904 12.2502 9.80273 12.3964 9.49793 12.3964C8.66886 12.3964 6.63277 9.38668 5.42575 5.93826C5.1941 5.26807 4.95026 5 4.32846 5H1.84126C1.13411 5 1 5.329 1 5.68237C1 6.32819 1.82907 9.49634 4.8893 13.7002C6.92538 16.5638 9.79054 18.1235 12.3997 18.1235C13.9603 18.1235 14.1553 17.7823 14.1553 17.1852V15.0162C14.1553 14.3217 14.3016 14.1877 14.8015 14.1877C15.1673 14.1877 15.7891 14.3704 17.2521 15.7474C18.9225 17.3924 19.2029 18.1235 20.1417 18.1235H22.6045C23.3116 18.1235 23.6652 17.7823 23.4579 17.0999C23.2385 16.4175 22.4338 15.4305 21.3853 14.2608C20.8122 13.5906 19.9466 12.8716 19.6906 12.5183C19.3248 12.0552 19.4345 11.8481 19.6906 11.446C19.6906 11.446 22.6898 7.29082 23.0068 5.88952H22.9946Z'
      fill='currentColor'
    />
  ),
  telegram: (
    <path
      d='M20.9439 5.45585L18.0725 19.0357C17.8538 19.9969 17.2932 20.2303 16.4864 19.7772L12.1247 16.5504L10.019 18.5826C9.78658 18.816 9.59516 19.0082 9.14395 19.0082L9.45843 14.5457L17.553 7.19968C17.9085 6.88386 17.4709 6.70536 17.006 7.02117L6.99726 13.3511L2.6902 11.9918C1.74675 11.7034 1.73308 11.0443 2.88163 10.6049L19.7407 4.08276C20.52 3.79442 21.2037 4.26127 20.9439 5.45585Z'
      fill='currentColor'
    />
  ),
};

const PROVIDERS: { id: AuthProvider; name: string }[] = [
  { id: 'vk', name: 'VKontakte' },
  { id: 'telegram', name: 'Telegram' },
];

export const AuthModal = ({ isOpen, onClose }: AuthModalProps) => {
  const { login } = useAuth();

  const handleLogin = (provider: AuthProvider) => {
    login(provider);
    onClose();
    toast.success('Добро пожаловать!');
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title='Вход на сайт'
      subtitle='Выберите способ входа'
      size='small'
      contentPadding={{
        top: 'calc(var(--base-content-padding-top, 24px) - 15px)', // 9px для desktop, 1px для mobile
      }}
    >
      <div className='auth-modal'>
        <div className='auth-modal__providers'>
          {PROVIDERS.map(provider => (
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
                viewBox='0 0 24 24'
                fill='none'
                xmlns='http://www.w3.org/2000/svg'
              >
                {PROVIDER_ICONS[provider.id]}
              </svg>
            </button>
          ))}
        </div>
      </div>
    </Modal>
  );
};
