'use client';

import React from 'react';
import { Toggle } from '@/components/common/form-controls';

interface NotificationSettingProps {
  label: string;
  description: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  ariaLabel?: string;
}

export const NotificationSetting = ({
  label,
  description,
  checked,
  onChange,
  ariaLabel,
}: NotificationSettingProps) => {
  return (
    <div className='notification-setting'>
      <div className='notification-setting__info'>
        <span className='notification-setting__title'>{label}</span>
        <span className='notification-setting__description'>{description}</span>
      </div>
      <Toggle
        checked={checked}
        onChange={onChange}
        label={label}
        ariaLabel={ariaLabel}
      />
    </div>
  );
};
