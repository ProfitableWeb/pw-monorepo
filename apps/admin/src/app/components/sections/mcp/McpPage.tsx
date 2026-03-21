/**
 * PW-061-A | Оркестратор MCP-раздела.
 * Двухколоночный лейаут с sidebar-навигацией (аналог SeoPage).
 */
import { useEffect, useState } from 'react';
import { Search, LayoutDashboard, Cable } from 'lucide-react';
import { useHeaderStore } from '@/app/store/header-store';
import { SYSTEM_BREADCRUMB } from '@/app/store/breadcrumb.constants';
import { ScrollArea } from '@/app/components/ui/scroll-area';
import { Input } from '@/app/components/ui/input';
import { cn } from '@/app/components/ui/utils';
import { mcpSections } from './mcp.constants';
import { McpApiKeys } from './McpApiKeys';
import { McpConnectionGuide } from './McpConnectionGuide';
import { McpConnectionTest } from './McpConnectionTest';
import { McpAuditLog } from './McpAuditLog';
import type { McpSectionId } from './mcp.types';

export function McpPage() {
  const { setBreadcrumbs, reset } = useHeaderStore();
  const [activeSection, setActiveSection] = useState<McpSectionId>('keys');
  const [searchQuery, setSearchQuery] = useState('');

  // Breadcrumbs — аналог SeoPage
  useEffect(() => {
    const currentSection = mcpSections.find(s => s.id === activeSection);

    setBreadcrumbs([
      { label: 'Дашборд', href: 'dashboard', icon: LayoutDashboard },
      SYSTEM_BREADCRUMB,
      { label: 'MCP', icon: Cable },
      ...(currentSection
        ? [{ label: currentSection.label, icon: currentSection.icon }]
        : []),
    ]);

    return () => reset();
  }, [setBreadcrumbs, reset, activeSection]);

  // Секции, занимающие всю высоту (без ScrollArea обёртки)
  const isFullHeight = activeSection === 'audit';

  const filteredSections = searchQuery
    ? mcpSections.filter(s =>
        s.label.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : mcpSections;

  const renderContent = () => {
    switch (activeSection) {
      case 'keys':
        return (
          <div className='space-y-6'>
            <McpConnectionTest />
            <McpApiKeys />
          </div>
        );
      case 'guide':
        return (
          <div className='space-y-6'>
            <McpConnectionGuide />
          </div>
        );
      case 'audit':
        return <McpAuditLog />;
      default:
        return null;
    }
  };

  return (
    <div className='flex h-full overflow-hidden'>
      {/* Sidebar Navigation */}
      <aside className='w-64 border-r bg-card flex-shrink-0 flex flex-col'>
        <div className='px-4 py-3 border-b flex-shrink-0'>
          <div className='relative'>
            <Search className='absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground' />
            <Input
              placeholder='Поиск...'
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className='pl-9 h-8 text-xs'
            />
          </div>
        </div>

        <ScrollArea className='flex-1 min-h-0'>
          <nav className='p-2'>
            {filteredSections.map(section => {
              const Icon = section.icon;
              const isActive = activeSection === section.id;

              return (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={cn(
                    'w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors mb-1',
                    isActive
                      ? 'bg-accent text-accent-foreground font-medium'
                      : 'text-muted-foreground hover:bg-accent/50 hover:text-accent-foreground'
                  )}
                >
                  <Icon className='size-4 flex-shrink-0' />
                  <span className='flex-1 text-left'>{section.label}</span>
                </button>
              );
            })}
          </nav>
        </ScrollArea>
      </aside>

      {/* Content area */}
      <div className='flex-1 flex flex-col min-w-0 min-h-0'>
        {isFullHeight ? (
          renderContent()
        ) : (
          <ScrollArea className='flex-1 min-h-0'>
            <div className='max-w-4xl mx-auto p-6'>{renderContent()}</div>
          </ScrollArea>
        )}
      </div>
    </div>
  );
}
