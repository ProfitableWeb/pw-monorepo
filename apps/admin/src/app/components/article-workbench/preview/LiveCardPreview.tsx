/**
 * Превью карточки статьи через iframe с реальным компонентом `ArticleCard` из web-приложения.
 *
 * Протокол (расширение базового preview):
 * - `preview:update` → передаёт title/subtitle/summary/category/imageUrl/slug в iframe
 * - `preview:theme` → переключает тему (light/dark) внутри iframe
 * - `preview:resize` ← iframe сообщает высоту контента для auto-sizing
 *
 * Функциональность: zoom (ручной + auto-fit), переключение темы (Sun/Moon),
 * ресайз ширины карточки боковыми ручками (280–640px).
 *
 * @see apps/web/src/app/preview/card/page.tsx — принимающая сторона
 */
import { useState, useRef, useEffect, useCallback } from 'react';
import {
  Sun,
  Moon,
  Loader2,
  AlertCircle,
  RefreshCw,
  Scan,
  Minus,
  Plus,
} from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { cn } from '@/app/components/ui/utils';

const WEB_URL = (
  import.meta.env.VITE_WEB_URL || 'http://localhost:3000'
).replace(/\/$/, '');

const DEFAULT_CARD_WIDTH = 360;
const MIN_CARD_WIDTH = 280;
const MAX_CARD_WIDTH = 640;

interface LiveCardPreviewProps {
  title: string;
  subtitle: string;
  category: string;
  excerpt: string;
  imageUrl?: string;
  slug?: string;
}

