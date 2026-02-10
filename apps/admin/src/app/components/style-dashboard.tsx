import { useState, useEffect } from "react";
import {
  Palette,
  BookOpen,
  Wrench,
  Image as ImageIcon,
  Bot,
  Sliders,
  BookMarked,
  Play,
  BarChart3,
  Sparkles,
  FileCheck,
  Download,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  Copy,
  Send,
  Newspaper,
  Paintbrush,
  FileImage,
  User,
  Globe,
  Check,
  ChevronsUpDown,
  Info,
  LayoutDashboard,
  Pencil,
} from "lucide-react";
import { Button } from "@/app/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Badge } from "@/app/components/ui/badge";
import { Progress } from "@/app/components/ui/progress";
import { ScrollArea } from "@/app/components/ui/scroll-area";
import { Tabs, TabsList, TabsTrigger } from "@/app/components/ui/tabs";
import { Popover, PopoverContent, PopoverTrigger } from "@/app/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/app/components/ui/command";
import { Switch } from "@/app/components/ui/switch";
import { Label } from "@/app/components/ui/label";
import { useHeaderStore } from "@/app/store/header-store";
import { cn } from "@/app/components/ui/utils";

// Mock данные авторов
const authors = [
  { id: "current", name: "Александра Петрова", role: "Главный редактор", avatar: "АП" },
  { id: "author-1", name: "Иван Сидоров", role: "Технический писатель", avatar: "ИС" },
  { id: "author-2", name: "Мария Кузнецва", role: "Контент-менеджер", avatar: "МК" },
  { id: "author-3", name: "Дмитрий Новиков", role: "Аналитик", avatar: "ДН" },
];

