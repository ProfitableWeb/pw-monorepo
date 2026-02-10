import { useEffect, useState } from 'react';
import { Command, CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, CommandSeparator } from '@/app/components/ui/command';
import { 
  LayoutDashboard, 
  Sparkles, 
  FileText, 
  Calendar, 
  FolderTree, 
  Tag, 
  Image, 
  BookOpen,
  FileHeart,
  Palette,
  Layout,
  Share2,
  Settings,
  Users,
  TrendingUp,
  BarChart3,
  Megaphone,
  Moon,
  Sun,
  Plus,
  Clock,
  Layers,
  Search,
} from 'lucide-react';
import { useNavigationStore, navigationItems } from '@/app/store/navigation-store';
import { useTheme } from '@/app/components/theme-provider';
import { cn } from '@/app/components/ui/utils';

const iconMap: Record<string, any> = {
  LayoutDashboard,
  Sparkles,
  FileText,
  Calendar,
  FolderTree,
  Tag,
  Image,
  BookOpen,
  FileHeart,
  Palette,
  Layout,
  Share2,
  Settings,
  Users,
  TrendingUp,
  BarChart3,
  Megaphone,
  Moon,
  Sun,
  Plus,
  Clock,
  Layers,
  Search,
};

interface QuickAction {
  id: string;
  title: string;
  icon: any;
  section: string;
  action: () => void;
}

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const { navigateTo, recentPages, getNavigationItem } = useNavigationStore();
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    const handleOpen = () => setOpen(true);

    document.addEventListener('keydown', down);
    document.addEventListener('openCommandPalette', handleOpen);
    return () => {
      document.removeEventListener('keydown', down);
      document.removeEventListener('openCommandPalette', handleOpen);
    };
  }, []);

  const handleNavigate = (pageId: string) => {
    navigateTo(pageId as any);
    setOpen(false);
  };

  const quickActions: QuickAction[] = [
    {
      id: 'create-post',
      title: 'Создать статью',
      icon: Plus,
      section: 'Действия',
      action: () => {
        navigateTo('articles');
        setOpen(false);
      },
    },
    {
      id: 'toggle-theme',
      title: theme === 'dark' ? 'Светлая тема' : 'Темная тема',
      icon: theme === 'dark' ? Sun : Moon,
      section: 'Действия',
      action: () => {
        setTheme(theme === 'dark' ? 'light' : 'dark');
        setOpen(false);
      },
    },
  ];

  const recentItems = recentPages
    .map(pageId => getNavigationItem(pageId))
    .filter(Boolean)
    .slice(0, 5);

  // Группировка по секциям
  const groupedItems = navigationItems.reduce((acc, item) => {
    if (!acc[item.section]) {
      acc[item.section] = [];
    }
    acc[item.section].push(item);
    return acc;
  }, {} as Record<string, typeof navigationItems>);

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput placeholder="Поиск по разделам и действиям..." />
      <CommandList>
        <CommandEmpty>Ничего не найдено.</CommandEmpty>

        {/* Recent */}
        {recentItems.length > 0 && (
          <>
            <CommandGroup heading="Недавние">
              {recentItems.map((item) => {
                if (!item) return null;
                const Icon = iconMap[item.icon] || FileText;
                return (
                  <CommandItem
                    key={item.id}
                    value={item.title}
                    onSelect={() => handleNavigate(item.id)}
                    className="flex items-center gap-3"
                  >
                    <Clock className="size-4 text-muted-foreground" />
                    <Icon className="size-4" />
                    <div className="flex-1">
                      <span>{item.title}</span>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {item.section}
                    </span>
                  </CommandItem>
                );
              })}
            </CommandGroup>
            <CommandSeparator />
          </>
        )}

        {/* Navigation by sections */}
        {Object.entries(groupedItems).map(([section, items], index) => (
          <div key={section}>
            <CommandGroup heading={section}>
              {items.map((item) => {
                const Icon = iconMap[item.icon] || FileText;
                return (
                  <CommandItem
                    key={item.id}
                    value={`${item.title} ${item.keywords?.join(' ') || ''}`}
                    onSelect={() => handleNavigate(item.id)}
                    className="flex items-center gap-3"
                  >
                    <Icon className="size-4" />
                    <div className="flex-1">
                      <span>{item.title}</span>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {item.section}
                    </span>
                  </CommandItem>
                );
              })}
            </CommandGroup>
            {index < Object.entries(groupedItems).length - 1 && (
              <CommandSeparator />
            )}
          </div>
        ))}

        {/* Quick Actions */}
        <CommandSeparator />
        <CommandGroup heading="Действия">
          {quickActions.map((action) => {
            const Icon = action.icon;
            return (
              <CommandItem
                key={action.id}
                value={action.title}
                onSelect={action.action}
                className="flex items-center gap-3"
              >
                <Icon className="size-4" />
                <span>{action.title}</span>
              </CommandItem>
            );
          })}
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}

// Trigger button component for the header
export function CommandPaletteTrigger() {
  const handleClick = () => {
    document.dispatchEvent(new Event('openCommandPalette'));
  };

  return (
    <button
      onClick={handleClick}
      className="hidden lg:flex items-center gap-2 px-3 py-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors border rounded-md hover:bg-muted/50"
    >
      <span className="text-xs">Поиск</span>
      <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
        <span className="text-xs">⌘</span>K
      </kbd>
    </button>
  );
}