import { useCallback, useRef, useState } from 'react';
import {
  Bot,
  Check,
  GripHorizontal,
  ListChecks,
  X,
  CircleAlert,
} from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { cn } from '@/app/components/ui/utils';

interface SeoCheck {
  label: string;
  passed: boolean;
}

interface SeoScoreBarProps {
  checks: SeoCheck[];
}

export function SeoScoreBar({ checks }: SeoScoreBarProps) {
  const passed = checks.filter(c => c.passed).length;
  const total = checks.length;
  const pct = total > 0 ? Math.round((passed / total) * 100) : 0;

  const [checklistOpen, setChecklistOpen] = useState(false);
  const [pos, setPos] = useState({ x: -1, y: -1 });
  const dragging = useRef(false);
  const offset = useRef({ x: 0, y: 0 });
  const panelRef = useRef<HTMLDivElement>(null);

  // Initialize position near the button on first open
  const buttonRef = useRef<HTMLButtonElement>(null);
  const handleToggle = useCallback(() => {
    if (!checklistOpen && pos.x === -1) {
      const rect = buttonRef.current?.getBoundingClientRect();
      if (rect) {
        setPos({
          x: Math.max(8, rect.right - 280),
          y: rect.bottom + 8,
        });
      }
    }
    setChecklistOpen(o => !o);
  }, [checklistOpen, pos.x]);

  const handlePointerDown = useCallback(
    (e: React.PointerEvent) => {
      e.preventDefault();
      dragging.current = true;
      offset.current = {
        x: e.clientX - pos.x,
        y: e.clientY - pos.y,
      };
      (e.target as HTMLElement).setPointerCapture(e.pointerId);
    },
    [pos]
  );

  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    if (!dragging.current) return;
    setPos({
      x: Math.max(0, e.clientX - offset.current.x),
      y: Math.max(0, e.clientY - offset.current.y),
    });
  }, []);

  const handlePointerUp = useCallback(() => {
    dragging.current = false;
  }, []);

  const barColor = 'bg-[#5ADC5A]';

  return (
    <>
      <div className='border-b'>
        <div className='flex items-center gap-4 px-6 py-3 bg-card/50 group/bar opacity-50 hover:opacity-100 transition-opacity duration-200'>
          <div className='flex items-center gap-2 min-w-0'>
            <span className='text-xs font-medium text-muted-foreground whitespace-nowrap'>
              SEO: {passed} из {total}
            </span>
            <span className='text-xs font-bold tabular-nums text-[#5ADC5A]'>
              {pct}%
            </span>
          </div>
          <div className='flex-1 h-1.5 rounded-full bg-muted-foreground/10 overflow-hidden'>
            <div
              className={cn(
                'h-full rounded-full transition-all duration-500',
                barColor
              )}
              style={{ width: `${pct}%` }}
            />
          </div>
          <div className='flex items-center gap-1'>
            <Button
              ref={buttonRef}
              variant='ghost'
              size='sm'
              className={cn(
                'h-7 gap-1.5 text-xs',
                checklistOpen
                  ? 'text-foreground bg-accent'
                  : 'text-muted-foreground hover:text-foreground'
              )}
              type='button'
              onClick={handleToggle}
            >
              <ListChecks className='size-3.5' />
              Чеклист
            </Button>
            <Button
              variant='ghost'
              size='sm'
              className='h-7 gap-1.5 text-xs text-muted-foreground hover:text-foreground'
              title='AI заполнение SEO-полей'
              type='button'
            >
              <Bot className='size-3.5' />
              AI Заполнение
            </Button>
          </div>
        </div>
      </div>

      {/* Draggable checklist panel */}
      {checklistOpen && (
        <div
          ref={panelRef}
          className='fixed z-50 w-[272px] rounded-lg border bg-popover shadow-xl'
          style={{ left: pos.x, top: pos.y }}
        >
          {/* Drag handle / title bar */}
          <div
            className='flex items-center justify-between px-3 py-2 border-b cursor-grab active:cursor-grabbing select-none'
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
          >
            <div className='flex items-center gap-2'>
              <GripHorizontal className='size-3.5 text-muted-foreground/40' />
              <span className='text-xs font-semibold text-foreground'>
                SEO Чеклист
              </span>
              <span className='text-[10px] font-bold tabular-nums px-1.5 py-0.5 rounded-full bg-[#5ADC5A]/15 text-[#5ADC5A]'>
                {passed}/{total}
              </span>
            </div>
            <Button
              variant='ghost'
              size='icon'
              className='size-5 text-muted-foreground hover:text-foreground'
              onClick={() => setChecklistOpen(false)}
              type='button'
            >
              <X className='size-3' />
            </Button>
          </div>

          {/* Checklist items */}
          <div className='p-2 space-y-0.5 max-h-[320px] overflow-y-auto'>
            {checks.map(check => (
              <div
                key={check.label}
                className={cn(
                  'flex items-center gap-2.5 px-2 py-1.5 rounded-md transition-colors',
                  check.passed ? 'opacity-70' : 'bg-red-500/5'
                )}
              >
                <div
                  className={cn(
                    'flex items-center justify-center size-4 rounded-full shrink-0',
                    check.passed
                      ? 'bg-emerald-500/15 text-emerald-500'
                      : 'bg-red-500/15 text-red-400'
                  )}
                >
                  {check.passed ? (
                    <Check className='size-2.5' strokeWidth={3} />
                  ) : (
                    <CircleAlert className='size-2.5' strokeWidth={2.5} />
                  )}
                </div>
                <span
                  className={cn(
                    'text-xs leading-tight',
                    check.passed ? 'text-muted-foreground' : 'text-foreground'
                  )}
                >
                  {check.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