export function StyleDashboard() {
  const [activeSubSection, setActiveSubSection] = useState<string | null>(null);
  const [styleMode, setStyleMode] = useState<"editorial" | "personal">("editorial");
  const [selectedAuthor, setSelectedAuthor] = useState("current");
  const [authorComboboxOpen, setAuthorComboboxOpen] = useState(false);
  const [useEditorialBase, setUseEditorialBase] = useState(true);
  
  const setBreadcrumbs = useHeaderStore((state) => state.setBreadcrumbs);
  const reset = useHeaderStore((state) => state.reset);

  // Устанавливаем breadcrumbs при монтировании компонента
  useEffect(() => {
    setBreadcrumbs([
      {
        label: "Дашборд",
        href: "dashboard",
        icon: LayoutDashboard,
      },
      {
        label: "Редакция",
        href: "editorial-hub",
        icon: Pencil,
      },
      {
        label: "Стиль",
        icon: Palette,
      },
    ]);

    // Сбрасываем при размонтировании
    return () => reset();
  }, [setBreadcrumbs, reset]);

  // Mock data for stats
  const styleStats = {
    completeness: styleMode === "editorial" ? 87 : 72,
    rulesCount: styleMode === "editorial" ? 24 : 18,
    termsCount: styleMode === "editorial" ? 47 : 31,
    imagePromptsCount: styleMode === "editorial" ? 12 : 8,
    lastUpdated: "5 минут назад",
  };

  const currentAuthor = authors.find(a => a.id === selectedAuthor) || authors[0];

  // Если выбран подраздел, показываем его (поа заглушка)
  if (activeSubSection) {
    return (
      <div className="flex-1 overflow-hidden">
        <ScrollArea className="h-full">
          <div className="max-w-5xl mx-auto p-6 space-y-6">
            <div>
              <Button
                variant="ghost"
                onClick={() => setActiveSubSection(null)}
                className="mb-4"
              >
                ← Назад к обзору стиля
              </Button>
              <h2 className="text-2xl font-semibold mb-2">{activeSubSection}</h2>
              <p className="text-muted-foreground">
                Детальная страница раздела будет реализована позже
              </p>
            </div>

            {/* Placeholder для будущего контента */}
            <Card>
              <CardHeader>
                <CardTitle>Раздел в разработке</CardTitle>
                <CardDescription>
                  Здесь будет полнофункциональный интерфейс для настройки
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-center py-12 text-muted-foreground">
                  <Sparkles className="h-12 w-12" />
                </div>
              </CardContent>
            </Card>
          </div>
        </ScrollArea>
      </div>
    );
  }

  // Главный Dashboard
  return (
    <div className="flex-1 overflow-hidden">
      <ScrollArea className="h-full">
        <div className="max-w-5xl mx-auto p-6 space-y-8 pb-12">
          {/* Header Section */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Palette className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h1 className="text-2xl font-semibold">Стиль издания</h1>
                <p className="text-sm text-muted-foreground">
                  Определите голос, правила написания и визуальный стиль вашего блога
                </p>
              </div>
            </div>

            {/* Style Mode Selector */}
            <Card className="mb-6">
              <CardContent className="p-4">
                <Tabs value={styleMode} onValueChange={(value) => setStyleMode(value as "editorial" | "personal")}>
                  <div className="flex flex-col gap-4">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                      <TabsList className="w-full sm:w-auto">
                        <TabsTrigger value="editorial" className="flex-1 sm:flex-initial gap-2">
                          <Globe className="h-4 w-4" />
                          <span className="hidden sm:inline">Общий стиль редакции</span>
                          <span className="sm:hidden">Редакция</span>
                        </TabsTrigger>
                        <TabsTrigger value="personal" className="flex-1 sm:flex-initial gap-2">
                          <User className="h-4 w-4" />
                          <span className="hidden sm:inline">Персональный стиль автора</span>
                          <span className="sm:hidden">Автор</span>
                        </TabsTrigger>
                      </TabsList>

                      {styleMode === "personal" && (
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-muted-foreground hidden md:inline">Автор:</span>
                          <Popover open={authorComboboxOpen} onOpenChange={setAuthorComboboxOpen}>
                            <PopoverTrigger asChild>
                              <Button
                                variant="outline"
                                role="combobox"
                                aria-expanded={authorComboboxOpen}
                                className="w-full sm:w-[240px] justify-between"
                              >
                                <div className="flex items-center gap-2 min-w-0">
                                  <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-xs font-medium flex-shrink-0">
                                    {currentAuthor.avatar}
                                  </div>
                                  <span className="truncate">{currentAuthor.name}</span>
                                </div>
                                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-[280px] p-0" align="end">
                              <Command>
                                <CommandInput placeholder="Поиск автора..." />
                                <CommandList>
                                  <CommandEmpty>Автор не найден</CommandEmpty>
                                  <CommandGroup>
                                    {authors.map((author) => (
                                      <CommandItem
                                        key={author.id}
                                        value={author.name}
                                        onSelect={() => {
                                          setSelectedAuthor(author.id);
                                          setAuthorComboboxOpen(false);
                                        }}
                                      >
                                        <Check
                                          className={cn(
                                            "mr-2 h-4 w-4",
                                            selectedAuthor === author.id ? "opacity-100" : "opacity-0"
                                          )}
                                        />
                                        <div className="flex items-center gap-2 min-w-0 flex-1">
                                          <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-xs font-medium flex-shrink-0">
                                            {author.avatar}
                                          </div>
                                          <div className="flex flex-col min-w-0 flex-1">
                                            <span className="text-sm truncate">{author.name}</span>
                                            <span className="text-xs text-muted-foreground truncate">{author.role}</span>
                                          </div>
                                        </div>
                                      </CommandItem>
                                    ))}
                                  </CommandGroup>
                                </CommandList>
                              </Command>
                            </PopoverContent>
                          </Popover>
                        </div>
                      )}
                    </div>

                    {styleMode === "personal" && (
                      <div className="pt-4 border-t space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Switch
                              id="use-editorial-base"
                              checked={useEditorialBase}
                              onCheckedChange={setUseEditorialBase}
                            />
                            <Label htmlFor="use-editorial-base" className="cursor-pointer">
                              Использовать общий стиль редакции как основу
                            </Label>
                          </div>
                        </div>
                        
                        <div className="flex items-start gap-2 text-sm">
                          <Info className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                          <p className="text-muted-foreground">
                            {useEditorialBase 
                              ? "Персональные настройки автора дополняют общий стиль редакции. Если параметр не настроен, используется значение из общего стиля."
                              : "Создается полностью независимый стиль автора. Настройки общего стиля редакции не применяются."}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </Tabs>
              </CardContent>
            </Card>
          </div>

          {/* Status Overview Card */}
          <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-primary" />
                {styleMode === "editorial" ? "Статус стиля блога" : `Стиль: ${currentAuthor.name}`}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div>
                  <div className="text-sm text-muted-foreground mb-2">Заполненность</div>
                  <div className="flex items-end gap-2">
                    <div className="text-3xl font-bold">{styleStats.completeness}%</div>
                    <TrendingUp className="h-5 w-5 text-green-500 mb-1" />
                  </div>
                  <Progress value={styleStats.completeness} className="mt-2" />
                </div>
                <div>
                  <div className="text-sm text-muted-foreground mb-2">Правила написания</div>
                  <div className="text-3xl font-bold">{styleStats.rulesCount}</div>
                  <div className="text-xs text-muted-foreground mt-1">в 6 категориях</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground mb-2">Термины в словаре</div>
                  <div className="text-3xl font-bold">{styleStats.termsCount}</div>
                  <div className="text-xs text-muted-foreground mt-1">+ глоссарий</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground mb-2">Помпты изображений</div>
                  <div className="text-3xl font-bold">{styleStats.imagePromptsCount}</div>
                  <div className="text-xs text-muted-foreground mt-1">MJ, DALL-E, SD</div>
                </div>
              </div>
              <div className="mt-6 pt-4 border-t flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                  <span className="text-muted-foreground">
                    Голос настроен • Последнее обновление: {styleStats.lastUpdated}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Main Sections */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Palette className="h-4 w-4 text-muted-foreground" />
              <h3 className="text-sm font-medium text-muted-foreground">Основные настройки</h3>
            </div>
            <div className="space-y-3">
              <Card
                className="cursor-pointer transition-all hover:border-primary/50 hover:shadow-md group"
                onClick={() => setActiveSubSection("Голос и тон")}
              >
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center flex-shrink-0 group-hover:bg-muted/80 transition-colors">
                      <Sliders className="h-6 w-6 text-muted-foreground" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold">Голос и тон</h4>
                        <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">
                        Определите характер вашего блога чрез настройки голоса
                      </p>
                      <div className="flex flex-wrap gap-2 text-xs">
                        <Badge variant="secondary">Формальность: 8/10</Badge>
                        <Badge variant="secondary">Энергичность: 7/10</Badge>
                        <Badge variant="secondary">Экспертность: 9/10</Badge>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card
                className="cursor-pointer transition-all hover:border-primary/50 hover:shadow-md group"
                onClick={() => setActiveSubSection("Правила написания")}
              >
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center flex-shrink-0 group-hover:bg-muted/80 transition-colors">
                      <FileCheck className="h-6 w-6 text-muted-foreground" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold">Правила написания</h4>
                        <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">
                        Грамматика, форматирование, стилистика и стандарты качеств
                      </p>
                      <div className="flex items-center gap-4 text-sm">
                        <div className="flex items-center gap-1.5">
                          <div className="w-2 h-2 rounded-full bg-green-500"></div>
                          <span className="text-muted-foreground">{styleStats.rulesCount} правила</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                          <span className="text-muted-foreground">6 категорий</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card
                className="cursor-pointer transition-all hover:border-primary/50 hover:shadow-md group"
                onClick={() => setActiveSubSection("Терминология и словарь")}
              >
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center flex-shrink-0 group-hover:bg-muted/80 transition-colors">
                      <BookMarked className="h-6 w-6 text-muted-foreground" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold">Терминология и словарь</h4>
                        <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">
                        Предпочитаемые термины, глоссарий и единый язык издания
                      </p>
                      <div className="flex items-center gap-4 text-sm">
                        <div className="flex items-center gap-1.5">
                          <CheckCircle2 className="h-4 w-4 text-green-500" />
                          <span className="text-muted-foreground">{styleStats.termsCount} терминов</span>
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Обновлено: 2 дня назад
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Tools Section */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Wrench className="h-4 w-4 text-muted-foreground" />
              <h3 className="text-sm font-medium text-muted-foreground">Инструменты</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card
                className="cursor-pointer transition-all hover:border-primary/50 hover:shadow-md group"
                onClick={() => setActiveSubSection("Playground")}
              >
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mx-auto mb-3 group-hover:bg-primary/20 transition-colors">
                    <Play className="h-6 w-6 text-primary" />
                  </div>
                  <h4 className="font-semibold mb-2">Playground</h4>
                  <p className="text-sm text-muted-foreground">
                    Проверьте текст на соответствие стилю
                  </p>
                </CardContent>
              </Card>

              <Card
                className="cursor-pointer transition-all hover:border-primary/50 hover:shadow-md group"
                onClick={() => setActiveSubSection("Библиотека примеров")}
              >
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mx-auto mb-3 group-hover:bg-primary/20 transition-colors">
                    <BookOpen className="h-6 w-6 text-primary" />
                  </div>
                  <h4 className="font-semibold mb-2">Примеры</h4>
                  <p className="text-sm text-muted-foreground">
                    Лучшие образцы текстов и форматов
                  </p>
                </CardContent>
              </Card>

              <Card
                className="cursor-pointer transition-all hover:border-primary/50 hover:shadow-md group"
                onClick={() => setActiveSubSection("Аналитика стиля")}
              >
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mx-auto mb-3 group-hover:bg-primary/20 transition-colors">
                    <BarChart3 className="h-6 w-6 text-primary" />
                  </div>
                  <h4 className="font-semibold mb-2">Аналитика</h4>
                  <p className="text-sm text-muted-foreground">
                    Метрики соответствия стилю
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Visual Content Section */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <ImageIcon className="h-4 w-4 text-muted-foreground" />
              <h3 className="text-sm font-medium text-muted-foreground">Визуальный контент</h3>
            </div>
            <Card
              className="cursor-pointer transition-all hover:border-primary/50 hover:shadow-md group"
              onClick={() => setActiveSubSection("Промпты для изображени")}
            >
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center flex-shrink-0 group-hover:bg-muted/80 transition-colors">
                    <ImageIcon className="h-6 w-6 text-muted-foreground" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold">Промпты для изображений</h4>
                      <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">
                      Готовые промпты для генерации обложек, миниатюр, схем и иллюстраций
                    </p>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="outline" className="text-xs flex items-center gap-1">
                        <Newspaper className="h-3 w-3" />
                        Обложки
                      </Badge>
                      <Badge variant="outline" className="text-xs flex items-center gap-1">
                        <FileImage className="h-3 w-3" />
                        Миниатюры
                      </Badge>
                      <Badge variant="outline" className="text-xs flex items-center gap-1">
                        <BarChart3 className="h-3 w-3" />
                        Схемы
                      </Badge>
                      <Badge variant="outline" className="text-xs flex items-center gap-1">
                        <Paintbrush className="h-3 w-3" />
                        Иллюстрации
                      </Badge>
                    </div>
                    <div className="flex items-center gap-3 mt-3 text-xs text-muted-foreground">
                      <span>MidJourney</span>
                      <span>•</span>
                      <span>DALL-E 3</span>
                      <span>•</span>
                      <span>Stable Diffusion</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* AI Agent Section */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Bot className="h-4 w-4 text-muted-foreground" />
              <h3 className="text-sm font-medium text-muted-foreground">Для ИИ-агента</h3>
            </div>
            <Card className="border-dashed">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center flex-shrink-0">
                    <Bot className="h-6 w-6 text-muted-foreground" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold">Системный промпт</h4>
                      <Badge variant="outline" className="text-xs">
                        Обновлён: {styleStats.lastUpdated}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-4">
                      Автоматически сгенерированные инструкции на основе всех настроек стиля
                    </p>
                    <div className="bg-muted/50 rounded-lg p-4 mb-4 font-mono text-xs">
                      <div className="text-muted-foreground">
                        Ты редактор блога о современных технолгиях.<br />
                        TONE: Формальность 8/10, Энергичность 7/10...<br />
                        ПРАВИЛА: Используй активный залог, избегай "юзер"...<br />
                        <span className="text-primary">... ещё {styleStats.rulesCount} правил</span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" className="gap-2">
                        <Copy className="h-4 w-4" />
                        Копировать
                      </Button>
                      <Button variant="outline" size="sm" className="gap-2">
                        <Send className="h-4 w-4" />
                        Отправить в AI Center
                      </Button>
                      <Button variant="outline" size="sm" className="gap-2">
                        <Download className="h-4 w-4" />
                        Экспорт
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Tips */}
          <Card className="border-primary/20 bg-primary/5">
            <CardContent className="p-6">
              <div className="flex gap-3">
                <Sparkles className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-medium mb-2">Совет</h4>
                  <p className="text-sm text-muted-foreground">
                    Настройки стиля автоматически применяются во всех инструментах работы с текстом. 
                    AI Center использует эти правила для генерации контента, а редактор статей — для проверки текстов.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </ScrollArea>
    </div>
  );
}