'use client';

import React, { useCallback, useEffect, useId, useState } from 'react';
import Link from 'next/link';

import { Button } from '@/components/common/form-controls/Button';
import {
  clearAnalyticsCookies,
  COOKIE_SETTINGS_EVENT,
  setCookieConsent,
  type CookieConsent,
} from '@/lib/cookie-consent';

import { useCookieConsent } from './useCookieConsent';
import './CookieConsentBanner.scss';

/**
 * PW-074 | Баннер согласия на использование файлов cookie.
 *
 * Две равнозначные кнопки, ни одна опция не предвыбрана. Аналитика не грузится,
 * пока посетитель не нажал «Принять» (см. AnalyticsConsentGate).
 * Повторно открывается ссылкой «Настройки cookie» в футере.
 */
export function CookieConsentBanner() {
  const consent = useCookieConsent();
  const [mounted, setMounted] = useState(false);
  const [reopened, setReopened] = useState(false);
  const titleId = useId();
  const textId = useId();

  useEffect(() => {
    setMounted(true);
  }, []);

  // Повторное открытие из футера
  useEffect(() => {
    const handleOpen = () => setReopened(true);
    window.addEventListener(COOKIE_SETTINGS_EVENT, handleOpen);
    return () => window.removeEventListener(COOKIE_SETTINGS_EVENT, handleOpen);
  }, []);

  const isOpen = mounted && (consent === null || reopened);

  // Escape закрывает баннер, только если выбор уже был сделан ранее:
  // молчание согласием не является, поэтому первичный показ так не отменить.
  useEffect(() => {
    if (!isOpen || consent === null) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setReopened(false);
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, consent]);

  const decide = useCallback(
    (value: CookieConsent) => {
      const hadAnalytics = consent === 'accepted';
      setCookieConsent(value);
      setReopened(false);

      // Отзыв согласия. Размонтировать React-компонент недостаточно: тег Метрики
      // уже внедрён в страницу и продолжает считать до следующей навигации.
      // Поэтому чистим её идентификаторы и перезагружаем страницу — сбор
      // прекращается сразу, как только посетитель передумал.
      if (hadAnalytics && value !== 'accepted') {
        clearAnalyticsCookies();
        window.location.reload();
      }
    },
    [consent]
  );

  // До монтирования не рендерим ничего: серверная разметка пуста, баннер
  // появляется анимацией и не сдвигает уже отрисованный контент.
  if (!isOpen) return null;

  return (
    <div
      className='cookie-consent'
      role='dialog'
      aria-labelledby={titleId}
      aria-describedby={textId}
    >
      <div className='cookie-consent__panel'>
        <div className='cookie-consent__body'>
          <h2 id={titleId} className='cookie-consent__title'>
            Файлы cookie
          </h2>
          <p id={textId} className='cookie-consent__text'>
            Технические cookie обеспечивают вход, сессию и защиту форм — без них
            сайт не работает. Аналитические cookie Яндекс.Метрики собирают
            статистику посещений и подключаются только с вашего согласия.
            Подробнее — в{' '}
            {/* Якорь ведёт прямо в раздел «Файлы cookie и веб-аналитика»
                (id секции в privacyContent.ts) — иначе посетитель попадает
                в начало документа из 15 разделов. */}
            <Link
              href='/privacy#cookies-i-veb-analitika'
              className='cookie-consent__link'
              target='_blank'
              rel='noopener noreferrer'
            >
              Политике обработки персональных данных
            </Link>
            .
          </p>

          {consent !== null && (
            <p className='cookie-consent__current'>
              Текущий выбор:{' '}
              <span className='cookie-consent__current-value'>
                {consent === 'accepted'
                  ? 'аналитические cookie разрешены'
                  : 'только необходимые cookie'}
              </span>
            </p>
          )}
        </div>

        {/* Обе кнопки равнозначны, ни один вариант не предвыбран */}
        <div className='cookie-consent__actions'>
          <Button
            variant='outline'
            size='sm'
            onClick={() => decide('necessary-only')}
          >
            Только необходимые
          </Button>
          <Button variant='solid' size='sm' onClick={() => decide('accepted')}>
            Принять
          </Button>
        </div>
      </div>
    </div>
  );
}
