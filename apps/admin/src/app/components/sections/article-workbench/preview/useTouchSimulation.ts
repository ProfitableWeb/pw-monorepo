/**
 * Хук имитации тач-взаимодействия на iframe-превью планшетов/телефонов.
 *
 * Поверх iframe рисуется прозрачный overlay, перехватывающий pointer-события.
 * Логика:
 * - **Скролл**: drag вниз/вверх → отправляет `preview:scroll` в iframe
 * - **Tap**: если pointer прошёл < 5px — это клик, отправляем `preview:click`
 * - **Инерция**: после отпускания velocity затухает с коэффициентом 0.95 через rAF
 * - **Курсор**: скрывает системный курсор, рисует кастомный кружок (20px)
 *
 * Wheel-события тоже перехватываются и транслируются в scroll.
 */
import { useState, useRef, useCallback, useEffect } from 'react';

/** Коэффициент затухания инерции (0–1). Чем ближе к 1, тем дольше инерция. */
const FRICTION = 0.95;
/** Минимальная скорость для продолжения инерции (px/frame) */
const MIN_VELOCITY = 0.5;
/** Диаметр кастомного тач-курсора (px) */
const CURSOR_SIZE = 20;
/** Порог в пикселях: если pointer прошёл меньше — это tap, не drag */
const TAP_THRESHOLD = 5;

export { CURSOR_SIZE };

interface UseTouchSimulationOptions {
  sendScroll: (deltaY: number) => void;
  sendClick: (clientX: number, clientY: number, zoom: number) => void;
  zoom: number;
}

export function useTouchSimulation({
  sendScroll,
  sendClick,
  zoom,
}: UseTouchSimulationOptions) {
  const [cursorPos, setCursorPos] = useState<{ x: number; y: number } | null>(
    null
  );
  const touchRef = useRef({
    isDragging: false,
    startX: 0,
    startY: 0,
    lastY: 0,
    lastTime: 0,
    velocity: 0,
  });
  const momentumRef = useRef<number | null>(null);

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

  const handlePointerDown = useCallback(
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

  const handlePointerMove = useCallback(
    (e: React.PointerEvent) => {
      const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
      setCursorPos({ x: e.clientX - rect.left, y: e.clientY - rect.top });

      if (!touchRef.current.isDragging) return;
      const now = performance.now();
      const dt = now - touchRef.current.lastTime;
      const dy = e.clientY - touchRef.current.lastY;
      if (dt > 0) {
        touchRef.current.velocity = (dy / dt) * 16;
      }
      sendScroll(-dy / zoom);
      touchRef.current.lastY = e.clientY;
      touchRef.current.lastTime = now;
    },
    [sendScroll, zoom]
  );

  const handlePointerUp = useCallback(
    (e: React.PointerEvent) => {
      if (!touchRef.current.isDragging) return;
      touchRef.current.isDragging = false;

      const dx = e.clientX - touchRef.current.startX;
      const dy = e.clientY - touchRef.current.startY;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < TAP_THRESHOLD) {
        sendClick(e.clientX, e.clientY, zoom);
      } else {
        const v = touchRef.current.velocity;
        if (Math.abs(v) > MIN_VELOCITY) {
          startMomentum(v);
        }
      }
    },
    [startMomentum, sendClick, zoom]
  );

  const handlePointerLeave = useCallback(() => {
    setCursorPos(null);
  }, []);

  const handleWheel = useCallback(
    (e: React.WheelEvent) => {
      e.preventDefault();
      sendScroll(e.deltaY);
    },
    [sendScroll]
  );

  // Очистка momentum при размонтировании
  useEffect(() => () => stopMomentum(), [stopMomentum]);

  return {
    cursorPos,
    handlePointerDown,
    handlePointerMove,
    handlePointerUp,
    handlePointerLeave,
    handleWheel,
  };
}
