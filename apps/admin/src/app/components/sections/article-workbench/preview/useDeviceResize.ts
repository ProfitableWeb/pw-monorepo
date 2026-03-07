/**
 * Хук для ресайза iframe-контейнера drag-ручками.
 * Поддерживает три оси: горизонталь (x), вертикаль (y), обе сразу (both).
 * Учитывает текущий zoom — перемещение мыши делится на zoom для корректного масштаба.
 * Минимальный размер: 200×200px.
 */
import { useRef, useCallback } from 'react';

interface UseDeviceResizeOptions {
  currentWidth: number;
  currentHeight: number;
  zoom: number;
  onResize: (size: { width: number; height: number }) => void;
}

export function useDeviceResize({
  currentWidth,
  currentHeight,
  zoom,
  onResize,
}: UseDeviceResizeOptions) {
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
      onResize({
        width:
          axis === 'y' ? startW : Math.max(200, Math.round(startW + scaledDx)),
        height:
          axis === 'x' ? startH : Math.max(200, Math.round(startH + scaledDy)),
      });
    },
    [zoom, onResize]
  );

  const handleResizeUp = useCallback(() => {
    resizeRef.current = null;
  }, []);

  return { handleResizeDown, handleResizeMove, handleResizeUp };
}
