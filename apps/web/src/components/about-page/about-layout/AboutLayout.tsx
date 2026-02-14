'use client';

import { ReactNode } from 'react';
import './AboutLayout.scss';

interface AboutLayoutProps {
  children: ReactNode;
  tableOfContents?: ReactNode;
  sidebar?: ReactNode;
}

export const AboutLayout = ({
  children,
  tableOfContents,
  sidebar,
}: AboutLayoutProps) => {
  return (
    <div className='about-layout'>
      {/* Sticky Table of Contents - слева */}
      {tableOfContents && (
        <aside className='about-layout__toc'>{tableOfContents}</aside>
      )}

      {/* Основной контент */}
      <main className='about-layout__content'>{children}</main>

      {/* Sticky Sidebar - справа */}
      {sidebar && <aside className='about-layout__sidebar'>{sidebar}</aside>}
    </div>
  );
};
