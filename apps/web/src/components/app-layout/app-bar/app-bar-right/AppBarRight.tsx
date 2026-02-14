'use client';

import React from 'react';
import SocialIcons from '@/components/common/social-icons';
import { SOCIAL_LINKS_APPBAR } from '@/components/common/social-icons';
import AppBarActions from './app-bar-actions/';
import './AppBarRight.scss';

const AppBarRight = () => {
  return (
    <div className='app-bar__right'>
      {/* Социальные иконки */}
      <SocialIcons size='md' links={SOCIAL_LINKS_APPBAR} />
      {/* Кнопки действий */}
      <AppBarActions />
    </div>
  );
};

export default AppBarRight;
