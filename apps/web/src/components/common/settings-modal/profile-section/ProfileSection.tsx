'use client';

import React from 'react';
import { Input, Button } from '@/components/common/form-controls';
import { useAuth } from '@/contexts/auth';
import type { UserSettings } from '@profitable-web/types';
import './ProfileSection.scss';

interface ProfileSectionProps {
  settings: UserSettings['profile'];
  onUpdate: (updates: Partial<UserSettings['profile']>) => void;
}

export const ProfileSection = ({ settings, onUpdate }: ProfileSectionProps) => {
  const { user } = useAuth();

  return (
    <div className='settings-profile-section'>
      <div className='settings-profile-section__avatar-section'>
        <div className='settings-profile-section__avatar-wrapper'>
          <img
            src={user?.avatar || '/imgs/author/avatar.jpg'}
            alt={settings.name || 'Avatar'}
            className='settings-profile-section__avatar'
          />
        </div>
        <Button variant='outline' size='sm'>
          Изменить аватар
        </Button>
      </div>

      <div className='settings-profile-section__form-group'>
        <Input
          label='Имя'
          placeholder='Введите имя'
          value={settings.name || user?.name || ''}
          onChange={e => onUpdate({ name: e.target.value })}
          fullWidth
        />
      </div>

      <div className='settings-profile-section__form-group'>
        <Input
          label='Email'
          type='email'
          placeholder='your@email.com'
          value={settings.email}
          onChange={e => onUpdate({ email: e.target.value })}
          fullWidth
        />
      </div>
    </div>
  );
};
