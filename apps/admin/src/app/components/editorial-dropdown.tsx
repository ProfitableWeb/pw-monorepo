import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/app/components/ui/dropdown-menu';
import { Progress } from '@/app/components/ui/progress';
import { FileHeart, Palette, Layout, Share2, BookOpen, ChevronRight } from 'lucide-react';
import { cn } from '@/app/components/ui/utils';
import { useNavigationStore } from '@/app/store/navigation-store';

interface EditorialDropdownItem {
  id: 'manifest' | 'style' | 'formats' | 'socials';
  title: string;
  description: string;
  icon: typeof FileHeart;
  progress: number;
  color: string;
}

const editorialItems: EditorialDropdownItem[] = [
  {
    id: 'manifest',
    title: 'Манифест',
    description: 'Миссия, ценности, аудитория',
    icon: FileHeart,
    progress: 87,
    color: 'text-purple-500',
  },
  {
    id: 'style',
    title: 'Стиль',
    description: 'Голос, правила, терминология',
    icon: Palette,
    progress: 72,
    color: 'text-blue-500',
  },
  {
    id: 'formats',
    title: 'Форматы',
    description: 'Шаблоны статей, структуры',
    icon: Layout,
    progress: 45,
    color: 'text-green-500',
  },
  {
    id: 'socials',
    title: 'Соцсети',
    description: 'Стратегия публикаций',
    icon: Share2,
    progress: 90,
    color: 'text-orange-500',
  },
];

interface EditorialDropdownProps {
  children: React.ReactNode;
  onNavigate?: (pageId: string) => void;
}

export function EditorialDropdown({ children, onNavigate }: EditorialDropdownProps) {
  const { navigateTo } = useNavigationStore();

  const handleItemClick = (pageId: 'manifest' | 'style' | 'formats' | 'socials' | 'editorial-hub') => {
    navigateTo(pageId);
    onNavigate?.(pageId);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        {children}
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-80">
        <div className="px-2 py-1.5">
          <p className="text-sm font-medium">РЕДАКЦИЯ</p>
          <p className="text-xs text-muted-foreground mt-0.5">
            Identity вашего издания
          </p>
        </div>
        <DropdownMenuSeparator />
        {editorialItems.map((item) => {
          const Icon = item.icon;
          return (
            <DropdownMenuItem
              key={item.id}
              className="p-3 cursor-pointer group"
              onClick={() => handleItemClick(item.id)}
            >
              <div className="flex items-start gap-3 flex-1">
                <div className={cn("p-1.5 rounded-md bg-muted/50", item.color)}>
                  <Icon className="size-4" />
                </div>
                <div className="flex-1 min-w-0 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-sm">{item.title}</span>
                    <ChevronRight className="size-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {item.description}
                  </p>
                  <div className="flex items-center gap-2">
                    <Progress value={item.progress} className="h-1 flex-1" />
                    <span className="text-xs font-medium text-muted-foreground">
                      {item.progress}%
                    </span>
                  </div>
                </div>
              </div>
            </DropdownMenuItem>
          );
        })}
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="p-3 cursor-pointer group"
          onClick={() => handleItemClick('editorial-hub')}
        >
          <div className="flex items-center gap-3 flex-1">
            <div className="p-1.5 rounded-md bg-muted/50">
              <BookOpen className="size-4" />
            </div>
            <div className="flex-1">
              <span className="font-medium text-sm">Обзор всего раздела</span>
            </div>
            <ChevronRight className="size-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
