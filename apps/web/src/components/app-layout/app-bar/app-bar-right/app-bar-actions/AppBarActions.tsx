'use client';

import React, { useState } from 'react';
import { HiSearch } from 'react-icons/hi';
import { LuLogIn } from 'react-icons/lu';
import ThemeToggle from '@/components/common/theme-toggle';
import { AuthModal } from '@/components/common/auth-modal';
import { UserMenu } from '../user-menu';
import { useAuth } from '@/contexts/auth';
import './AppBarActions.scss';

const AppBarActions = () => {
  const { isAuthenticated } = useAuth();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  return (
    <div className='action-buttons'>
      {/* Переключатель темы */}
      <ThemeToggle />
      <button className='action-buttons__button' aria-label='Поиск'>
        <HiSearch />
      </button>

      {/* Кнопка входа или меню пользователя */}
      {isAuthenticated ? (
        <UserMenu />
      ) : (
        <button
          className='action-buttons__button'
          aria-label='Вход на сайт'
          onClick={() => setIsAuthModalOpen(true)}
        >
          <LuLogIn />
        </button>
      )}

      {/* Модальное окно авторизации */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />
    </div>
  );
};

export default AppBarActions;
