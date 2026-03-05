import { cn } from '../utils';

interface MiniCheckboxProps {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  label: string;
  className?: string;
}

function MiniCheckbox({
  checked,
  onCheckedChange,
  label,
  className,
}: MiniCheckboxProps) {
  return (
    <label
      className={cn(
        'flex items-center gap-1.5 pl-1 cursor-pointer select-none group',
        className
      )}
    >
      <button
        type='button'
        role='checkbox'
        aria-checked={checked}
        onClick={() => onCheckedChange(!checked)}
        className={cn(
          'size-3 shrink-0 rounded-[3px] border transition-colors outline-none',
          'focus-visible:ring-1 focus-visible:ring-ring',
          checked
            ? 'bg-background border-muted-foreground/40 dark:bg-background dark:border-muted-foreground/50'
            : 'bg-background border-muted-foreground/25 dark:bg-background dark:border-muted-foreground/35'
        )}
      >
        {checked && (
          <svg
            viewBox='0 0 12 12'
            fill='none'
            className='size-full text-muted-foreground'
          >
            <path
              d='M3 6.5L5 8.5L9 4'
              stroke='currentColor'
              strokeWidth='1.5'
              strokeLinecap='round'
              strokeLinejoin='round'
            />
          </svg>
        )}
      </button>
      <span className='text-xs text-muted-foreground'>{label}</span>
    </label>
  );
}

export { MiniCheckbox };
