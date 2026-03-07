/**
 * Страница настроек — оркестратор.
 * Содержит sidebar-навигацию по разделам и рендерит выбранный подкомпонент.
 */

import { useEffect, useState } from 'react';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { ScrollArea } from '@/app/components/ui/scroll-area';
import { useHeaderStore } from '@/app/store/header-store';
import {
  Settings,
  LayoutDashboard,
  Search,
  ChevronRight,
  Save,
  X,
  Cog,
  Users,
  TrendingUp,
  BarChart3,
  LayoutPanelTop,
  SearchCheck,
} from 'lucide-react';
import { cn } from '@/app/components/ui/utils';
import { settingsCategories } from './settings.constants';
import { ProfileSettings } from './profile';
import { GeneralSettings } from './GeneralSettings';
import { BlogSettings } from './BlogSettings';
import { SecuritySettings } from './security';
import { NotificationSettings } from './NotificationSettings';
import { IntegrationSettings } from './IntegrationSettings';
import { AppearanceSettings } from './AppearanceSettings';
import { DeveloperSettings } from './DeveloperSettings';

export function SettingsPage() {
  const { setBreadcrumbs, reset } = useHeaderStore();
  const [activeCategory, setActiveCategory] = useState('profile');
  const [searchQuery, setSearchQuery] = useState('');
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  useEffect(() => {
    setBreadcrumbs([
      { label: 'Дашборд', href: 'dashboard', icon: LayoutDashboard },
      {
        label: 'Система',
        icon: Cog,
        dropdown: [
          { label: 'Настройки', icon: Settings, href: 'settings' },
          { label: 'Пользователи', icon: Users, href: 'users' },
          { label: 'Продвижение', icon: TrendingUp, href: 'promotion' },
          { label: 'Аналитика', icon: BarChart3, href: 'analytics' },
          { label: 'Реклама', icon: LayoutPanelTop, href: 'ads' },
          { label: 'SEO', icon: SearchCheck, href: 'seo' },
        ],
      },
      { label: 'Настройки', icon: Settings },
    ]);

    return () => reset();
  }, [setBreadcrumbs, reset]);

  const renderCategoryContent = () => {
    switch (activeCategory) {
      case 'profile':
        return <ProfileSettings />;
      case 'general':
        return (
          <GeneralSettings
            onChangeDetected={() => setHasUnsavedChanges(true)}
          />
        );
      case 'blog':
        return (
          <BlogSettings onChangeDetected={() => setHasUnsavedChanges(true)} />
        );
      case 'security':
        return (
          <SecuritySettings
            onChangeDetected={() => setHasUnsavedChanges(true)}
          />
        );
      case 'notifications':
        return (
          <NotificationSettings
            onChangeDetected={() => setHasUnsavedChanges(true)}
          />
        );
      case 'integrations':
        return (
          <IntegrationSettings
            onChangeDetected={() => setHasUnsavedChanges(true)}
          />
        );
      case 'appearance':
        return (
          <AppearanceSettings
            onChangeDetected={() => setHasUnsavedChanges(true)}
          />
        );
      case 'developers':
        return (
          <DeveloperSettings
            onChangeDetected={() => setHasUnsavedChanges(true)}
          />
        );
      default:
        return null;
    }
  };

  const handleSave = () => {
    // Логика сохранения
    setHasUnsavedChanges(false);
  };

  const handleCancel = () => {
    setHasUnsavedChanges(false);
  };

  return (
    <div className='flex h-full overflow-hidden'>
      {/* Боковая навигация */}
      <aside className='w-64 border-r bg-card flex-shrink-0 flex flex-col'>
        <div className='p-4 border-b flex-shrink-0'>
          <div className='relative'>
            <Search className='absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground' />
            <Input
              placeholder='Поиск настроек...'
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className='pl-9'
            />
          </div>
        </div>
        <ScrollArea className='flex-1 min-h-0'>
          <nav className='p-2'>
            {settingsCategories.map(category => {
              const Icon = category.icon;
              const isActive = activeCategory === category.id;

              return (
                <button
                  key={category.id}
                  onClick={() => setActiveCategory(category.id)}
                  className={cn(
                    'w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors mb-1',
                    isActive
                      ? 'bg-accent text-accent-foreground font-medium'
                      : 'text-muted-foreground hover:bg-accent/50 hover:text-accent-foreground'
                  )}
                >
                  <Icon className='size-4 flex-shrink-0' />
                  <span className='flex-1 text-left'>{category.label}</span>
                  <ChevronRight
                    className={cn(
                      'size-4 transition-transform flex-shrink-0',
                      isActive && 'rotate-90'
                    )}
                  />
                </button>
              );
            })}
          </nav>
        </ScrollArea>
      </aside>

      {/* Основная область контента */}
      <div className='flex-1 flex flex-col min-w-0 min-h-0'>
        <ScrollArea className='flex-1 min-h-0'>
          <div className='max-w-4xl mx-auto p-6 pb-24'>
            {renderCategoryContent()}
          </div>
        </ScrollArea>

        {/* Фиксированная панель действий */}
        {hasUnsavedChanges && (
          <div className='border-t bg-card p-4 flex items-center justify-between flex-shrink-0'>
            <p className='text-sm text-muted-foreground'>
              У вас есть несохраненные изменения
            </p>
            <div className='flex gap-2'>
              <Button variant='outline' size='sm' onClick={handleCancel}>
                <X className='size-4 mr-2' />
                Отменить
              </Button>
              <Button size='sm' onClick={handleSave}>
                <Save className='size-4 mr-2' />
                Сохранить изменения
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
