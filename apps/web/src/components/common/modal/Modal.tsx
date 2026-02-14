'use client';

import { useEffect, useRef, ReactNode, useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence, PanInfo } from 'framer-motion';
import { HiX } from 'react-icons/hi';
import './Modal.scss';

interface ContentPadding {
  top?: string;
  right?: string;
  bottom?: string;
  left?: string;
}

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  subtitle?: string;
  children: ReactNode;
  size?: 'small' | 'medium' | 'large';
  contentPadding?: ContentPadding;
  showDivider?: boolean;
}

export const Modal = ({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  size = 'medium',
  contentPadding,
  showDivider = false,
}: ModalProps) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  // Синхронизация внутреннего состояния с внешним
  useEffect(() => {
    if (isOpen) {
      setIsAnimating(true);
    }
  }, [isOpen]);

  // Определение мобильного устройства
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Блокировка скролла через контейнер .main-layout
  useEffect(() => {
    if (!isOpen) return;

    const container = document.querySelector('.main-layout');
    if (container) {
      container.classList.add('modal-open');
    }

    return () => {
      if (container) {
        container.classList.remove('modal-open');
      }
    };
  }, [isOpen]);

  // Focus trap + Escape handling
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Escape для закрытия
      if (e.key === 'Escape') {
        onClose();
      }

      // Tab trap (фокус остается внутри модалки)
      if (e.key === 'Tab') {
        const focusableElements = modalRef.current?.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (!focusableElements || focusableElements.length === 0) return;

        const firstElement = focusableElements[0] as HTMLElement;
        const lastElement = focusableElements[
          focusableElements.length - 1
        ] as HTMLElement;

        if (e.shiftKey && document.activeElement === firstElement) {
          e.preventDefault();
          lastElement.focus();
        } else if (!e.shiftKey && document.activeElement === lastElement) {
          e.preventDefault();
          firstElement.focus();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Обработчик закрытия с анимацией
  const handleClose = () => {
    setIsAnimating(false);
  };

  // Callback после завершения анимации выхода
  const handleAnimationComplete = () => {
    if (!isAnimating && isOpen) {
      onClose();
    }
  };

  // Click outside для закрытия
  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  // Drag handler для закрытия на мобильных
  const handleDragEnd = (
    event: MouseEvent | TouchEvent | PointerEvent,
    info: PanInfo
  ) => {
    // Если свайпнули вниз больше чем на 100px или скорость > 500
    if (info.offset.y > 100 || info.velocity.y > 500) {
      handleClose();
    }
  };

  if (!isOpen) return null;

  // Варианты анимации для overlay
  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    exit: { opacity: 0 },
  };

  // Варианты анимации для модалки
  const modalVariants = {
    // Desktop: появление из центра
    desktop: {
      hidden: { opacity: 0, scale: 0.95, y: 20 },
      visible: {
        opacity: 1,
        scale: 1,
        y: 0,
        transition: {
          type: 'spring' as const,
          damping: 25,
          stiffness: 300,
        },
      },
      exit: {
        opacity: 0,
        scale: 0.95,
        y: 20,
        transition: {
          duration: 0.2,
        },
      },
    },
    // Mobile: Bottom Sheet
    mobile: {
      hidden: { y: '100%' },
      visible: {
        y: 0,
        transition: {
          type: 'spring' as const,
          damping: 30,
          stiffness: 300,
        },
      },
      exit: {
        y: '100%',
        transition: {
          type: 'spring' as const,
          damping: 30,
          stiffness: 300,
        },
      },
    },
  };

  const currentVariants = isMobile
    ? modalVariants.mobile
    : modalVariants.desktop;

  return createPortal(
    <AnimatePresence onExitComplete={handleAnimationComplete}>
      {isOpen && isAnimating && (
        <motion.div
          key='modal-overlay'
          className='modal-overlay'
          onClick={handleOverlayClick}
          role='dialog'
          aria-modal='true'
          variants={overlayVariants}
          initial='hidden'
          animate='visible'
          exit='exit'
        >
          <motion.div
            key='modal-content'
            ref={modalRef}
            className={`modal modal--${size}`}
            variants={currentVariants}
            initial='hidden'
            animate='visible'
            exit='exit'
            drag={isMobile ? 'y' : false}
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={{ top: 0, bottom: 0.5 }}
            onDragEnd={handleDragEnd}
            style={{
              touchAction: isMobile ? 'none' : 'auto',
              willChange: 'transform',
              transform: 'translateZ(0)',
            }}
          >
            {/* Header */}
            <div className='modal__header'>
              <div className='modal__header-text'>
                {title && <h2 className='modal__title'>{title}</h2>}
                {subtitle && <p className='modal__subtitle'>{subtitle}</p>}
              </div>
              <button
                className='modal__close'
                onClick={handleClose}
                aria-label='Закрыть модальное окно'
              >
                <HiX />
              </button>
            </div>

            {showDivider && <div className='modal__divider' />}

            {/* Content */}
            <div
              className='modal__content'
              data-custom-padding={contentPadding ? 'true' : undefined}
              style={
                contentPadding
                  ? ({
                      '--content-padding-top': contentPadding.top,
                      '--content-padding-right': contentPadding.right,
                      '--content-padding-bottom': contentPadding.bottom,
                      '--content-padding-left': contentPadding.left,
                    } as React.CSSProperties)
                  : undefined
              }
            >
              {children}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
};
