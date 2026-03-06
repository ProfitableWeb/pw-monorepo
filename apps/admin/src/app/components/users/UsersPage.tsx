import { useEffect, useState } from 'react';
import { Input } from '@/app/components/ui/input';
import { useHeaderStore } from '@/app/store/header-store';
import {
  Users,
  LayoutDashboard,
  Search,
  ChevronRight,
  Settings,
  TrendingUp,
  BarChart3,
  LayoutPanelTop,
  SearchCheck,
  Cog,
} from 'lucide-react';
import { cn } from '@/app/components/ui/utils';
import { ScrollArea } from '@/app/components/ui/scroll-area';
import { NAVIGATION_ITEMS } from './users.constants';
import { UsersList } from './UsersList';
import { TeamSection } from './TeamSection';
import { InvitesSection } from './InvitesSection';
import { AccessSection } from './AccessSection';
import {
  CommentsSection,
  BlacklistSection,
  RolesSection,
  ActivitySection,
  SupportSection,
} from './StubSections';

export function UsersPage() {
  const { setBreadcrumbs, reset } = useHeaderStore();
  const [activeSubsection, setActiveSubsection] = useState('list');
  const [searchQuery, setSearchQuery] = useState('');

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
      { label: 'Пользователи', icon: Users },
    ]);

    return () => reset();
  }, [setBreadcrumbs, reset]);

  const renderSubsection = () => {
    switch (activeSubsection) {
      case 'list':
        return <UsersList searchQuery={searchQuery} />;
      case 'team':
        return <TeamSection />;
      case 'invites':
        return <InvitesSection />;
      case 'comments':
        return <CommentsSection />;
      case 'blacklist':
        return <BlacklistSection />;
      case 'roles':
        return <RolesSection />;
      case 'access':
        return <AccessSection />;
      case 'activity':
        return <ActivitySection />;
      case 'support':
        return <SupportSection />;
      default:
        return <UsersList searchQuery={searchQuery} />;
    }
  };

  return (
    <div className='flex h-full overflow-hidden'>
      {/* Боковая навигация */}
      <aside className='w-64 border-r bg-card flex-shrink-0 flex flex-col'>
        <div className='p-4 border-b flex-shrink-0'>
          <div className='relative'>
            <Search className='absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground' />
            <Input
              placeholder='Поиск...'
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className='pl-9'
            />
          </div>
        </div>

        <ScrollArea className='flex-1 min-h-0'>
          <nav className='p-2'>
            {NAVIGATION_ITEMS.map(item => {
              const Icon = item.icon;
              const isActive = activeSubsection === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => setActiveSubsection(item.id)}
                  className={cn(
                    'w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors mb-1',
                    isActive
                      ? 'bg-accent text-accent-foreground font-medium'
                      : 'text-muted-foreground hover:bg-accent/50 hover:text-accent-foreground'
                  )}
                >
                  <Icon className='size-4 flex-shrink-0' />
                  <span className='flex-1 text-left'>{item.label}</span>
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

      {/* Основной контент */}
      <div className='flex-1 flex flex-col min-w-0 min-h-0'>
        <ScrollArea className='flex-1 min-h-0'>
          <div className='max-w-6xl mx-auto p-6'>{renderSubsection()}</div>
        </ScrollArea>
      </div>
    </div>
  );
}
