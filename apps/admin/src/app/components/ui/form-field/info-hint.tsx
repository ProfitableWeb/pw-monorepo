import { useState, useRef, useCallback, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Info, GripVertical, X, ExternalLink } from 'lucide-react';
import { cn } from '../utils';
import { useNavigationStore } from '@/app/store/navigation-store';

interface InfoHintProps {
  title: string;
  children: React.ReactNode;
  /** URL ссылки на базу знаний для редактирования/обновления справки */
  knowledgeBaseUrl?: string;
}

function KBLink({
  knowledgeBaseUrl,
  onClose,
}: {
  knowledgeBaseUrl: string;
  onClose: () => void;
}) {
  const { navigateToSeoKb } = useNavigationStore();

  return (
    <div className='border-t px-4 py-2 shrink-0'>
      <button
        type='button'
        onClick={() => {
          // Extract article ID from URL like '/admin/seo/h1'
          const articleId = knowledgeBaseUrl.split('/').pop() || '';
          navigateToSeoKb(articleId);
          onClose();
        }}
        className='inline-flex items-center gap-1 text-[11px] text-muted-foreground/50 hover:text-muted-foreground transition-colors'
      >
        <ExternalLink className='size-2.5' />
        <span>Редактировать в базе знаний</span>
      </button>
    </div>
  );
}

const MIN_WIDTH = 280;
const MIN_HEIGHT = 160;

