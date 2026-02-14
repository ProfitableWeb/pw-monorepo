import { ReactNode } from 'react';
import './SidebarWidget.scss';

interface SidebarWidgetProps {
  title?: string;
  children: ReactNode;
  className?: string;
}

export const SidebarWidget = ({
  title,
  children,
  className = '',
}: SidebarWidgetProps) => {
  return (
    <div className={`sidebar-widget ${className}`}>
      {title && <h3 className='sidebar-widget__title'>{title}</h3>}
      <div className='sidebar-widget__content'>{children}</div>
    </div>
  );
};
