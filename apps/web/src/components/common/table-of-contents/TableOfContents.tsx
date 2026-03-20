'use client';

import { useState, useEffect } from 'react';
import './TableOfContents.scss';

interface TocItem {
  id: string;
  title: string;
  level: number;
}

interface TableOfContentsProps {
  items: TocItem[];
}

export const TableOfContents = ({ items }: TableOfContentsProps) => {
  const [activeId, setActiveId] = useState<string>('');

  // Нормализуем уровни: минимальный level = 1 (корневой, без отступа)
  const minLevel = items.length > 0 ? Math.min(...items.map(i => i.level)) : 2;
  const normalizedItems = items.map(item => ({
    ...item,
    normalizedLevel: item.level - minLevel + 1,
  }));

  useEffect(() => {
    const container = document.querySelector('.main-layout');

    // Intersection Observer для отслеживания активной секции
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      {
        root: container,
        rootMargin: '-100px 0px -80% 0px',
      }
    );

    // Наблюдаем за всеми секциями
    items.forEach(({ id }) => {
      const element = document.getElementById(id);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, [items]);

  const handleClick = (id: string) => {
    const element = document.getElementById(id);
    const container = document.querySelector('.main-layout');

    if (element && container) {
      // Получаем высоту app-bar для учёта при прокрутке
      const appBar = document.querySelector('.app-bar');
      const appBarHeight = appBar ? appBar.getBoundingClientRect().height : 80;
      const offset = appBarHeight + 20; // Дополнительный отступ 20px

      const elementPosition = element.offsetTop;
      const offsetPosition = elementPosition - offset;

      container.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });
    }
  };

  return (
    <nav className='toc' aria-label='Table of contents'>
      <h2 className='toc__title'>Содержание</h2>
      <ul className='toc__list'>
        {normalizedItems.map(item => (
          <li
            key={item.id}
            className={`toc__item toc__item--level-${item.normalizedLevel} ${
              activeId === item.id ? 'toc__item--active' : ''
            }`}
          >
            <button
              className='toc__link'
              onClick={() => handleClick(item.id)}
              aria-current={activeId === item.id ? 'location' : undefined}
            >
              {item.title}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
};
