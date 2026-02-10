import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/app/components/ui/dropdown-menu';
import { Progress } from '@/app/components/ui/progress';
import { FileText, Calendar, FolderOpen, Tag, Image, Layers, ChevronRight } from 'lucide-react';
import { cn } from '@/app/components/ui/utils';
import { useNavigationStore } from '@/app/store/navigation-store';

interface ContentDropdownItem {
  id: 'articles' | 'calendar' | 'categories' | 'tags' | 'media';
  title: string;
  description: string;
  icon: typeof FileText;
  progress: number;
  color: string;
}

const contentItems: ContentDropdownItem[] = [
  {
    id: 'articles',
    title: 'Статьи',
    description: 'Управление публикациями',
    icon: FileText,
    progress: 65,
    color: 'text-blue-500',
  },
  {
    id: 'calendar',
    title: 'Календарь',
    description: 'График публикаций',
    icon: Calendar,
    progress: 80,
    color: 'text-green-500',
  },
  {
    id: 'categories',
    title: 'Категории',
    description: 'Организация контента',
    icon: FolderOpen,
    progress: 92,
    color: 'text-purple-500',
  },
  {
    id: 'tags',
    title: 'Метки',
    description: 'Теги и ключевые слова',
    icon: Tag,
    progress: 88,
    color: 'text-orange-500',
  },
  {
    id: 'media',
    title: 'Медиа',
    description: 'Изображения и файлы',
    icon: Image,
    progress: 74,
    color: 'text-pink-500',
  },
];

interface ContentDropdownProps {
  children: React.ReactNode;
  onNavigate?: (pageId: string) => void;
}

export function ContentDropdown({ children, onNavigate }: ContentDropdownProps) {
  const { navigateTo } = useNavigationStore();

  const handleItemClick = (pageId: 'articles' | 'calendar' | 'categories' | 'tags' | 'media' | 'content-hub') => {
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
          <p className="text-sm font-medium">КОНТЕНТ</p>
          <p className="text-xs text-muted-foreground mt-0.5">
            Управление материалами блога
          </p>
        </div>
        <DropdownMenuSeparator />
        {contentItems.map((item) => {
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
          onClick={() => handleItemClick('content-hub')}
        >
          <div className="flex items-center gap-3 flex-1">
            <div className="p-1.5 rounded-md bg-muted/50">
              <Layers className="size-4" />
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