export function LiveCardPreview({
  title,
  subtitle,
  category,
  excerpt,
  imageUrl,
  slug,
}: LiveCardPreviewProps) {
  const [previewDark, setPreviewDark] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [iframeReady, setIframeReady] = useState(false);
  const [iframeError, setIframeError] = useState(false);
  const [iframeKey, setIframeKey] = useState(0);
  const [contentHeight, setContentHeight] = useState(0);
  const [cardWidth, setCardWidth] = useState(DEFAULT_CARD_WIDTH);
  const [fitScale, setFitScale] = useState(1);
  const [zoom, setZoom] = useState(1);
  const [autoFit, setAutoFit] = useState(true);

  // Слушаем preview:ready и preview:resize от iframe
  useEffect(() => {
    const handler = (e: MessageEvent) => {
      if (e.origin !== new URL(WEB_URL).origin) return;
      if (e.data?.type === 'preview:ready') {
        setIframeReady(true);
        setIframeError(false);
      }
      if (
        e.data?.type === 'preview:resize' &&
        typeof e.data.height === 'number'
      ) {
        setContentHeight(e.data.height);
      }
    };
    window.addEventListener('message', handler);
    return () => window.removeEventListener('message', handler);
  }, []);

  useEffect(() => {
    setIframeReady(false);
    setIframeError(false);
  }, [iframeKey]);

  useEffect(() => {
    if (iframeReady || iframeError) return;
    const timer = setTimeout(() => setIframeError(true), 15000);
    return () => clearTimeout(timer);
  }, [iframeReady, iframeError, iframeKey]);

  useEffect(() => {
    if (!iframeReady || !iframeRef.current?.contentWindow) return;
    const timer = setTimeout(() => {
      iframeRef.current?.contentWindow?.postMessage(
        {
          type: 'preview:update',
          data: {
            title,
            subtitle,
            summary: excerpt,
            category,
            imageUrl: imageUrl || undefined,
            slug: slug || 'preview',
            createdAt: new Date().toISOString(),
          },
        },
        WEB_URL
      );
    }, 200);
    return () => clearTimeout(timer);
  }, [title, subtitle, excerpt, category, imageUrl, slug, iframeReady]);

  useEffect(() => {
    if (!iframeReady || !iframeRef.current?.contentWindow) return;
    iframeRef.current.contentWindow.postMessage(
      { type: 'preview:theme', theme: previewDark ? 'dark' : 'light' },
      WEB_URL
    );
  }, [previewDark, iframeReady]);

  // Auto-fit: всегда вписывать карточку в контейнер
  const effectiveHeight = contentHeight || 600;
  const updateFitScale = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;
    const cw = container.clientWidth - 32;
    const ch = container.clientHeight - 32;
    const scaleX = cw / cardWidth;
    const scaleY = ch / effectiveHeight;
    const newFit = Math.min(1, scaleX, scaleY);
    setFitScale(newFit);
    if (autoFit) setZoom(newFit);
  }, [effectiveHeight, cardWidth, autoFit]);

  useEffect(() => {
    updateFitScale();
  }, [updateFitScale]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const observer = new ResizeObserver(() => updateFitScale());
    observer.observe(container);
    return () => observer.disconnect();
  }, [updateFitScale]);

  // Resize card width via side edge drag
  const handleEdgeResizeStart = useCallback(
    (e: React.PointerEvent, side: 'left' | 'right') => {
      e.preventDefault();
      const startX = e.clientX;
      const startW = cardWidth;
      const onMove = (ev: PointerEvent) => {
        const dx =
          (side === 'right' ? ev.clientX - startX : startX - ev.clientX) / zoom;
        setCardWidth(
          Math.max(
            MIN_CARD_WIDTH,
            Math.min(MAX_CARD_WIDTH, Math.round(startW + dx))
          )
        );
      };
      const onUp = () => {
        document.removeEventListener('pointermove', onMove);
        document.removeEventListener('pointerup', onUp);
      };
      document.addEventListener('pointermove', onMove);
      document.addEventListener('pointerup', onUp);
    },
    [cardWidth, zoom]
  );

  // Zoom controls
  const zoomIn = () => {
    setAutoFit(false);
    setZoom(z => Math.min(2, Math.round((z + 0.1) * 10) / 10));
  };
  const zoomOut = () => {
    setAutoFit(false);
    setZoom(z => Math.max(0.25, Math.round((z - 0.1) * 10) / 10));
  };
  const toggleFit = () => {
    if (autoFit) {
      setAutoFit(false);
      setZoom(1);
    } else {
      setAutoFit(true);
      setZoom(fitScale);
    }
  };

  const handleRetry = () => setIframeKey(k => k + 1);

  const scaledWidth = cardWidth * zoom;
  const scaledHeight = effectiveHeight * zoom;

  return (
    <div className='flex flex-col h-full'>
      {/* Тулбар */}
      <div className='flex items-center gap-1 px-2 py-1.5 shrink-0 border-b'>
        <p className='text-xs font-medium text-muted-foreground mr-auto'>
          Превью карточки
        </p>

        <div className='flex items-center gap-0'>
          <input
            type='number'
            min={MIN_CARD_WIDTH}
            max={MAX_CARD_WIDTH}
            value={cardWidth}
            onChange={e => {
              const v = parseInt(e.target.value, 10);
              if (!isNaN(v))
                setCardWidth(
                  Math.max(MIN_CARD_WIDTH, Math.min(MAX_CARD_WIDTH, v))
                );
            }}
            className='text-[10px] tabular-nums text-muted-foreground bg-transparent w-8 text-right outline-none border-none focus:text-foreground [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none'
          />
          <span className='text-[10px] text-muted-foreground'>px</span>
        </div>

        <div className='flex items-center gap-0.5'>
          <Button
            variant='ghost'
            size='icon'
            className='size-6'
            onClick={zoomOut}
            title='Уменьшить'
          >
            <Minus className='size-3' />
          </Button>
          <span className='text-[10px] tabular-nums text-muted-foreground w-7 text-center select-none'>
            {Math.round(zoom * 100)}%
          </span>
          <Button
            variant='ghost'
            size='icon'
            className='size-6'
            onClick={zoomIn}
            title='Увеличить'
          >
            <Plus className='size-3' />
          </Button>
        </div>

        <Button
          variant='ghost'
          size='sm'
          className={cn('h-6 text-[10px] px-1.5', autoFit && 'bg-muted')}
          onClick={toggleFit}
          title='Подогнать'
        >
          <Scan className='size-3 mr-0.5' />
          Fit
        </Button>

        <Button
          variant='ghost'
          size='icon'
          className='size-6'
          onClick={() => setPreviewDark(v => !v)}
          title={previewDark ? 'Светлая тема' : 'Тёмная тема'}
        >
          {previewDark ? (
            <Sun className='size-3' />
          ) : (
            <Moon className='size-3' />
          )}
        </Button>
      </div>

      {/* Область превью */}
      <div
        ref={containerRef}
        className='flex-1 min-h-0 overflow-hidden flex items-center justify-center p-4 bg-muted/50'
      >
        {/* Внешний контейнер задаёт scaled-размеры для корректного скролла */}
        <div
          className='relative shrink-0'
          style={{ width: scaledWidth, height: scaledHeight }}
        >
          {/* Карточка в реальном размере с масштабированием */}
          <div
            className='overflow-hidden relative rounded-[3px]'
            style={{
              width: cardWidth,
              height: effectiveHeight,
              transform: zoom !== 1 ? `scale(${zoom})` : undefined,
              transformOrigin: 'top left',
              border: `1px solid ${previewDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.1)'}`,
            }}
          >
            <iframe
              key={iframeKey}
              ref={iframeRef}
              src={`${WEB_URL}/preview/card`}
              sandbox='allow-scripts allow-same-origin'
              title='Превью карточки'
              style={{
                width: cardWidth,
                height: effectiveHeight,
                border: 'none',
                display: 'block',
              }}
            />

            {!iframeReady && !iframeError && (
              <div className='absolute inset-0 flex flex-col items-center justify-center gap-2 bg-background'>
                <Loader2 className='h-5 w-5 animate-spin text-muted-foreground' />
                <span className='text-xs text-muted-foreground'>
                  Загрузка превью...
                </span>
              </div>
            )}

            {iframeError && (
              <div className='absolute inset-0 flex flex-col items-center justify-center gap-2 bg-background/90'>
                <AlertCircle className='h-5 w-5 text-red-500' />
                <span className='text-xs text-muted-foreground'>
                  Не удалось загрузить превью
                </span>
                <Button
                  variant='ghost'
                  size='sm'
                  className='mt-1 gap-1.5 border border-transparent hover:border-border'
                  onClick={handleRetry}
                >
                  <RefreshCw className='h-3 w-3' />
                  Повторить
                </Button>
              </div>
            )}
          </div>

          {/* Боковые ручки ресайза ширины */}
          <div
            className='absolute top-0 -left-1 w-1.5 h-full cursor-col-resize hover:bg-[#4CAF50]/20 active:bg-[#388E3C]/20 transition-colors z-10'
            onPointerDown={e => handleEdgeResizeStart(e, 'left')}
          />
          <div
            className='absolute top-0 -right-1 w-1.5 h-full cursor-col-resize hover:bg-[#4CAF50]/20 active:bg-[#388E3C]/20 transition-colors z-10'
            onPointerDown={e => handleEdgeResizeStart(e, 'right')}
          />
        </div>
      </div>
    </div>
  );
}
