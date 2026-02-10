import { 
  Settings,
  Users,
  TrendingUp,
  BarChart3,
  LayoutPanelTop,
  SearchCheck,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/app/components/ui/dropdown-menu";

interface SystemDropdownProps {
  children: React.ReactNode;
  onNavigate: (page: string) => void;
}

export function SystemDropdown({ children, onNavigate }: SystemDropdownProps) {
  const systemItems = [
    { id: 'settings', label: 'Настройки', icon: Settings },
    { id: 'users', label: 'Пользователи', icon: Users },
    { id: 'promotion', label: 'Продвижение', icon: TrendingUp },
    { id: 'analytics', label: 'Аналитика', icon: BarChart3 },
    { id: 'ads', label: 'Реклама', icon: LayoutPanelTop },
    { id: 'seo', label: 'SEO', icon: SearchCheck },
  ];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        {children}
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-56">
        {systemItems.map((item) => {
          const Icon = item.icon;
          return (
            <DropdownMenuItem
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className="cursor-pointer"
            >
              <Icon className="h-4 w-4 mr-2" />
              {item.label}
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
