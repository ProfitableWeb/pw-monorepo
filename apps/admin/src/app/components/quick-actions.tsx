import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import { PenSquare, Upload, FileText, Settings } from "lucide-react";

export function QuickActions() {
  const actions = [
    {
      title: "Написать пост",
      description: "Создать новую публикацию",
      icon: <PenSquare className="h-5 w-5" />,
    },
    {
      title: "Загрузить медиа",
      description: "Добавить изображения",
      icon: <Upload className="h-5 w-5" />,
    },
    {
      title: "Черновики",
      description: "5 неопубликованных",
      icon: <FileText className="h-5 w-5" />,
    },
    {
      title: "Настройки",
      description: "Управление блогом",
      icon: <Settings className="h-5 w-5" />,
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Быстрые действия</CardTitle>
        <CardDescription>Часто используемые функции</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          {actions.map((action) => (
            <Button
              key={action.title}
              variant="outline"
              className="h-auto flex-col items-start gap-2 p-4"
            >
              <div className="flex items-center gap-2 w-full">
                {action.icon}
                <span className="font-medium">{action.title}</span>
              </div>
              <span className="text-xs text-muted-foreground text-left w-full">
                {action.description}
              </span>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
