'use client';

import React from 'react';
import { HiSearch } from 'react-icons/hi';
import { LuLogIn } from 'react-icons/lu';
import ThemeToggle from '@/components/common/theme-toggle';
import './AppBarActions.scss';

const AppBarActions: React.FC = () => {
  return (
    <div className='action-buttons'>
      {/* Переключатель темы */}
      <ThemeToggle />
      <button className='action-buttons__button' aria-label='Поиск'>
        <HiSearch />
      </button>
      <button className='action-buttons__button' aria-label='Вход на сайт'>
        <LuLogIn />
      </button>
    </div>
  );
};

export default AppBarActions;
