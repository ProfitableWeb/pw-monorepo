'use client';

import React from 'react';
import { Button } from '@/components/common/form-controls';
import './ProjectCard.scss';

interface ProjectCardProps {
  definition?: string;
  description?: string;
  subscribeLink?: string;
  onSubscribeClick?: () => void;
}

// Моковые данные по умолчанию
const DEFAULT_PROJECT = {
  definition:
    '<span class="project-card__definition-profitable">Profitable</span><span class="project-card__definition-web">WEB</span><span class="project-card__definition-ru">.ru</span> — Исследование, развитие и монетизация веб-сайтов, свервисов и приложений для формирования полноценного интернет-пространства.',
  description:
    'Внедрение инновационных практик и подходов к созданию доходных проектов с акцентом на ценности профессионального контента высокого уровня.',
  subscribeLink: '#',
};

export const ProjectCard = ({
  definition = DEFAULT_PROJECT.definition,
  description = DEFAULT_PROJECT.description,
  subscribeLink = DEFAULT_PROJECT.subscribeLink,
  onSubscribeClick,
}: ProjectCardProps) => {
  return (
    <div className='project-card'>
      <h3 className='project-card__title'>О сайте</h3>

      <div
        className='project-card__definition'
        dangerouslySetInnerHTML={{
          __html: definition,
        }}
      />

      <p className='project-card__description'>{description}</p>

      <Button
        href={onSubscribeClick ? undefined : subscribeLink}
        onClick={onSubscribeClick}
        variant='outline'
        size='md'
        fullWidth
        target={onSubscribeClick ? undefined : '_blank'}
      >
        Подписаться на{' '}
        <span className='project-card__subscribe-btn-logo'>
          <svg
            width='20'
            height='14'
            viewBox='0 0 31 22'
            fill='none'
            xmlns='http://www.w3.org/2000/svg'
            className='project-card__subscribe-btn-logo-svg'
          >
            <g clipPath='url(#clip0_466_307)'>
              <path
                opacity='0.8'
                d='M5.21471 14.5333V22H0V0H8.6213C10.2722 0 11.7396 0.311111 13.0062 0.933333C14.2815 1.55556 15.2598 2.43556 15.9586 3.57333C16.6574 4.72 17.0068 6.00889 17.0068 7.46667C17.0068 9.60889 16.2556 11.3244 14.7444 12.6133C13.2333 13.8933 11.1631 14.5422 8.53395 14.5422H5.20597L5.21471 14.5333ZM5.21471 10.4356H8.63004C9.64328 10.4356 10.4119 10.1778 10.936 9.66222C11.4689 9.14667 11.7309 8.42667 11.7309 7.48444C11.7309 6.45333 11.4601 5.63556 10.9186 5.02222C10.377 4.40889 9.63454 4.09778 8.69118 4.08889H5.21471V10.4356Z'
                className='project-card__subscribe-btn-logo-path-primary'
              />
              <g opacity='0.65'>
                <path
                  d='M23.357 13.7956L25.8377 0H31L26.4142 22H21.0073L18.1161 9.45778L15.2773 22H9.88786L5.28459 0H10.4644L12.9451 13.7956L15.9149 0H20.3347L23.3483 13.7956H23.357Z'
                  className='project-card__subscribe-btn-logo-path-accent'
                  fill='currentColor'
                />
              </g>
            </g>
            <defs>
              <clipPath id='clip0_466_307'>
                <rect width='31' height='22' fill='white' />
              </clipPath>
            </defs>
          </svg>
        </span>
      </Button>
    </div>
  );
};
