import { useState, useEffect } from "react";
import { Bell, Plus, PanelLeftOpen, PanelRightOpen, Bot, Calendar, CheckCircle2, Settings, FileText, MessageSquare, CheckSquare, Workflow, Check } from "lucide-react";
import { Badge } from "@/app/components/ui/badge";
import { IconButton } from "@/app/components/icons";
import { CommandPaletteTrigger } from "@/app/components/command-palette";
import { useTheme } from "@/app/components/theme-provider";
import { 
  Popover, 
  PopoverContent, 
  PopoverTrigger 
} from "@/app/components/ui/popover";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/app/components/ui/dropdown-menu";
import { ScrollArea } from "@/app/components/ui/scroll-area";
import { Separator } from "@/app/components/ui/separator";
import { Button } from "@/app/components/ui/button";
import { useAIStore } from "@/app/store/ai-store";
import { useHeaderStore } from "@/app/store/header-store";
import { Breadcrumbs } from "@/app/components/breadcrumbs";
import { cn } from "@/app/components/ui/utils";

interface HeaderProps {
  title: string;
  sidebarCollapsed?: boolean;
  onToggleSidebar?: () => void;
  aiSidebarOpen?: boolean;
  onToggleAiSidebar?: () => void;
  onMobileMenuToggle?: () => void;
  showAISessionSelector?: boolean;
}

// Mock notifications data
const agentNotifications = [
  {
    id: "1",
    type: "agent",
    title: "Исследование завершено",
    description: "AI-агент завершил исследование рынка блоков питания",
    time: "5 мин назад",
    status: "completed",
  },
  {
    id: "2",
    type: "agent",
    title: "Статья написана",
    description: "Готова статья «10 трендов веб-дизайна 2026»",
    time: "1 час назад",
    status: "completed",
  },
];

const publicationNotifications = [
  {
    id: "3",
    type: "publication",
    title: "Публикация через 2 часа",
    description: "Статья «Гайд по React Server Components» будет опубликована",
    time: "Сегодня в 15:00",
    status: "scheduled",
  },
  {
    id: "4",
    type: "publication",
    title: "Публикация завтра",
    description: "Обзор «Лучшие практики TypeScript» ожидает публикации",
    time: "Завтра в 10:00",
    status: "scheduled",
  },
];

