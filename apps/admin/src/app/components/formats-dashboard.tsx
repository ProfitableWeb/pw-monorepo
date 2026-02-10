import { useEffect } from 'react';
import { Card, CardContent } from '@/app/components/ui/card';
import { useHeaderStore } from '@/app/store/header-store';
import { Layout, FileText, Newspaper, Video, Mic, Pencil, LayoutDashboard, Plus, FileType } from 'lucide-react';
import { SectionCard } from '@/app/components/section-card';
import { SectionHeader } from '@/app/components/section-header';
import { ScrollArea } from '@/app/components/ui/scroll-area';
import { Button } from '@/app/components/ui/button';

export function FormatsDashboard() {
  const { setBreadcrumbs, reset } = useHeaderStore();

  useEffect(() => {
    setBreadcrumbs([
      { label: 'Дашборд', href: 'dashboard', icon: LayoutDashboard },
      { label: 'Редакция', href: 'editorial-hub', icon: Pencil },
      { label: 'Форматы', icon: FileType },
    ]);

    return () => reset();
  }, [setBreadcrumbs, reset]);

  const formats = [
    {
      icon: FileText,
      title: 'Статья',
      description: 'Классический текстовый материал с глубоким анализом',
      count: 3,
      examples: ['Обзор', 'Туториал', 'Исследование'],
    },
    {
      icon: Newspaper,
      title: 'Новость',
      description: 'Короткий информационный материал с фактами',
      count: 2,
      examples: ['Анонс', 'Релиз'],
    },
    {
      icon: Video,
      title: 'Видеообзор',
      description: 'Материал с встроенным видеоконтентом',
      count: 1,
      examples: ['Демо'],
    },
    {
      icon: Mic,
      title: 'Подкаст',
      description: 'Аудиоформат с транскрипцией',
      count: 2,
      examples: ['Интервью', 'Обсуждение'],
    },
  ];

  return (
    <div className="flex-1 overflow-hidden">
      <ScrollArea className="h-full">
        <div className="max-w-5xl mx-auto p-6 space-y-8 pb-12">
          {/* Header */}
          <SectionHeader
            icon={Layout}
            title="Форматы контента"
            description="Шаблоны и структуры для различных типов материалов"
          />

          {/* Main Formats Section */}
          <div>
            <SectionHeader
              variant="small"
              icon={FileType}
              title="Доступные форматы"
              className="mb-4"
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {formats.map((format) => (
                <SectionCard
                  key={format.title}
                  icon={format.icon}
                  title={format.title}
                  description={format.description}
                  variant="default"
                  onClick={() => console.log(`Открыть формат: ${format.title}`)}
                  stats={[
                    {
                      label: format.count === 1 ? 'шаблон' : 'шаблона',
                      value: format.count,
                    },
                  ]}
                  badges={format.examples.map((example) => ({
                    label: example,
                    variant: 'outline' as const,
                  }))}
                />
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <Card className="border-primary/20 bg-primary/5">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Plus className="h-6 w-6 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold mb-2">Создать новый формат</h4>
                  <p className="text-sm text-muted-foreground mb-4">
                    Добавьте кастомный формат для вашего уникального типа контента
                  </p>
                  <Button variant="outline" size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Добавить формат
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Templates Section */}
          <div>
            <SectionHeader
              variant="small"
              icon={Layout}
              title="Шаблоны структур"
              className="mb-4"
            />
            <Card className="border-dashed">
              <CardContent className="flex items-center justify-center py-12">
                <div className="text-center space-y-2">
                  <Layout className="size-12 mx-auto text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">
                    Детальные шаблоны для каждого формата будут доступны в следующей версии
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}
