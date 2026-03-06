import { useState, useRef, useEffect, useCallback } from 'react';
import {
  Monitor,
  Tablet,
  Smartphone,
  RotateCcw,
  Minus,
  Plus,
  Scan,
  Loader2,
  AlertCircle,
} from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/app/components/ui/select';
import { cn } from '@/app/components/ui/utils';
import type {
  DeviceType,
  PreviewArticleData,
} from '@/app/types/article-editor';

const WEB_URL = (
  import.meta.env.VITE_WEB_URL || 'http://localhost:3000'
).replace(/\/$/, '');

// — Device tab config —

const DEVICE_TABS: Record<DeviceType, { label: string; icon: typeof Monitor }> =
  {
    desktop: { label: 'Десктоп', icon: Monitor },
    tablet: { label: 'Планшет', icon: Tablet },
    mobile: { label: 'Мобильный', icon: Smartphone },
  };

// — Device presets (CSS viewport, 2024–2026) —

interface DevicePreset {
  label: string;
  width: number;
  height: number;
}

const TABLET_PRESETS: DevicePreset[] = [
  { label: 'iPad Air 11"', width: 820, height: 1180 },
  { label: 'iPad Air 13"', width: 1024, height: 1366 },
  { label: 'iPad mini', width: 744, height: 1133 },
  { label: 'iPad Pro 11"', width: 834, height: 1210 },
  { label: 'iPad Pro 13"', width: 1032, height: 1376 },
  { label: 'iPad (10th)', width: 820, height: 1180 },
  { label: 'Surface Pro 7', width: 912, height: 1368 },
];

const MOBILE_PRESETS: DevicePreset[] = [
  { label: 'iPhone 16 Pro Max', width: 430, height: 932 },
  { label: 'iPhone 16 Pro', width: 393, height: 852 },
  { label: 'iPhone 16', width: 390, height: 844 },
  { label: 'iPhone SE', width: 375, height: 667 },
  { label: 'Galaxy S25 Ultra', width: 412, height: 891 },
  { label: 'Galaxy S25', width: 360, height: 780 },
  { label: 'Galaxy Z Fold 5', width: 373, height: 839 },
  { label: 'Pixel 9 Pro XL', width: 414, height: 921 },
  { label: 'Pixel 9', width: 412, height: 923 },
  { label: 'Xiaomi 14', width: 360, height: 800 },
  { label: 'Xiaomi 14 Pro', width: 412, height: 915 },
  { label: 'OnePlus 12', width: 412, height: 915 },
  { label: 'OPPO Find X7', width: 412, height: 915 },
  { label: 'Huawei Mate 60 Pro', width: 360, height: 800 },
  { label: 'Honor Magic6 Pro', width: 412, height: 900 },
  { label: 'Nothing Phone (2)', width: 412, height: 919 },
];

function getPresetsForDevice(device: DeviceType): DevicePreset[] {
  if (device === 'tablet') return TABLET_PRESETS;
  if (device === 'mobile') return MOBILE_PRESETS;
  return [];
}

// — Touch simulation constants —
const FRICTION = 0.95;
const MIN_VELOCITY = 0.5;
const CURSOR_SIZE = 20;
const TAP_THRESHOLD = 5; // px — max movement to count as tap, not drag

