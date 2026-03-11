/**
 * NumberInput — числовой инпут с кнопками ±, суффиксом и скрытыми стрелками.
 */

import * as React from 'react';
import { Minus, Plus } from 'lucide-react';
import { cn } from './utils';

interface NumberInputProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  suffix?: string;
  className?: string;
  disabled?: boolean;
}

function NumberInput({
  value,
  onChange,
  min = 0,
  max = Infinity,
  step = 1,
  suffix,
  className,
  disabled,
}: NumberInputProps) {
  const clamp = (v: number) => Math.max(min, Math.min(max, v));

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    if (raw === '') return;
    const num = Number(raw);
    if (!Number.isNaN(num)) onChange(clamp(num));
  };

  return (
    <div
      className={cn(
        'inline-flex items-center rounded-md border border-input bg-input-background dark:bg-input/30 h-9',
        disabled && 'opacity-50 pointer-events-none',
        className
      )}
    >
      <button
        type='button'
        onClick={() => onChange(clamp(value - step))}
        disabled={disabled || value <= min}
        className='flex items-center justify-center size-9 text-muted-foreground hover:text-foreground hover:bg-accent/50 rounded-l-md transition-colors disabled:opacity-30'
        tabIndex={-1}
      >
        <Minus className='size-3.5' />
      </button>

      <input
        type='text'
        inputMode='numeric'
        value={value}
        onChange={handleChange}
        disabled={disabled}
        className='w-12 text-center text-sm font-mono bg-transparent border-none outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none'
      />

      {suffix && (
        <span className='text-sm text-muted-foreground pr-1 select-none'>
          {suffix}
        </span>
      )}

      <button
        type='button'
        onClick={() => onChange(clamp(value + step))}
        disabled={disabled || value >= max}
        className='flex items-center justify-center size-9 text-muted-foreground hover:text-foreground hover:bg-accent/50 rounded-r-md transition-colors disabled:opacity-30'
        tabIndex={-1}
      >
        <Plus className='size-3.5' />
      </button>
    </div>
  );
}

export { NumberInput };
