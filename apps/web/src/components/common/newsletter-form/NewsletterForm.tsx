'use client';

import { useState } from 'react';
import { Modal } from '@/components/common/modal';
import SocialIcons from '@/components/common/social-icons';
import { SOCIAL_LINKS_FOOTER } from '@/components/common/social-icons';
import './NewsletterForm.scss';

interface NewsletterFormProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NewsletterForm: React.FC<NewsletterFormProps> = ({
  isOpen,
  onClose,
}) => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Валидация email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setStatus('error');
      setErrorMessage('Пожалуйста, введите корректный email');
      return;
    }

    setIsLoading(true);
    setStatus('idle');
    setErrorMessage('');

    try {
      // TODO: API call к backend
      // const response = await fetch('/api/newsletter/subscribe', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ email }),
      // });

      // Имитация API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      setStatus('success');
      setEmail('');

      // Закрыть модалку через 2 секунды после успеха
      setTimeout(() => {
        onClose();
        setStatus('idle');
      }, 2000);
    } catch (error) {
      setStatus('error');
      setErrorMessage('Произошла ошибка. Попробуйте позже.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Подписаться на рассылку"
      size="medium"
    >
      <div className="newsletter-form">
        <p className="newsletter-form__description">
          Получайте последние исследования и инсайты о трансформации труда в
          эпоху AI прямо на почту.
        </p>

        <form onSubmit={handleSubmit} className="newsletter-form__form">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your@email.com"
            className="newsletter-form__input"
            disabled={isLoading || status === 'success'}
            required
          />

          <button
            type="submit"
            className="newsletter-form__submit"
            disabled={isLoading || status === 'success'}
          >
            {isLoading
              ? 'Отправка...'
              : status === 'success'
                ? '✓ Подписка оформлена!'
                : 'Подписаться'}
          </button>
        </form>

        {/* Success/Error сообщения */}
        {status === 'success' && (
          <div className="newsletter-form__message newsletter-form__message--success">
            Спасибо за подписку! Проверьте почту для подтверждения.
          </div>
        )}

        {status === 'error' && (
          <div className="newsletter-form__message newsletter-form__message--error">
            {errorMessage}
          </div>
        )}

        {/* Социальные сети */}
        <div className="newsletter-form__social">
          <p className="newsletter-form__social-title">
            Или следите за нами в соцсетях:
          </p>
          <SocialIcons links={SOCIAL_LINKS_FOOTER} />
        </div>
      </div>
    </Modal>
  );
};