export function Header({ 
  title = "Панел управления", 
  sidebarCollapsed = false, 
  onToggleSidebar, 
  aiSidebarOpen = false, 
  onToggleAiSidebar,
  showAISessionSelector = false
}: HeaderProps) {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [createMenuOpen, setCreateMenuOpen] = useState(false);
  
  // Header store for breadcrumbs
  const headerTitle = useHeaderStore((state) => state.title);
  const breadcrumbs = useHeaderStore((state) => state.breadcrumbs);
  
  // AI Store for session selector
  const sessions = useAIStore((state) => state.sessions);
  const currentSessionId = useAIStore((state) => state.currentSessionId);
  const switchSession = useAIStore((state) => state.switchSession);
  const getMessages = useAIStore((state) => state.getMessages);
  const createNewSession = useAIStore((state) => state.createNewSession);
  const currentSession = sessions.find(s => s.id === currentSessionId);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleConfigureNotifications = () => {
    setNotificationsOpen(false);
    console.log("Configure notifications clicked");
  };

  const handleCreateAction = (action: string) => {
    setCreateMenuOpen(false);
    console.log(`Create action: ${action}`);
    // TODO: Implement actual action handlers
  };

  // Определяем что показывать в заголовке
  const displayTitle = headerTitle || title;

  if (!mounted) {
    return (
      <header className="flex-shrink-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex h-14 items-center gap-4 px-6">
          <div className="flex flex-1 items-center gap-2">
            <h1 className="text-xl font-semibold">{title}</h1>
          </div>
        </div>
      </header>
    );
  }

  return (
    <header className="flex-shrink-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex justify-between h-14 items-center px-6">
        <div className="flex items-center gap-2">
          {onToggleSidebar && sidebarCollapsed && (
            <IconButton onClick={onToggleSidebar} className="hidden lg:flex -ml-3">
              <PanelLeftOpen className="h-5 w-5" />
            </IconButton>
          )}
          
          {showAISessionSelector ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="gap-2 h-9 justify-start">
                  <MessageSquare className="h-4 w-4" />
                  <span className="font-medium text-sm max-w-[200px] lg:max-w-[400px] truncate">
                    {currentSession?.title || "Сочинение манифеста"}
                  </span>
                  <Badge variant="secondary" className="ml-1 h-5 px-1.5 text-xs">
                    {getMessages().length}
                  </Badge>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-80">
                {sessions.map((session) => (
                  <DropdownMenuItem
                    key={session.id}
                    onClick={() => switchSession(session.id)}
                    className="flex items-start gap-3 p-3 cursor-pointer"
                  >
                    <MessageSquare className={cn(
                      "h-4 w-4 mt-1 flex-shrink-0",
                      session.id === currentSessionId && "text-primary"
                    )} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className={cn(
                          "font-medium text-sm",
                          session.id === currentSessionId && "text-primary"
                        )}>
                          {session.title}
                        </span>
                        {session.id === currentSessionId && (
                          <Check className="h-3 w-3 text-primary flex-shrink-0" />
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        {session.messages.length} сообщений · {session.updatedAt.toLocaleDateString('ru-RU', {
                          day: 'numeric',
                          month: 'short'
                        })}
                      </p>
                    </div>
                  </DropdownMenuItem>
                ))}
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  className="text-primary cursor-pointer"
                  onClick={() => {
                    createNewSession("Новая сессия");
                  }}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Новая сессия
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            breadcrumbs ? (
              <Breadcrumbs items={breadcrumbs} />
            ) : (
              <h1 className="text-sm leading-tight lg:text-lg lg:leading-normal font-bold uppercase">{displayTitle}</h1>
            )
          )}
        </div>
        
        <div className="flex items-center justify-end gap-0">
          {/* Command Palette Button */}
          <CommandPaletteTrigger />
          
          <Popover open={createMenuOpen} onOpenChange={setCreateMenuOpen}>
            <PopoverTrigger asChild>
              <IconButton>
                <Plus className="h-5 w-5" />
              </IconButton>
            </PopoverTrigger>
            <PopoverContent className="w-[200px] p-0" align="end" sideOffset={8}>
              <div className="flex flex-col">
                <div className="px-4 py-3 border-b">
                  <h3 className="font-semibold text-sm">Создать</h3>
                </div>

                <ScrollArea className="max-h-[500px]">
                  <div className="p-2">
                    <button
                      className="w-full text-left px-3 py-2.5 rounded-md hover:bg-muted/50 transition-colors group"
                      onClick={() => handleCreateAction("article")}
                    >
                      <div className="flex gap-3">
                        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                          <FileText className="h-4 w-4 text-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium">Статью</p>
                        </div>
                      </div>
                    </button>

                    <button
                      className="w-full text-left px-3 py-2.5 rounded-md hover:bg-muted/50 transition-colors group"
                      onClick={() => handleCreateAction("dialog")}
                    >
                      <div className="flex gap-3">
                        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                          <MessageSquare className="h-4 w-4 text-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium">Диалог</p>
                        </div>
                      </div>
                    </button>

                    <button
                      className="w-full text-left px-3 py-2.5 rounded-md hover:bg-muted/50 transition-colors group"
                      onClick={() => handleCreateAction("task")}
                    >
                      <div className="flex gap-3">
                        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                          <CheckSquare className="h-4 w-4 text-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium">Задачу</p>
                        </div>
                      </div>
                    </button>

                    <button
                      className="w-full text-left px-3 py-2.5 rounded-md hover:bg-muted/50 transition-colors group"
                      onClick={() => handleCreateAction("process")}
                    >
                      <div className="flex gap-3">
                        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                          <Workflow className="h-4 w-4 text-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium">Процесс</p>
                        </div>
                      </div>
                    </button>
                  </div>
                </ScrollArea>
              </div>
            </PopoverContent>
          </Popover>

          <Popover open={notificationsOpen} onOpenChange={setNotificationsOpen}>
            <PopoverTrigger asChild>
              <button className="relative inline-flex items-center justify-center rounded-md transition-colors hover:bg-accent hover:text-accent-foreground h-10 w-10 [&_svg]:opacity-40 [&_svg]:hover:opacity-100 [&_svg]:transition-opacity">
                <Bell className="h-5 w-5" />
                <Badge 
                  className="absolute right-[1px] top-[2px] h-3.5 w-3.5 rounded-full p-0 flex items-center justify-center text-[9px] bg-green-500 text-white hover:bg-green-600 pointer-events-none"
                >
                  {agentNotifications.length + publicationNotifications.length}
                </Badge>
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-[400px] p-0" align="end" sideOffset={8}>
              <div className="flex flex-col">
                <div className="px-4 py-3 border-b">
                  <h3 className="font-semibold text-sm">Уведомления</h3>
                </div>

                <ScrollArea className="max-h-[500px]">
                  <div className="p-2">
                    {agentNotifications.length > 0 && (
                      <div className="mb-2">
                        <div className="px-2 py-1.5 text-xs font-medium text-muted-foreground">
                          От AI-агентов
                        </div>
                        <div className="space-y-1">
                          {agentNotifications.map((notification) => (
                            <button
                              key={notification.id}
                              className="w-full text-left px-3 py-2.5 rounded-md hover:bg-muted/50 transition-colors group"
                            >
                              <div className="flex gap-3">
                                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                                  <Bot className="h-4 w-4 text-primary" />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-start justify-between gap-2 mb-0.5">
                                    <p className="text-sm font-medium">{notification.title}</p>
                                    <CheckCircle2 className="h-4 w-4 text-green-500 flex-shrink-0" />
                                  </div>
                                  <p className="text-xs text-muted-foreground line-clamp-2 mb-1">
                                    {notification.description}
                                  </p>
                                  <p className="text-xs text-muted-foreground/70">{notification.time}</p>
                                </div>
                              </div>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {agentNotifications.length > 0 && publicationNotifications.length > 0 && (
                      <Separator className="my-2" />
                    )}

                    {publicationNotifications.length > 0 && (
                      <div>
                        <div className="px-2 py-1.5 text-xs font-medium text-muted-foreground">
                          Грядущие публикации
                        </div>
                        <div className="space-y-1">
                          {publicationNotifications.map((notification) => (
                            <button
                              key={notification.id}
                              className="w-full text-left px-3 py-2.5 rounded-md hover:bg-muted/50 transition-colors group"
                            >
                              <div className="flex gap-3">
                                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                                  <Calendar className="h-4 w-4 text-muted-foreground" />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-start justify-between gap-2 mb-0.5">
                                    <p className="text-sm font-medium">{notification.title}</p>
                                  </div>
                                  <p className="text-xs text-muted-foreground line-clamp-2 mb-1">
                                    {notification.description}
                                  </p>
                                  <p className="text-xs text-muted-foreground/70">{notification.time}</p>
                                </div>
                              </div>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </ScrollArea>

                <div className="border-t p-2">
                  <Button
                    variant="ghost"
                    className="w-full justify-start text-sm h-9"
                    onClick={handleConfigureNotifications}
                  >
                    <Settings className="h-4 w-4 mr-2" />
                    Настроить уведомления
                  </Button>
                </div>
              </div>
            </PopoverContent>
          </Popover>

          {onToggleAiSidebar && !aiSidebarOpen && (
            <IconButton 
              onClick={onToggleAiSidebar}
              title="AI Агенты"
            >
              <PanelRightOpen className="h-5 w-5" />
            </IconButton>
          )}
        </div>
      </div>
    </header>
  );
}