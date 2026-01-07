import { toast as rtToast, ToastOptions, ToastContent } from 'react-toastify';

/**
 * Обертка над react-toastify для предотвращения дубликатов сообщений.
 * Если уведомление с таким же текстом уже отображается, новое не будет создано.
 */
export const toast = {
  // Копируем все методы оригинального toast
  ...rtToast,
  
  // Переопределяем методы для предотвращения дубликатов
  success: (content: ToastContent, options?: ToastOptions) => {
    const id = typeof content === 'string' ? content : undefined;
    return rtToast.success(content, { toastId: id, ...options });
  },
  error: (content: ToastContent, options?: ToastOptions) => {
    const id = typeof content === 'string' ? content : undefined;
    return rtToast.error(content, { toastId: id, ...options });
  },
  info: (content: ToastContent, options?: ToastOptions) => {
    const id = typeof content === 'string' ? content : undefined;
    return rtToast.info(content, { toastId: id, ...options });
  },
  warning: (content: ToastContent, options?: ToastOptions) => {
    const id = typeof content === 'string' ? content : undefined;
    return rtToast.warning(content, { toastId: id, ...options });
  },
  // Позволяет вызывать toast напрямую как функцию с ID
  custom: (content: ToastContent, options?: ToastOptions) => {
    const id = typeof content === 'string' ? content : undefined;
    return rtToast(content, { toastId: id, ...options });
  },
};
