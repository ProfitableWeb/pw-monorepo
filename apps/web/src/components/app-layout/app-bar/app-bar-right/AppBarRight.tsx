'use client';

import React from 'react';
import SocialIcons from '@/components/common/social-icons/';
import AppBarActions from './app-bar-actions/';
import './AppBarRight.scss';

const AppBarRight: React.FC = () => {
  return (
    <div className='app-bar__right'>
      {/* Социальные иконки */}
      <SocialIcons size='md' />
      {/* Кнопки действий */}
      <AppBarActions />
    </div>
  );
};

export default AppBarRight;
