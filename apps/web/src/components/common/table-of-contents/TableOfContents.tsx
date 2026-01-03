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

export const TableOfContents: React.FC<TableOfContentsProps> = ({ items }) => {
  const [activeId, setActiveId] = useState<string>('');

  useEffect(() => {
    // Intersection Observer для отслеживания активной секции
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: '-100px 0px -80% 0px' }
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
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <nav className="toc" aria-label="Table of contents">
      <h2 className="toc__title">Содержание</h2>
      <ul className="toc__list">
        {items.map((item) => (
          <li
            key={item.id}
            className={`toc__item toc__item--level-${item.level} ${
              activeId === item.id ? 'toc__item--active' : ''
            }`}
          >
            <button
              className="toc__link"
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