function InfoPanel({
  title,
  children,
  triggerRect,
  knowledgeBaseUrl,
  onClose,
}: {
  title: string;
  children: React.ReactNode;
  triggerRect: DOMRect;
  knowledgeBaseUrl?: string;
  onClose: () => void;
}) {
  const [pos, setPos] = useState(() => ({
    x: triggerRect.left,
    y: triggerRect.bottom + 8,
  }));
  const [size, setSize] = useState({ width: 340, height: 0 });
  const dragState = useRef({ offsetX: 0, offsetY: 0 });
  const resizeState = useRef({ startX: 0, startY: 0, startW: 0, startH: 0 });
  const panelRef = useRef<HTMLDivElement>(null);

  // Clamp initial position to viewport
  useEffect(() => {
    const panel = panelRef.current;
    if (!panel) return;
    const rect = panel.getBoundingClientRect();
    const maxX = window.innerWidth - rect.width - 8;
    const maxY = window.innerHeight - rect.height - 8;
    setPos(p => ({
      x: Math.max(8, Math.min(p.x, maxX)),
      y: Math.max(8, Math.min(p.y, maxY)),
    }));
    // Set initial height from natural content height
    setSize(s => ({ ...s, height: rect.height }));
  }, []);

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [onClose]);

  // Drag handlers
  const handlePointerDown = useCallback(
    (e: React.PointerEvent) => {
      dragState.current = {
        offsetX: e.clientX - pos.x,
        offsetY: e.clientY - pos.y,
      };
      (e.target as HTMLElement).setPointerCapture(e.pointerId);
    },
    [pos.x, pos.y]
  );

  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    if (!(e.target as HTMLElement).hasPointerCapture(e.pointerId)) return;
    setPos({
      x: e.clientX - dragState.current.offsetX,
      y: e.clientY - dragState.current.offsetY,
    });
  }, []);

  const handlePointerUp = useCallback((e: React.PointerEvent) => {
    (e.target as HTMLElement).releasePointerCapture(e.pointerId);
  }, []);

  // Resize handlers
  const handleResizeDown = useCallback(
    (e: React.PointerEvent) => {
      e.stopPropagation();
      resizeState.current = {
        startX: e.clientX,
        startY: e.clientY,
        startW: size.width,
        startH: size.height,
      };
      (e.target as HTMLElement).setPointerCapture(e.pointerId);
    },
    [size.width, size.height]
  );

  const handleResizeMove = useCallback((e: React.PointerEvent) => {
    if (!(e.target as HTMLElement).hasPointerCapture(e.pointerId)) return;
    const { startX, startY, startW, startH } = resizeState.current;
    setSize({
      width: Math.max(MIN_WIDTH, startW + (e.clientX - startX)),
      height: Math.max(MIN_HEIGHT, startH + (e.clientY - startY)),
    });
  }, []);

  const handleResizeUp = useCallback((e: React.PointerEvent) => {
    (e.target as HTMLElement).releasePointerCapture(e.pointerId);
  }, []);

  return createPortal(
    <div
      ref={panelRef}
      className='fixed z-50 rounded-lg border bg-popover text-popover-foreground shadow-lg animate-in fade-in-0 zoom-in-95 duration-150 flex flex-col'
      style={{
        left: pos.x,
        top: pos.y,
        width: size.width,
        ...(size.height > 0 ? { height: size.height } : {}),
        maxHeight: '70vh',
      }}
    >
      {/* Drag handle header */}
      <div
        className='flex items-center justify-between gap-2 px-3.5 py-2 border-b cursor-grab active:cursor-grabbing select-none shrink-0'
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
      >
        <div className='flex items-center gap-1.5'>
          <GripVertical className='size-3 text-muted-foreground/40' />
          <span className='text-[13px] font-medium'>{title}</span>
        </div>
        <button
          onClick={onClose}
          className='rounded-sm p-0.5 text-muted-foreground/60 hover:text-foreground transition-colors'
        >
          <X className='size-3.5' />
        </button>
      </div>

      {/* Scrollable content with rich text styling */}
      <div className='overflow-y-auto overscroll-contain min-h-0 flex-1 scrollbar-thin'>
        <div
          className={cn(
            'px-4 py-3.5 text-[13px] leading-[1.6]',
            // Rich text formatting styles
            '[&_h4]:text-[12px] [&_h4]:font-semibold [&_h4]:text-foreground [&_h4]:mb-1.5 [&_h4]:mt-5 first:[&_h4]:mt-0',
            '[&_p]:text-muted-foreground [&_p]:mb-3 last:[&_p]:mb-2.5',
            '[&_ul]:text-muted-foreground [&_ul]:list-disc [&_ul]:pl-4 [&_ul]:mb-3 [&_ul]:space-y-1',
            '[&_strong]:text-foreground/80 [&_strong]:font-medium',
            '[&_em]:italic [&_em]:text-muted-foreground/80',
            '[&_code]:text-[11px] [&_code]:bg-muted [&_code]:px-1 [&_code]:py-0.5 [&_code]:rounded [&_code]:font-mono [&_code]:whitespace-nowrap'
          )}
        >
          {children}
        </div>
      </div>

      {/* Knowledge base link footer */}
      {knowledgeBaseUrl && (
        <KBLink knowledgeBaseUrl={knowledgeBaseUrl} onClose={onClose} />
      )}

      {/* Resize handle */}
      <div
        className='absolute bottom-0 right-0 w-4 h-4 cursor-nwse-resize touch-none'
        onPointerDown={handleResizeDown}
        onPointerMove={handleResizeMove}
        onPointerUp={handleResizeUp}
      >
        <svg
          className='absolute bottom-1 right-1 text-muted-foreground/30'
          width='6'
          height='6'
          viewBox='0 0 6 6'
          fill='currentColor'
        >
          <circle cx='5' cy='1' r='0.75' />
          <circle cx='5' cy='5' r='0.75' />
          <circle cx='1' cy='5' r='0.75' />
        </svg>
      </div>
    </div>,
    document.body
  );
}

function InfoHint({ title, children, knowledgeBaseUrl }: InfoHintProps) {
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const [triggerRect, setTriggerRect] = useState<DOMRect | null>(null);

  const handleClick = useCallback(() => {
    if (triggerRef.current) {
      setTriggerRect(triggerRef.current.getBoundingClientRect());
    }
    setOpen(v => !v);
  }, []);

  const handleClose = useCallback(() => setOpen(false), []);

  return (
    <>
      <button
        ref={triggerRef}
        type='button'
        onClick={handleClick}
        className={cn(
          'inline-flex items-center justify-center rounded-full transition-colors',
          'text-muted-foreground/40 hover:text-muted-foreground/70'
        )}
      >
        <Info className='size-3' />
      </button>
      {open && triggerRect && (
        <InfoPanel
          title={title}
          triggerRect={triggerRect}
          knowledgeBaseUrl={knowledgeBaseUrl}
          onClose={handleClose}
        >
          {children}
        </InfoPanel>
      )}
    </>
  );
}

export { InfoHint };
export type { InfoHintProps };
