'use client';

import React, { useEffect, useState } from 'react';
import Spinner from './Spinner';
import './PageSpinner.scss';

/**
 * Длительность затухания лоадера.
 * Синхронизировано с --duration-medium в PageSpinner.scss.
 */
const FADE_OUT_MS = 300;

/**
 * Фаза жизненного цикла лоадера
 * - pending — разметка пришла с сервера, приложение ещё не гидратировано
 * - fading — гидратация завершена, лоадер затухает
 * - done — размонтирован
 */
type Phase = 'pending' | 'fading' | 'done';

/**
 * Полноэкранный индикатор загрузки страницы
 *
 * Зачем: разметка страницы приходит с сервера сразу, но hero-секция и карточки
 * обёрнуты в framer-motion с `initial={{ opacity: 0 }}` — до гидратации контент
 * физически в DOM, но невидим. Пользователь видит пустое полотно между аппбаром
 * и футером. Этот компонент закрывает окно ожидания спиннером по центру экрана.
 *
 * Появляется с задержкой (см. SCSS): если гидратация уложилась в неё, лоадер
 * успевает размонтироваться и мелькания не происходит.
 *
 * @component
 */
const PageSpinner = () => {
  const [phase, setPhase] = useState<Phase>('pending');

  useEffect(() => {
    // Эффект срабатывает сразу после гидратации: framer-motion в этот момент
    // уже начал проявлять контент, значит лоадер больше не нужен
    setPhase('fading');

    const timer = setTimeout(() => setPhase('done'), FADE_OUT_MS);
    return () => clearTimeout(timer);
  }, []);

  if (phase === 'done') return null;

  return (
    <div
      className={
        phase === 'fading'
          ? 'page-spinner page-spinner--hidden'
          : 'page-spinner'
      }
      role='status'
      aria-label='Загрузка содержимого'
    >
      <span className='page-spinner__body'>
        <Spinner size='lg' />
      </span>
    </div>
  );
};

export default PageSpinner;
