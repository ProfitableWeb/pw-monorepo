import { useState } from 'react';
import { Input } from '@/app/components/ui/input';
import { Eye, EyeOff } from 'lucide-react';
import { cn } from '@/app/components/ui/utils';

// Password input с toggle видимости
export function PasswordInput(
  props: React.InputHTMLAttributes<HTMLInputElement> & { className?: string }
) {
  const [visible, setVisible] = useState(false);
  return (
    <div className='relative'>
      <Input
        {...props}
        type={visible ? 'text' : 'password'}
        autoComplete='new-password'
        className={cn('pr-10', props.className)}
      />
      <button
        type='button'
        className='absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-accent transition-colors'
        onClick={() => setVisible(v => !v)}
        aria-label={visible ? 'Скрыть пароль' : 'Показать пароль'}
        tabIndex={-1}
      >
        {visible ? <EyeOff className='size-4' /> : <Eye className='size-4' />}
      </button>
    </div>
  );
}
