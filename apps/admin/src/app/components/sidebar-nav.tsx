import { useState } from "react";
import { cn } from "@/app/components/ui/utils";
import { useTheme } from "@/app/components/theme-provider";
import { Button } from "@/app/components/ui/button";
import { ScrollArea } from "@/app/components/ui/scroll-area";
import { IconButton } from "@/app/components/icons";
import {
  LayoutDashboard,
  FileText,
  Settings,
  FolderOpen,
  Tag,
  Image,
  Sparkles,
  Calendar,
  BookOpen,
  Palette,
  FileType,
  Share2,
  Moon,
  Sun,
  Users,
  TrendingUp,
  BarChart,
  LayoutPanelTop,
  SearchCheck,
  PanelLeftClose,
} from "lucide-react";

interface NavItem {
  title: string;
  icon: React.ReactNode;
  id: string;
}

interface NavSection {
  title: string;
  items: NavItem[];
}

const navSections: NavSection[] = [
  {
    title: "Главное",
    items: [
      { id: "dashboard", title: "Дашборд", icon: <LayoutDashboard className="h-5 w-5" /> },
      { id: "ai-center", title: "AI центр", icon: <Sparkles className="h-5 w-5" /> },
    ],
  },
  {
    title: "Контент",
    items: [
      { id: "articles", title: "Статьи", icon: <FileText className="h-5 w-5" /> },
      { id: "calendar", title: "Календарь", icon: <Calendar className="h-5 w-5" /> },
      { id: "categories", title: "Категории", icon: <FolderOpen className="h-5 w-5" /> },
      { id: "tags", title: "Метки", icon: <Tag className="h-5 w-5" /> },
      { id: "media", title: "Медиа", icon: <Image className="h-5 w-5" /> },
    ],
  },
  {
    title: "Редакция",
    items: [
      { id: "manifest", title: "Манифест", icon: <BookOpen className="h-5 w-5" /> },
      { id: "style", title: "Стиль", icon: <Palette className="h-5 w-5" /> },
      { id: "formats", title: "Форматы", icon: <FileType className="h-5 w-5" /> },
      { id: "socials", title: "Соцсети", icon: <Share2 className="h-5 w-5" /> },
    ],
  },
  {
    title: "Система",
    items: [
      { id: "settings", title: "Настройки", icon: <Settings className="h-5 w-5" /> },
      { id: "users", title: "Пользователи", icon: <Users className="h-5 w-5" /> },
      { id: "promotion", title: "Продвижение", icon: <TrendingUp className="h-5 w-5" /> },
      { id: "analytics", title: "Аналитика", icon: <BarChart className="h-5 w-5" /> },
      { id: "ads", title: "Реклама", icon: <LayoutPanelTop className="h-5 w-5" /> },
      { id: "seo", title: "SEO", icon: <SearchCheck className="h-5 w-5" /> },
    ],
  },
];

interface SidebarNavProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
  collapsed?: boolean;
  onToggleSidebar?: () => void;
}

export function SidebarNav({ activeSection, onSectionChange, collapsed = false, onToggleSidebar }: SidebarNavProps) {
  const { theme, setTheme } = useTheme();

  return (
    <div className="flex h-full flex-col border-r bg-card">
      <div className={cn(
        "flex h-14 items-center transition-all duration-300 flex-shrink-0",
        collapsed ? "justify-center px-2" : "justify-between px-4"
      )}>
        <div className="flex items-center gap-2">
          <h2 className={cn(
            "text-lg font-bold transition-all duration-300",
            collapsed ? "opacity-0 w-0 overflow-hidden" : "pl-2"
          )}>BlogDash</h2>
          {collapsed && (
            <span className="text-lg font-bold -ml-[3px]">BD</span>
          )}
        </div>
        {!collapsed && onToggleSidebar && (
          <IconButton 
            onClick={onToggleSidebar}
            size="sm"
          >
            <PanelLeftClose className="h-5 w-5" />
          </IconButton>
        )}
      </div>
      <ScrollArea className="flex-1 min-h-0 border-t">
        <nav className={cn(
          "space-y-6 transition-all duration-300",
          collapsed ? "p-2" : "p-4"
        )}>
          {navSections.map((section) => (
            <div key={section.title}>
              {!collapsed && (
                <h3 className="mb-2 px-3 text-xs font-semibold tracking-wide text-muted-foreground/60">
                  {section.title}
                </h3>
              )}
              <div className="space-y-1">
                {section.items.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => onSectionChange(item.id)}
                    className={cn(
                      "flex w-full items-center gap-3 rounded-lg text-sm transition-colors",
                      collapsed ? "justify-center px-3 py-3" : "px-3 py-2",
                      activeSection === item.id
                        ? "bg-accent/50 text-foreground"
                        : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                    )}
                    title={collapsed ? item.title : undefined}
                  >
                    {item.icon}
                    {!collapsed && <span>{item.title}</span>}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </nav>
      </ScrollArea>
      <div className={cn(
        "border-t transition-all duration-300 flex-shrink-0",
        collapsed ? "p-2" : "p-4"
      )}>
        <div className={cn(
          "flex items-center gap-3",
          collapsed ? "justify-center px-0" : "justify-between px-3 py-2"
        )}>
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
              <span className="text-sm font-medium">Н</span>
            </div>
            {!collapsed && (
              <div className="flex flex-col">
                <span className="text-sm font-medium">Николай</span>
                <span className="text-xs text-muted-foreground">Админ</span>
              </div>
            )}
          </div>
          {!collapsed && (
            <Button
              variant="outline"
              size="icon"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            >
              {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}