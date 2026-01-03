'use client';

import { useEffect, useRef, ReactNode } from 'react';
import { createPortal } from 'react-dom';
import './Modal.scss';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  size?: 'small' | 'medium' | 'large';
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  size = 'medium',
}) => {
  const modalRef = useRef<HTMLDivElement>(null);

  // Блокировка скролла body при открытой модалке
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
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

  // Click outside для закрытия
  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return createPortal(
    <div
      className="modal-overlay"
      onClick={handleOverlayClick}
      role="dialog"
      aria-modal="true"
    >
      <div ref={modalRef} className={`modal modal--${size}`}>
        {/* Header */}
        <div className="modal__header">
          {title && <h2 className="modal__title">{title}</h2>}
          <button
            className="modal__close"
            onClick={onClose}
            aria-label="Закрыть модальное окно"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="modal__content">{children}</div>
      </div>
    </div>,
    document.body
  );
};
