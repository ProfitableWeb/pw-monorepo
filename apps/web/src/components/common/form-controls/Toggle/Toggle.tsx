'use client';

import React from 'react';
import { LuCheck, LuX } from 'react-icons/lu';
import './Toggle.scss';

interface ToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
  description?: string;
  ariaLabel?: string;
  disabled?: boolean;
}

export const Toggle = ({
  checked,
  onChange,
  label,
  description,
  ariaLabel,
  disabled = false,
}: ToggleProps) => {
  return (
    <button
      className={`toggle ${checked ? 'active' : ''} ${disabled ? 'disabled' : ''}`}
      onClick={() => !disabled && onChange(!checked)}
      disabled={disabled}
      aria-label={ariaLabel}
      type='button'
    >
      <div className='toggle__info'>
        <div className='toggle__label'>{label}</div>
        {description && (
          <div className='toggle__description'>{description}</div>
        )}
      </div>
      <div className='toggle__slider'>{checked ? <LuCheck /> : <LuX />}</div>
    </button>
  );
};
