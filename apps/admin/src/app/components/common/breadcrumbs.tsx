import { ChevronRight, ChevronDown } from 'lucide-react';
import { BreadcrumbItem } from '@/app/store/header-store';
import { cn } from '@/app/components/ui/utils';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/app/components/ui/dropdown-menu';
import { EditorialDropdown } from '@/app/components/common/editorial-dropdown';
import { ContentDropdown } from '@/app/components/common/content-dropdown';
import { SystemDropdown } from '@/app/components/common/system-dropdown';
import { useNavigationStore } from '@/app/store/navigation-store';

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  className?: string;
}

export function Breadcrumbs({ items, className }: BreadcrumbsProps) {
  const { navigateTo } = useNavigationStore();

  const handleBreadcrumbClick = (href?: string) => {
    if (href) {
      navigateTo(href as any);
    }
  };

  return (
    <nav className={cn('flex items-center gap-1.5 text-sm', className)}>
      {items.map((item, index) => {
        const isLast = index === items.length - 1;
        const Icon = item.icon;

        // Специальная обработка для "Редакция" и "Контент"
        const isEditorialSection = item.label === 'Редакция';
        const isContentSection = item.label === 'Контент';
        const isSystemSection = item.label === 'Система';

        return (
          <div key={index} className='flex items-center gap-1.5'>
            {index > 0 && (
              <ChevronRight className='h-4 w-4 text-muted-foreground' />
            )}

            {isEditorialSection && !isLast ? (
              <EditorialDropdown onNavigate={handleBreadcrumbClick}>
                <button
                  onClick={() => handleBreadcrumbClick('editorial-hub')}
                  className={cn(
                    'flex items-center gap-1 text-sm transition-colors hover:text-foreground',
                    'text-muted-foreground'
                  )}
                >
                  {Icon && <Icon className='h-4 w-4' />}
                  <span>{item.label}</span>
                  <ChevronDown className='h-3 w-3 opacity-60' />
                </button>
              </EditorialDropdown>
            ) : isContentSection && !isLast ? (
              <ContentDropdown onNavigate={handleBreadcrumbClick}>
                <button
                  onClick={() => handleBreadcrumbClick('content-hub')}
                  className={cn(
                    'flex items-center gap-1 text-sm transition-colors hover:text-foreground',
                    'text-muted-foreground'
                  )}
                >
                  {Icon && <Icon className='h-4 w-4' />}
                  <span>{item.label}</span>
                  <ChevronDown className='h-3 w-3 opacity-60' />
                </button>
              </ContentDropdown>
            ) : isSystemSection && !isLast ? (
              <SystemDropdown onNavigate={handleBreadcrumbClick}>
                <button
                  onClick={() => handleBreadcrumbClick('system-hub')}
                  className={cn(
                    'flex items-center gap-1 text-sm transition-colors hover:text-foreground',
                    'text-muted-foreground'
                  )}
                >
                  {Icon && <Icon className='h-4 w-4' />}
                  <span>{item.label}</span>
                  <ChevronDown className='h-3 w-3 opacity-60' />
                </button>
              </SystemDropdown>
            ) : item.dropdown && !isLast ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button
                    className={cn(
                      'flex items-center gap-1 text-sm transition-colors hover:text-foreground',
                      'text-muted-foreground'
                    )}
                  >
                    {Icon && <Icon className='h-4 w-4' />}
                    <span>{item.label}</span>
                    <ChevronDown className='h-3 w-3 opacity-60' />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align='start' className='w-56'>
                  {item.dropdown.map((dropItem, i) => {
                    const DropIcon = dropItem.icon;
                    return (
                      <DropdownMenuItem
                        key={i}
                        onClick={() => {
                          dropItem.onClick?.();
                          handleBreadcrumbClick(dropItem.href);
                        }}
                        className='cursor-pointer'
                      >
                        {DropIcon && <DropIcon className='h-4 w-4 mr-2' />}
                        {dropItem.label}
                      </DropdownMenuItem>
                    );
                  })}
                </DropdownMenuContent>
              </DropdownMenu>
            ) : item.href || item.onClick ? (
              <button
                onClick={() => {
                  item.onClick?.();
                  handleBreadcrumbClick(item.href);
                }}
                className={cn(
                  'flex items-center gap-1.5 text-sm transition-colors hover:text-foreground',
                  isLast ? 'text-foreground' : 'text-muted-foreground'
                )}
              >
                {Icon && <Icon className='h-4 w-4' />}
                <span>{item.label}</span>
              </button>
            ) : (
              <div
                className={cn(
                  'flex items-center gap-1.5 text-sm',
                  isLast ? 'text-foreground' : 'text-muted-foreground'
                )}
              >
                {Icon && <Icon className='h-4 w-4' />}
                <span>{item.label}</span>
              </div>
            )}
          </div>
        );
      })}
    </nav>
  );
}
