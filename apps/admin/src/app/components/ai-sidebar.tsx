import { useState } from "react";
import { cn } from "@/app/components/ui/utils";
import { 
  Sparkles, 
  MessageSquare, 
  Play, 
  Pause, 
  Clock, 
  TrendingUp,
  Search,
  FileText,
  Calendar,
  CheckCircle2,
  Loader2,
  AlertCircle,
  X,
  PanelRightClose
} from "lucide-react";
import { Button } from "@/app/components/ui/button";
import { ScrollArea } from "@/app/components/ui/scroll-area";
import { Badge } from "@/app/components/ui/badge";
import { IconButton } from "@/app/components/icons";

interface AiSidebarProps {
  isOpen: boolean;
  isMobile?: boolean;
  onClose?: () => void;
}

interface Chat {
  id: string;
  title: string;
  timestamp: string;
  preview: string;
}

interface Process {
  id: string;
  name: string;
  status: "running" | "paused" | "completed" | "error";
  icon: typeof TrendingUp;
  lastUpdate: string;
  description: string;
}

const recentChats: Chat[] = [
  {
    id: "1",
    title: "Идеи для статьи о веб-дизайне",
    timestamp: "2 мин назад",
    preview: "Предложи темы для статьи про современные тренды в веб-дизайне 2024..."
  },
  {
    id: "2",
    title: "Оптимизация контента",
    timestamp: "1 час назад",
    preview: "Как улучшить SEO для существующих статей блога..."
  },
  {
    id: "3",
    title: "Анализ аудитории",
    timestamp: "3 часа назад",
    preview: "Проанализируй демографию читателей и предложи темы..."
  }
];

const autonomousProcesses: Process[] = [
  {
    id: "1",
    name: "Мониторинг новостей",
    status: "running",
    icon: TrendingUp,
    lastUpdate: "Обновлено 5 мин назад",
    description: "Отслеживание новостей в технологической сфере"
  },
  {
    id: "2",
    name: "Исследования",
    status: "running",
    icon: Search,
    lastUpdate: "Обновлено 12 мин назад",
    description: "Поиск трендов и актуальных тем"
  },
  {
    id: "3",
    name: "Поиск материала",
    status: "paused",
    icon: FileText,
    lastUpdate: "Приостановлено 1 час назад",
    description: "Сбор референсов и исследований"
  },
  {
    id: "4",
    name: "Контент план",
    status: "completed",
    icon: Calendar,
    lastUpdate: "Завершено 2 часа назад",
    description: "Формирование плана публикаций на неделю"
  }
];

const getStatusIcon = (status: Process["status"]) => {
  switch (status) {
    case "running":
      return <Loader2 className="h-3 w-3 animate-spin text-blue-500" />;
    case "paused":
      return <Pause className="h-3 w-3 text-yellow-500" />;
    case "completed":
      return <CheckCircle2 className="h-3 w-3 text-green-500" />;
    case "error":
      return <AlertCircle className="h-3 w-3 text-red-500" />;
  }
};

const getStatusBadge = (status: Process["status"]) => {
  switch (status) {
    case "running":
      return <Badge variant="outline" className="border-blue-500 text-blue-500">Активен</Badge>;
    case "paused":
      return <Badge variant="outline" className="border-yellow-500 text-yellow-500">Пауза</Badge>;
    case "completed":
      return <Badge variant="outline" className="border-green-500 text-green-500">Готово</Badge>;
    case "error":
      return <Badge variant="outline" className="border-red-500 text-red-500">Ошибка</Badge>;
  }
};

// Shared content component
function AiSidebarContent() {
  return (
    <div className="p-4 space-y-6">
      {/* Recent Chats Section */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
            Последние чаты
          </h3>
          <Button variant="ghost" size="sm" className="h-7 text-xs">
            Все
          </Button>
        </div>
        <div className="space-y-2">
          {recentChats.map((chat) => (
            <button
              key={chat.id}
              className="w-full text-left p-3 rounded-lg border bg-card hover:bg-accent transition-colors"
            >
              <div className="flex items-start gap-2 mb-1">
                <MessageSquare className="h-4 w-4 mt-0.5 flex-shrink-0 text-muted-foreground" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{chat.title}</p>
                  <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                    <Clock className="h-3 w-3" />
                    {chat.timestamp}
                  </p>
                </div>
              </div>
              <p className="text-xs text-muted-foreground line-clamp-2 ml-6">
                {chat.preview}
              </p>
            </button>
          ))}
        </div>
        <Button variant="outline" className="w-full mt-3" size="sm">
          <MessageSquare className="h-4 w-4 mr-2" />
          Новый чат
        </Button>
      </div>

      {/* Autonomous Processes Section */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
            Автономные процессы
          </h3>
        </div>
        <div className="space-y-2">
          {autonomousProcesses.map((process) => {
            const Icon = process.icon;
            return (
              <div
                key={process.id}
                className="p-3 rounded-lg border bg-card"
              >
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2 flex-1">
                    <Icon className="h-4 w-4 flex-shrink-0 text-muted-foreground" />
                    <p className="text-sm font-medium">{process.name}</p>
                  </div>
                  {getStatusIcon(process.status)}
                </div>
                <p className="text-xs text-muted-foreground mb-2">
                  {process.description}
                </p>
                <div className="flex items-center justify-between">
                  <p className="text-xs text-muted-foreground">
                    {process.lastUpdate}
                  </p>
                  {getStatusBadge(process.status)}
                </div>
                <div className="flex gap-2 mt-2">
                  {process.status === "running" ? (
                    <Button variant="outline" size="sm" className="flex-1 h-7 text-xs">
                      <Pause className="h-3 w-3 mr-1" />
                      Пауза
                    </Button>
                  ) : process.status === "paused" ? (
                    <Button variant="outline" size="sm" className="flex-1 h-7 text-xs">
                      <Play className="h-3 w-3 mr-1" />
                      Запустить
                    </Button>
                  ) : null}
                  <Button variant="ghost" size="sm" className="flex-1 h-7 text-xs">
                    Настройки
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
        <Button variant="outline" className="w-full mt-3" size="sm">
          <Play className="h-4 w-4 mr-2" />
          Новый процесс
        </Button>
      </div>
    </div>
  );
}

export function AiSidebar({ isOpen, isMobile, onClose }: AiSidebarProps) {
  // For mobile, render without the aside wrapper
  if (isMobile) {
    return (
      <div className="flex flex-col h-full">
        {/* Header */}
        <header className="flex-shrink-0 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="flex h-14 items-center gap-4 px-6">
            <h2 className="font-semibold">AI панель</h2>
          </div>
        </header>

        <ScrollArea className="flex-1 min-h-0">
          <AiSidebarContent />
        </ScrollArea>
      </div>
    );
  }

  // Desktop version - static, no drag
  return (
    <aside
      className={cn(
        "flex-shrink-0 border-l bg-background transition-all duration-300 h-screen overflow-hidden",
        isOpen ? "w-80" : "w-0 border-l-0"
      )}
      style={{ touchAction: 'none', userSelect: 'none' }}
    >
      {isOpen && (
        <div className="flex flex-col h-full w-80">
          {/* Header */}
          <header className="flex-shrink-0 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="flex h-14 items-center justify-between gap-4 px-6">
              <h2 className="font-semibold">AI центр</h2>
              {onClose && (
                <IconButton onClick={onClose}>
                  <PanelRightClose className="h-5 w-5" />
                </IconButton>
              )}
            </div>
          </header>

          <ScrollArea className="flex-1 min-h-0">
            <AiSidebarContent />
          </ScrollArea>
        </div>
      )}
    </aside>
  );
}