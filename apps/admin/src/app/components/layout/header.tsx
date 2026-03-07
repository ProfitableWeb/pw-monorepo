import { useState, useEffect } from 'react';
import { PanelLeftOpen, PanelRightOpen } from 'lucide-react';
import { IconButton } from '@/app/components/icons';
import { CommandPaletteTrigger } from '@/app/components/layout/command-palette';
import { useHeaderStore } from '@/app/store/header-store';
import { Breadcrumbs } from '@/app/components/common/breadcrumbs';
import { AISessionSelector } from './AISessionSelector';
import { CreateMenuPopover } from './CreateMenuPopover';
import { NotificationsPopover } from './NotificationsPopover';
import type { HeaderProps } from './header.types';

export function Header({
  title = 'Панел управления',
  sidebarCollapsed = false,
  onToggleSidebar,
  aiSidebarOpen = false,
  onToggleAiSidebar,
  showAISessionSelector = false,
}: HeaderProps) {
  const [mounted, setMounted] = useState(false);

  // Стор заголовка для хлебных крошек
  const headerTitle = useHeaderStore(state => state.title);
  const breadcrumbs = useHeaderStore(state => state.breadcrumbs);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Определяем что показывать в заголовке
  const displayTitle = headerTitle || title;

  if (!mounted) {
    return (
      <header className='flex-shrink-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60'>
        <div className='flex h-14 items-center gap-4 px-6'>
          <div className='flex flex-1 items-center gap-2'>
            <h1 className='text-xl font-semibold'>{title}</h1>
          </div>
        </div>
      </header>
    );
  }

  return (
    <header className='flex-shrink-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60'>
      <div className='flex justify-between h-14 items-center px-6'>
        <div className='flex items-center gap-2'>
          {onToggleSidebar && sidebarCollapsed && (
            <IconButton
              onClick={onToggleSidebar}
              className='hidden lg:flex -ml-3'
            >
              <PanelLeftOpen className='h-5 w-5' />
            </IconButton>
          )}

          {showAISessionSelector ? (
            <AISessionSelector />
          ) : breadcrumbs ? (
            <Breadcrumbs items={breadcrumbs} />
          ) : (
            <h1 className='text-sm leading-tight lg:text-lg lg:leading-normal font-bold uppercase'>
              {displayTitle}
            </h1>
          )}
        </div>

        <div className='flex items-center justify-end gap-0'>
          {/* Кнопка палитры команд */}
          <CommandPaletteTrigger />

          <CreateMenuPopover />

          <NotificationsPopover />

          {onToggleAiSidebar && !aiSidebarOpen && (
            <IconButton onClick={onToggleAiSidebar} title='AI Агенты'>
              <PanelRightOpen className='h-5 w-5' />
            </IconButton>
          )}
        </div>
      </div>
    </header>
  );
}
