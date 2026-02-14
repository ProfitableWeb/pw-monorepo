'use client';

import React from 'react';
import './ArticleResources.scss';

export interface Resource {
  /**
   * Уникальный идентификатор ресурса
   */
  id: string;

  /**
   * Название ресурса (текст ссылки)
   */
  title: string;

  /**
   * URL ресурса
   */
  url: string;

  /**
   * Пояснение/описание ресурса (отображается после тире)
   */
  description?: string;

  /**
   * Открывать ссылку в новой вкладке (по умолчанию true для внешних ссылок)
   */
  external?: boolean;
}

interface ArticleResourcesProps {
  /**
   * Массив ресурсов/ссылок
   */
  resources: Resource[];

  /**
   * Дополнительный CSS класс
   */
  className?: string;
}

/**
 * ArticleResources - компонент "Ресурсы"
 *
 * Отображает список ссылок на использованные материалы с пояснениями.
 * Использует SEO-friendly разметку и schema.org для лучшей индексации.
 *
 * Особенности:
 * - Schema.org ItemList разметка для SEO
 * - Семантическая разметка (nav/section)
 * - Правильные атрибуты ссылок для accessibility
 * - Автоматическое определение внешних ссылок
 *
 * Пример использования:
 * ```tsx
 * <ArticleResources resources={[
 *   {
 *     id: '1',
 *     title: 'Оптимальная ширина строки для чтения',
 *     url: 'https://example.com/article',
 *     description: 'Исследование о влиянии длины строки на читаемость',
 *     external: true
 *   }
 * ]} />
 * ```
 */
export const ArticleResources = ({
  resources,
  className = '',
}: ArticleResourcesProps) => {
  // Генерируем schema.org ItemList разметку для SEO
  const itemListSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Ресурсы',
    description: 'Список использованных материалов и источников',
    itemListElement: resources.map((resource, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      item: {
        '@type': 'CreativeWork',
        name: resource.title,
        url: resource.url,
        description: resource.description,
      },
    })),
  };

  return (
    <section className={`article-resources ${className}`}>
      {/* Schema.org разметка для SEO */}
      <script
        type='application/ld+json'
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }}
      />

      {/* Заголовок */}
      <h2 className='article-resources__title'>Ресурсы</h2>

      {/* Список ресурсов */}
      <nav
        className='article-resources__list'
        aria-label='Список использованных ресурсов'
      >
        <ul className='article-resources__items'>
          {resources.map(resource => (
            <li key={resource.id} className='article-resources__item'>
              <a
                href={resource.url}
                className='article-resources__link'
                target={resource.external !== false ? '_blank' : undefined}
                rel={
                  resource.external !== false
                    ? 'noopener noreferrer'
                    : undefined
                }
                aria-label={
                  resource.description
                    ? `${resource.title} — ${resource.description}`
                    : resource.title
                }
              >
                {resource.title}
              </a>
              {resource.description && (
                <>
                  {' '}
                  <span className='article-resources__separator'>—</span>{' '}
                  <span className='article-resources__description'>
                    {resource.description}
                  </span>
                </>
              )}
            </li>
          ))}
        </ul>
      </nav>
    </section>
  );
};