// — Component —

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

  const containerRef = useRef<HTMLDivElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [fitScale, setFitScale] = useState(1);
  const [iframeReady, setIframeReady] = useState(false);
  const [iframeError, setIframeError] = useState(false);
  const [iframeKey, setIframeKey] = useState(0); // for retry

  // Touch simulation state
  const [cursorPos, setCursorPos] = useState<{ x: number; y: number } | null>(
    null
  );
  const touchRef = useRef<{
    isDragging: boolean;
    startX: number;
    startY: number;
    lastY: number;
    lastTime: number;
    velocity: number;
  }>({
    isDragging: false,
    startX: 0,
    startY: 0,
    lastY: 0,
    lastTime: 0,
    velocity: 0,
  });
  const momentumRef = useRef<number | null>(null);

  // Listen for preview:ready from iframe
  useEffect(() => {
    const handler = (e: MessageEvent) => {
      if (!e.origin.includes(new URL(WEB_URL).host)) return;
      if (e.data?.type === 'preview:ready') {
        setIframeReady(true);
        setIframeError(false);
      }
    };
    window.addEventListener('message', handler);
    return () => window.removeEventListener('message', handler);
  }, []);

  // Reset iframe state when key changes
  useEffect(() => {
    setIframeReady(false);
    setIframeError(false);
  }, [iframeKey]);

  // Loading timeout — starts when not ready, auto-cancels when ready
  useEffect(() => {
    if (iframeReady || iframeError) return;
    const timer = setTimeout(() => setIframeError(true), 15000);
    return () => clearTimeout(timer);
  }, [iframeReady, iframeError]);

  // Send article data to iframe (debounced)
  useEffect(() => {
    if (!iframeReady || !iframeRef.current?.contentWindow) return;

    const timer = setTimeout(() => {
      iframeRef.current?.contentWindow?.postMessage(
        { type: 'preview:update', data: articleData },
        WEB_URL
      );
    }, 200);

    return () => clearTimeout(timer);
  }, [articleData, iframeReady]);

  // Resize observer for auto-fit
  useEffect(() => {
    if (device === 'desktop') return;
    const container = containerRef.current;
    if (!container) return;

    const observer = new ResizeObserver(entries => {
      const entry = entries[0];
      if (!entry) return;
      const cw = entry.contentRect.width - 32;
      const ch = entry.contentRect.height - 32;
      const w =
        customSize?.width ??
        (isLandscape ? selectedPreset.height : selectedPreset.width);
      const h =
        customSize?.height ??
        (isLandscape ? selectedPreset.width : selectedPreset.height);
      const scale = Math.min(1, cw / w, ch / h);
      setFitScale(scale);
      if (autoFit) setZoom(scale);
    });
    observer.observe(container);
    return () => observer.disconnect();
  }, [device, selectedPreset, customSize, isLandscape, autoFit]);

  // Switch device → reset state
  const handleDeviceChange = useCallback(
    (d: DeviceType) => {
      const wasDesktop = device === 'desktop';
      const willBeDesktop = d === 'desktop';

      setDevice(d);
      setCustomSize(null);
      setZoom(1);
      setIsLandscape(false);
      setAutoFit(true);

      // iframe remounts when switching between desktop ↔ mobile/tablet (different DOM branch),
      // so force a full reset via key change to re-sync iframeReady state
      if (wasDesktop !== willBeDesktop) {
        setIframeKey(k => k + 1);
      }

      const presets = getPresetsForDevice(d);
      if (presets[0]) setSelectedPreset(presets[0]);
    },
    [device]
  );

  // Switch preset → reset custom size, zoom, rotation
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

  // Compute current dimensions
  const baseW = isLandscape ? selectedPreset.height : selectedPreset.width;
  const baseH = isLandscape ? selectedPreset.width : selectedPreset.height;
  const currentWidth = customSize?.width ?? baseW;
  const currentHeight = customSize?.height ?? baseH;

  // Zoom controls
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

  // Rotation toggle
  const toggleRotation = useCallback(() => {
    setIsLandscape(prev => !prev);
    setCustomSize(null);
    setAutoFit(true);
  }, []);

  // — Drag resize logic —
  const resizeRef = useRef<{
    startX: number;
    startY: number;
    startW: number;
    startH: number;
    axis: 'x' | 'y' | 'both';
  } | null>(null);

  const handleResizeDown = useCallback(
    (e: React.PointerEvent, axis: 'x' | 'y' | 'both') => {
      e.preventDefault();
      (e.target as HTMLElement).setPointerCapture(e.pointerId);
      resizeRef.current = {
        startX: e.clientX,
        startY: e.clientY,
        startW: currentWidth,
        startH: currentHeight,
        axis,
      };
    },
    [currentWidth, currentHeight]
  );

  const handleResizeMove = useCallback(
    (e: React.PointerEvent) => {
      if (!resizeRef.current) return;
      const { startX, startY, startW, startH, axis } = resizeRef.current;
      const dx = e.clientX - startX;
      const dy = e.clientY - startY;
      const scaledDx = dx / zoom;
      const scaledDy = dy / zoom;
      setCustomSize({
        width:
          axis === 'y' ? startW : Math.max(200, Math.round(startW + scaledDx)),
        height:
          axis === 'x' ? startH : Math.max(200, Math.round(startH + scaledDy)),
      });
    },
    [zoom]
  );

  const handleResizeUp = useCallback(() => {
    resizeRef.current = null;
  }, []);

  // — Touch simulation —
  const sendScroll = useCallback((deltaY: number) => {
    iframeRef.current?.contentWindow?.postMessage(
      { type: 'preview:scroll', deltaY },
      WEB_URL
    );
  }, []);

  const stopMomentum = useCallback(() => {
    if (momentumRef.current) {
      cancelAnimationFrame(momentumRef.current);
      momentumRef.current = null;
    }
  }, []);

  const startMomentum = useCallback(
    (velocity: number) => {
      let v = velocity;
      const animate = () => {
        if (Math.abs(v) < MIN_VELOCITY) {
          momentumRef.current = null;
          return;
        }
        sendScroll(-v);
        v *= FRICTION;
        momentumRef.current = requestAnimationFrame(animate);
      };
      momentumRef.current = requestAnimationFrame(animate);
    },
    [sendScroll]
  );

  const sendClick = useCallback(
    (clientX: number, clientY: number) => {
      const iframe = iframeRef.current;
      if (!iframe) return;
      const rect = iframe.getBoundingClientRect();
      // Convert overlay coordinates to iframe content coordinates (account for zoom/scale)
      const x = (clientX - rect.left) / zoom;
      const y = (clientY - rect.top) / zoom;
      iframe.contentWindow?.postMessage(
        { type: 'preview:click', x, y },
        WEB_URL
      );
    },
    [zoom]
  );

  const handleTouchPointerDown = useCallback(
    (e: React.PointerEvent) => {
      stopMomentum();
      (e.target as HTMLElement).setPointerCapture(e.pointerId);
      touchRef.current = {
        isDragging: true,
        startX: e.clientX,
        startY: e.clientY,
        lastY: e.clientY,
        lastTime: performance.now(),
        velocity: 0,
      };
    },
    [stopMomentum]
  );

  const handleTouchPointerMove = useCallback(
    (e: React.PointerEvent) => {
      // Always update cursor position
      const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
      setCursorPos({ x: e.clientX - rect.left, y: e.clientY - rect.top });

      if (!touchRef.current.isDragging) return;
      const now = performance.now();
      const dt = now - touchRef.current.lastTime;
      const dy = e.clientY - touchRef.current.lastY;
      if (dt > 0) {
        touchRef.current.velocity = (dy / dt) * 16; // normalize to ~60fps frame
      }
      // Scroll in opposite direction (drag up = scroll down)
      sendScroll(-dy / zoom);
      touchRef.current.lastY = e.clientY;
      touchRef.current.lastTime = now;
    },
    [sendScroll, zoom]
  );

  const handleTouchPointerUp = useCallback(
    (e: React.PointerEvent) => {
      if (!touchRef.current.isDragging) return;
      touchRef.current.isDragging = false;

      const dx = e.clientX - touchRef.current.startX;
      const dy = e.clientY - touchRef.current.startY;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < TAP_THRESHOLD) {
        // Tap — forward click to iframe
        sendClick(e.clientX, e.clientY);
      } else {
        // Drag — apply momentum
        const v = touchRef.current.velocity;
        if (Math.abs(v) > MIN_VELOCITY) {
          startMomentum(v);
        }
      }
    },
    [startMomentum, sendClick]
  );

  const handleTouchPointerLeave = useCallback(() => {
    setCursorPos(null);
  }, []);

  const handleWheel = useCallback(
    (e: React.WheelEvent) => {
      e.preventDefault();
      sendScroll(e.deltaY);
    },
    [sendScroll]
  );

  // Cleanup momentum on unmount
  useEffect(() => () => stopMomentum(), [stopMomentum]);

  const handleRetry = useCallback(() => {
    setIframeKey(k => k + 1);
  }, []);

  const isDesktop = device === 'desktop';
  const presets = getPresetsForDevice(device);
  const isCustomSize = customSize !== null;

  // Iframe element (shared between desktop and device modes)
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
      {/* Loading overlay */}
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
      {/* Error overlay */}
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
      {/* Unified toolbar */}
      <div className='flex items-center gap-2 px-3 py-1.5 border-b bg-muted/30'>
        <Select
          value={device}
          onValueChange={(v: string) => handleDeviceChange(v as DeviceType)}
        >
          <SelectTrigger className='h-7 w-[140px] text-xs' size='sm'>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {(
              Object.entries(DEVICE_TABS) as [
                DeviceType,
                typeof DEVICE_TABS.desktop,
              ][]
            ).map(([key, config]) => {
              const Icon = config.icon;
              return (
                <SelectItem key={key} value={key}>
                  <span className='flex items-center gap-1.5'>
                    <Icon className='size-3.5' />
                    {config.label}
                  </span>
                </SelectItem>
              );
            })}
          </SelectContent>
        </Select>

        {!isDesktop && (
          <>
            <Select
              value={isCustomSize ? '__custom__' : selectedPreset.label}
              onValueChange={v => {
                if (v !== '__custom__') handlePresetChange(v);
              }}
            >
              <SelectTrigger className='h-7 w-[170px] text-xs' size='sm'>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {isCustomSize && (
                  <SelectItem
                    key='__custom__'
                    value='__custom__'
                    className='text-muted-foreground italic'
                  >
                    Custom
                  </SelectItem>
                )}
                {presets.map(p => (
                  <SelectItem key={p.label} value={p.label}>
                    {p.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Button
              variant='ghost'
              size='icon'
              className={cn('size-7', isLandscape && 'bg-muted')}
              onClick={toggleRotation}
              title='Повернуть'
            >
              <RotateCcw className='size-3.5' />
            </Button>

            <div className='flex items-center gap-0.5'>
              <Button
                variant='ghost'
                size='icon'
                className='size-7'
                onClick={zoomOut}
                title='Уменьшить'
              >
                <Minus className='size-3' />
              </Button>
              <span className='text-[10px] tabular-nums text-muted-foreground w-8 text-center select-none'>
                {Math.round(zoom * 100)}%
              </span>
              <Button
                variant='ghost'
                size='icon'
                className='size-7'
                onClick={zoomIn}
                title='Увеличить'
              >
                <Plus className='size-3' />
              </Button>
            </div>

            <Button
              variant='ghost'
              size='sm'
              className={cn('h-7 text-xs px-2', autoFit && 'bg-muted')}
              onClick={zoomFit}
              title='Подогнать'
            >
              <Scan className='size-3 mr-1' />
              Fit
            </Button>

            <div className='flex items-center gap-0.5 tabular-nums text-muted-foreground'>
              <input
                type='text'
                inputMode='numeric'
                value={currentWidth}
                maxLength={4}
                onChange={e => {
                  const raw = e.target.value.replace(/\D/g, '').slice(0, 4);
                  if (!raw) return;
                  const v = Math.max(200, Math.min(2560, Number(raw)));
                  setCustomSize(prev => ({
                    width: v,
                    height: prev?.height ?? currentHeight,
                  }));
                }}
                className='w-6 bg-transparent text-right outline-none border-b border-transparent hover:border-muted-foreground/40 focus:border-primary text-[11px] leading-none tabular-nums'
              />
              <span className='select-none text-[11px]'>×</span>
              <input
                type='text'
                inputMode='numeric'
                value={currentHeight}
                maxLength={4}
                onChange={e => {
                  const raw = e.target.value.replace(/\D/g, '').slice(0, 4);
                  if (!raw) return;
                  const v = Math.max(200, Math.min(2560, Number(raw)));
                  setCustomSize(prev => ({
                    width: prev?.width ?? currentWidth,
                    height: v,
                  }));
                }}
                className='w-7 bg-transparent outline-none border-b border-transparent hover:border-muted-foreground/40 focus:border-primary text-[11px] leading-none tabular-nums'
              />
            </div>
          </>
        )}
      </div>

      {/* Preview Area */}
      <div
        ref={containerRef}
        className={cn(
          'flex-1 overflow-auto flex justify-center',
          isDesktop ? 'p-0' : 'bg-muted/20 p-4'
        )}
      >
        {isDesktop ? (
          /* Desktop: full width iframe */
          <div className='w-full h-full relative'>{iframeElement}</div>
        ) : (
          /* Tablet/Mobile: framed iframe + touch overlay + resize handles */
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

            {/* Touch simulation overlay — hidden when iframe not ready so error/loading overlays are clickable */}
            {iframeReady && (
              <div
                className='absolute inset-0 z-10'
                style={{ cursor: 'none' }}
                onPointerDown={handleTouchPointerDown}
                onPointerMove={handleTouchPointerMove}
                onPointerUp={handleTouchPointerUp}
                onPointerLeave={handleTouchPointerLeave}
                onWheel={handleWheel}
              >
                {/* Touch cursor circle */}
                {cursorPos && (
                  <div
                    className='pointer-events-none absolute rounded-full border-2 border-white/60 bg-white/20'
                    style={{
                      width: CURSOR_SIZE,
                      height: CURSOR_SIZE,
                      left: cursorPos.x - CURSOR_SIZE / 2,
                      top: cursorPos.y - CURSOR_SIZE / 2,
                      boxShadow: '0 0 4px rgba(0,0,0,0.3)',
                    }}
                  />
                )}
              </div>
            )}

            {/* Resize handles */}
            <div
              className='absolute top-0 w-1.5 cursor-col-resize hover:bg-primary/20 active:bg-primary/40 transition-colors rounded-r z-20'
              style={{
                left: currentWidth * zoom,
                height: currentHeight * zoom,
              }}
              onPointerDown={e => handleResizeDown(e, 'x')}
              onPointerMove={handleResizeMove}
              onPointerUp={handleResizeUp}
            />
            <div
              className='absolute left-0 h-1.5 cursor-row-resize hover:bg-primary/20 active:bg-primary/40 transition-colors rounded-b z-20'
              style={{
                top: currentHeight * zoom,
                width: currentWidth * zoom,
              }}
              onPointerDown={e => handleResizeDown(e, 'y')}
              onPointerMove={handleResizeMove}
              onPointerUp={handleResizeUp}
            />
            <div
              className='absolute size-3 cursor-nwse-resize hover:bg-primary/30 active:bg-primary/50 transition-colors rounded-br z-20'
              style={{
                left: currentWidth * zoom - 4,
                top: currentHeight * zoom - 4,
              }}
              onPointerDown={e => handleResizeDown(e, 'both')}
              onPointerMove={handleResizeMove}
              onPointerUp={handleResizeUp}
            />
          </div>
        )}
      </div>
    </div>
  );
}
