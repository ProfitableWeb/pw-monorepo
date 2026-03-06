import { cn } from '@/app/components/ui/utils';

interface CharCounterProps {
  value: string;
  min: number;
  max: number;
  /** When true, colors only appear when parent `.group\/field` has focus-within */
  focusOnly?: boolean;
}

export function CharCounter({ value, min, max, focusOnly }: CharCounterProps) {
  const len = value.length;
  const pct = Math.min((len / max) * 100, 100);

  let color: string;
  let barColor: string;
  if (len === 0) {
    color = 'text-muted-foreground/50';
    barColor = 'bg-muted-foreground/20';
  } else if (len >= min && len <= max) {
    color = 'text-emerald-500';
    barColor = 'bg-emerald-500';
  } else if (len > max) {
    color = 'text-red-500';
    barColor = 'bg-red-500';
  } else if (len >= max * 0.8) {
    color = 'text-amber-500';
    barColor = 'bg-amber-500';
  } else {
    color = 'text-muted-foreground/60';
    barColor = 'bg-muted-foreground/30';
  }

  return (
    <div
      className={cn(
        'space-y-1 mt-2 transition-[filter,opacity] duration-200',
        focusOnly &&
          'grayscale opacity-40 group-focus-within/field:grayscale-0 group-focus-within/field:opacity-100'
      )}
    >
      <div className='h-0.5 mx-1.5 rounded-full bg-muted-foreground/10 overflow-hidden'>
        <div
          className={cn(
            'h-full rounded-full transition-all duration-200',
            barColor
          )}
          style={{ width: `${pct}%` }}
        />
      </div>
      <div
        className={cn('text-[10px] text-right tabular-nums pr-[5px]', color)}
      >
        {len} / {min}–{max}
      </div>
    </div>
  );
}
