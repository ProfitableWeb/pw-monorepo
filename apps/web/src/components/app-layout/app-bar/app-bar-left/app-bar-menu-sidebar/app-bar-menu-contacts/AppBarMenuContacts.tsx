'use client';

import React from 'react';
import SocialIcons from '@/components/common/social-icons';
import { SOCIAL_LINKS_AUTHOR } from '@/components/common/social-icons';
import './AppBarMenuContacts.scss';

/**
 * AppBarMenuContacts - блок контактов в мобильном меню
 *
 * Отображает контактную информацию и социальные сети
 * вместо ссылки на страницу контактов.
 */
export const AppBarMenuContacts: React.FC = () => {
  return (
    <div className='app-bar-menu-contacts'>
      <h3 className='app-bar-menu-contacts__title'>Контакты</h3>

      <div className='app-bar-menu-contacts__info'>
        <p className='app-bar-menu-contacts__text'>
          Следите за обновлениями в социальных сетях:
        </p>

        <SocialIcons links={SOCIAL_LINKS_AUTHOR} size='md' />
      </div>
    </div>
  );
};

export default AppBarMenuContacts;
