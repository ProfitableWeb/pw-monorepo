/**
 * Превью статьи в iframe с эмуляцией устройств.
 *
 * Режимы:
 * - **Desktop** — iframe занимает всю ширину, без масштабирования
 * - **Tablet/Mobile** — iframe отрисовывается в фиксированных размерах пресета,
 *   масштабируется через CSS `transform: scale()`, поверх — тач-имитация
 *
 * Функциональность: выбор устройства/пресета, zoom (ручной и auto-fit),
 * поворот ландшафт/портрет, ресайз drag-ручками, кастомный тач-курсор.
 *
 * Делегирует логику трём хукам:
 * - `useIframeMessaging` — postMessage-протокол с iframe
 * - `useTouchSimulation` — скролл/клик/инерция поверх iframe
 * - `useDeviceResize` — ресайз контейнера drag-ручками
 */
import { useState, useRef, useEffect, useCallback } from 'react';
import { Loader2, AlertCircle } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { cn } from '@/app/components/ui/utils';
import type {
  DeviceType,
  PreviewArticleData,
} from '@/app/types/article-editor';
import {
  WEB_URL,
  TABLET_PRESETS,
  getPresetsForDevice,
  type DevicePreset,
} from './preview.types';
import { useIframeMessaging } from './useIframeMessaging';
import { useTouchSimulation, CURSOR_SIZE } from './useTouchSimulation';
import { useDeviceResize } from './useDeviceResize';
import { DeviceToolbar } from './DeviceToolbar';

interface DevicePreviewProps {
  articleData: PreviewArticleData;
}

