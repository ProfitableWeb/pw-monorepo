import { Loader2 } from 'lucide-react';
import { cn } from '@/app/components/ui/utils';

interface LoadingSpinnerProps {
  /** Текст рядом со спиннером */
  label?: string;
  /** Tailwind-класс отступов контейнера (по умолчанию py-8) */
  className?: string;
  /** Размер иконки (по умолчанию size-6) */
  size?: string;
}

/** Центрированный спиннер загрузки. Заменяет повторяющийся inline-паттерн. */
export function LoadingSpinner({
  label,
  className,
  size = 'size-6',
}: LoadingSpinnerProps) {
  return (
    <div
      className={cn(
        'flex items-center justify-center py-8 text-muted-foreground',
        className
      )}
    >
      <Loader2 className={cn(size, 'animate-spin', label && 'mr-2')} />
      {label && <span className='text-sm'>{label}</span>}
    </div>
  );
}