export function DevicePreview({ articleData }: DevicePreviewProps) {
  const [device, setDevice] = useState<DeviceType>('desktop');
  const [selectedPreset, setSelectedPreset] = useState<DevicePreset>(
    TABLET_PRESETS[0]!
  );
  const [customSize, setCustomSize] = useState<{
    width: number;
    height: number;
  } | null>(null);
  const [zoom, setZoom] = useState(1);
  const [isLandscape, setIsLandscape] = useState(false);
  const [autoFit, setAutoFit] = useState(true);
  const [fitScale, setFitScale] = useState(1);
  const [iframeKey, setIframeKey] = useState(0);

  const containerRef = useRef<HTMLDivElement>(null);

  // Вычисленные размеры
  const baseW = isLandscape ? selectedPreset.height : selectedPreset.width;
  const baseH = isLandscape ? selectedPreset.width : selectedPreset.height;
  const currentWidth = customSize?.width ?? baseW;
  const currentHeight = customSize?.height ?? baseH;
  const isDesktop = device === 'desktop';

  // --- Hooks ---

  const { iframeRef, iframeReady, iframeError, sendScroll, sendClick } =
    useIframeMessaging({ articleData, iframeKey });

  const touch = useTouchSimulation({ sendScroll, sendClick, zoom });

  const resize = useDeviceResize({
    currentWidth,
    currentHeight,
    zoom,
    onResize: setCustomSize,
  });

  // --- Resize observer for auto-fit ---
  useEffect(() => {
    if (device === 'desktop') return;
    const container = containerRef.current;
    if (!container) return;

    const observer = new ResizeObserver(entries => {
      const entry = entries[0];
      if (!entry) return;
      const cw = entry.contentRect.width - 32;
      const ch = entry.contentRect.height - 32;
      const scale = Math.min(1, cw / currentWidth, ch / currentHeight);
      setFitScale(scale);
      if (autoFit) setZoom(scale);
    });
    observer.observe(container);
    return () => observer.disconnect();
  }, [device, currentWidth, currentHeight, autoFit]);

  // --- Device / preset / zoom controls ---

  const handleDeviceChange = useCallback(
    (d: DeviceType) => {
      const wasDesktop = device === 'desktop';
      const willBeDesktop = d === 'desktop';
      setDevice(d);
      setCustomSize(null);
      setZoom(1);
      setIsLandscape(false);
      setAutoFit(true);
      if (wasDesktop !== willBeDesktop) setIframeKey(k => k + 1);
      const presets = getPresetsForDevice(d);
      if (presets[0]) setSelectedPreset(presets[0]);
    },
    [device]
  );

  const handlePresetChange = useCallback(
    (label: string) => {
      const presets = getPresetsForDevice(device);
      const preset = presets.find(p => p.label === label);
      if (preset) {
        setSelectedPreset(preset);
        setCustomSize(null);
        setZoom(1);
        setIsLandscape(false);
        setAutoFit(true);
      }
    },
    [device]
  );

  const zoomIn = useCallback(() => {
    setAutoFit(false);
    setZoom(z => Math.min(2, Math.round((z + 0.1) * 10) / 10));
  }, []);

  const zoomOut = useCallback(() => {
    setAutoFit(false);
    setZoom(z => Math.max(0.25, Math.round((z - 0.1) * 10) / 10));
  }, []);

  const zoomFit = useCallback(() => {
    if (autoFit) {
      setAutoFit(false);
      setZoom(1);
    } else {
      setAutoFit(true);
      setZoom(fitScale);
    }
  }, [fitScale, autoFit]);

  const toggleRotation = useCallback(() => {
    setIsLandscape(prev => !prev);
    setCustomSize(null);
    setAutoFit(true);
  }, []);

  const handleRetry = useCallback(() => setIframeKey(k => k + 1), []);

  // --- Iframe element (shared between desktop and device modes) ---
  const iframeElement = (
    <>
      <iframe
        key={iframeKey}
        ref={iframeRef}
        src={`${WEB_URL}/preview`}
        className='border-0 block'
        style={{ width: '100%', height: '100%' }}
        sandbox='allow-scripts allow-same-origin'
        title='Превью статьи'
      />
      {!iframeReady && !iframeError && (
        <div
          className='absolute inset-0 flex items-center justify-center bg-background/80'
          style={!isDesktop ? { fontSize: `${1 / zoom}em` } : undefined}
        >
          <div className='flex items-center gap-2 text-[1em] text-muted-foreground'>
            <Loader2 className='size-[1.2em] animate-spin' />
            Загрузка предпросмотра...
          </div>
        </div>
      )}
      {iframeError && !iframeReady && (
        <div
          className='absolute inset-0 flex flex-col items-center justify-center gap-3 bg-background/90'
          style={!isDesktop ? { fontSize: `${1 / zoom}em` } : undefined}
        >
          <AlertCircle className='size-[1.8em] text-red-500' />
          <p className='text-[1em] text-muted-foreground'>
            Не удалось загрузить предпросмотр
          </p>
          <Button
            variant='ghost'
            size='sm'
            onClick={handleRetry}
            className='mt-2 px-8 py-6 border border-muted-foreground/30 hover:border-muted-foreground/60 hover:bg-muted/40 active:bg-muted/60'
            style={{ fontSize: '1em' }}
          >
            Повторить
          </Button>
        </div>
      )}
    </>
  );

  return (
    <div className='flex flex-col h-full'>
      <DeviceToolbar
        device={device}
        onDeviceChange={handleDeviceChange}
        selectedPreset={selectedPreset}
        onPresetChange={handlePresetChange}
        isCustomSize={customSize !== null}
        isLandscape={isLandscape}
        onToggleRotation={toggleRotation}
        zoom={zoom}
        autoFit={autoFit}
        onZoomIn={zoomIn}
        onZoomOut={zoomOut}
        onZoomFit={zoomFit}
        currentWidth={currentWidth}
        currentHeight={currentHeight}
        onSizeChange={setCustomSize}
      />

      <div
        ref={containerRef}
        className={cn(
          'flex-1 overflow-auto flex justify-center',
          isDesktop ? 'p-0' : 'bg-muted/20 p-4'
        )}
      >
        {isDesktop ? (
          <div className='w-full h-full relative'>{iframeElement}</div>
        ) : (
          <div
            className='relative inline-block'
            style={{
              width: currentWidth * zoom,
              height: currentHeight * zoom,
            }}
          >
            <div
              className='bg-background border rounded-lg shadow-sm overflow-hidden relative'
              style={{
                width: currentWidth,
                height: currentHeight,
                transform: `scale(${zoom})`,
                transformOrigin: 'top left',
              }}
            >
              {iframeElement}
            </div>

            {/* Оверлей симуляции тача */}
            {iframeReady && (
              <div
                className='absolute inset-0 z-10'
                style={{ cursor: 'none' }}
                onPointerDown={touch.handlePointerDown}
                onPointerMove={touch.handlePointerMove}
                onPointerUp={touch.handlePointerUp}
                onPointerLeave={touch.handlePointerLeave}
                onWheel={touch.handleWheel}
              >
                {touch.cursorPos && (
                  <div
                    className='pointer-events-none absolute rounded-full border-2 border-white/60 bg-white/20'
                    style={{
                      width: CURSOR_SIZE,
                      height: CURSOR_SIZE,
                      left: touch.cursorPos.x - CURSOR_SIZE / 2,
                      top: touch.cursorPos.y - CURSOR_SIZE / 2,
                      boxShadow: '0 0 4px rgba(0,0,0,0.3)',
                    }}
                  />
                )}
              </div>
            )}

            {/* Ручки ресайза */}
            <div
              className='absolute top-0 w-1.5 cursor-col-resize hover:bg-primary/20 active:bg-primary/40 transition-colors rounded-r z-20'
              style={{
                left: currentWidth * zoom,
                height: currentHeight * zoom,
              }}
              onPointerDown={e => resize.handleResizeDown(e, 'x')}
              onPointerMove={resize.handleResizeMove}
              onPointerUp={resize.handleResizeUp}
            />
            <div
              className='absolute left-0 h-1.5 cursor-row-resize hover:bg-primary/20 active:bg-primary/40 transition-colors rounded-b z-20'
              style={{
                top: currentHeight * zoom,
                width: currentWidth * zoom,
              }}
              onPointerDown={e => resize.handleResizeDown(e, 'y')}
              onPointerMove={resize.handleResizeMove}
              onPointerUp={resize.handleResizeUp}
            />
            <div
              className='absolute size-3 cursor-nwse-resize hover:bg-primary/30 active:bg-primary/50 transition-colors rounded-br z-20'
              style={{
                left: currentWidth * zoom - 4,
                top: currentHeight * zoom - 4,
              }}
              onPointerDown={e => resize.handleResizeDown(e, 'both')}
              onPointerMove={resize.handleResizeMove}
              onPointerUp={resize.handleResizeUp}
            />
          </div>
        )}
      </div>
    </div>
  );
}
