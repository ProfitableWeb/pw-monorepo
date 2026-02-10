import { useHeaderStore } from "@/app/store/header-store";
import { useEffect, useState } from "react";
import { 
  LayoutDashboard, 
  Settings, 
  Users, 
  TrendingUp, 
  BarChart3, 
  LayoutPanelTop, 
  SearchCheck, 
  Cog,
  Globe,
  FileText,
  Link,
  Code,
  Activity,
  Zap,
  Search,
  ChevronRight,
  Save,
  X,
  ExternalLink,
  CheckCircle,
  AlertCircle,
  TrendingDown,
  Eye,
  Target,
  Sparkles,
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/app/components/ui/card";
import { ScrollArea } from "@/app/components/ui/scroll-area";
import { Input } from "@/app/components/ui/input";
import { Button } from "@/app/components/ui/button";
import { Label } from "@/app/components/ui/label";
import { Textarea } from "@/app/components/ui/textarea";
import { Switch } from "@/app/components/ui/switch";
import { Badge } from "@/app/components/ui/badge";
import { cn } from "@/app/components/ui/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/components/ui/select";

interface SEOCategory {
  id: string;
  label: string;
  icon: any;
}

const seoCategories: SEOCategory[] = [
  {
    id: 'general',
    label: 'Общие настройки',
    icon: Globe,
  },
  {
    id: 'meta',
    label: 'Мета-теги',
    icon: FileText,
  },
  {
    id: 'sitemap',
    label: 'Sitemap & Robots',
    icon: Link,
  },
  {
    id: 'schema',
    label: 'Структурированные данные',
    icon: Code,
  },
  {
    id: 'monitoring',
    label: 'Мониторинг',
    icon: Activity,
  },
  {
    id: 'performance',
    label: 'Производительность',
    icon: Zap,
  },
  {
    id: 'urls',
    label: 'URL и редиректы',
    icon: Link,
  },
  {
    id: 'content',
    label: 'Контент-анализ',
    icon: Target,
  },
];

export function SEOPage() {
  const { setBreadcrumbs, reset } = useHeaderStore();
  const [activeCategory, setActiveCategory] = useState('general');
  const [searchQuery, setSearchQuery] = useState('');
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // Обновляем breadcrumbs при изменении активной категории
  useEffect(() => {
    const currentCategory = seoCategories.find(cat => cat.id === activeCategory);
    
    setBreadcrumbs([
      { label: 'Дашборд', href: 'dashboard', icon: LayoutDashboard },
      { 
        label: 'Система', 
        icon: Cog,
        dropdown: [
          { label: 'Настройки', icon: Settings, href: 'settings' },
          { label: 'Пользователи', icon: Users, href: 'users' },
          { label: 'Продвижение', icon: TrendingUp, href: 'promotion' },
          { label: 'Аналитика', icon: BarChart3, href: 'analytics' },
          { label: 'Реклама', icon: LayoutPanelTop, href: 'ads' },
          { label: 'SEO', icon: SearchCheck, href: 'seo' },
        ]
      },
      { label: 'SEO', icon: SearchCheck },
      ...(currentCategory ? [{ label: currentCategory.label, icon: currentCategory.icon }] : [])
    ]);

    return () => reset();
  }, [setBreadcrumbs, reset, activeCategory]);

  const renderCategoryContent = () => {
    switch (activeCategory) {
      case 'general':
        return <GeneralSEOSettings onChangeDetected={() => setHasUnsavedChanges(true)} />;
      case 'meta':
        return <MetaTagsSettings onChangeDetected={() => setHasUnsavedChanges(true)} />;
      case 'sitemap':
        return <SitemapSettings onChangeDetected={() => setHasUnsavedChanges(true)} />;
      case 'schema':
        return <SchemaSettings onChangeDetected={() => setHasUnsavedChanges(true)} />;
      case 'monitoring':
        return <MonitoringSettings onChangeDetected={() => setHasUnsavedChanges(true)} />;
      case 'performance':
        return <PerformanceSettings onChangeDetected={() => setHasUnsavedChanges(true)} />;
      case 'urls':
        return <URLSettings onChangeDetected={() => setHasUnsavedChanges(true)} />;
      case 'content':
        return <ContentAnalysisSettings onChangeDetected={() => setHasUnsavedChanges(true)} />;
      default:
        return null;
    }
  };

  const handleSave = () => {
    setHasUnsavedChanges(false);
  };

  const handleCancel = () => {
    setHasUnsavedChanges(false);
  };

  return (
    <div className="flex h-full overflow-hidden">
      {/* Sidebar Navigation */}
      <aside className="w-64 border-r bg-card flex-shrink-0 flex flex-col">
        <div className="p-4 border-b flex-shrink-0">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <Input
              placeholder="Поиск настроек..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>

        <ScrollArea className="flex-1 min-h-0">
          <nav className="p-2">
            {seoCategories.map((category) => {
              const Icon = category.icon;
              const isActive = activeCategory === category.id;
              
              return (
                <button
                  key={category.id}
                  onClick={() => setActiveCategory(category.id)}
                  className={cn(
                    "w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors mb-1",
                    isActive
                      ? "bg-accent text-accent-foreground font-medium"
                      : "text-muted-foreground hover:bg-accent/50 hover:text-accent-foreground"
                  )}
                >
                  <Icon className="size-4 flex-shrink-0" />
                  <span className="flex-1 text-left">{category.label}</span>
                  <ChevronRight className={cn(
                    "size-4 transition-transform flex-shrink-0",
                    isActive && "rotate-90"
                  )} />
                </button>
              );
            })}
          </nav>
        </ScrollArea>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 min-h-0">
        <ScrollArea className="flex-1 min-h-0">
          <div className="max-w-4xl mx-auto p-6 pb-24">
            {renderCategoryContent()}
          </div>
        </ScrollArea>

        {/* Fixed Action Bar */}
        {hasUnsavedChanges && (
          <div className="border-t bg-card p-4 flex items-center justify-between flex-shrink-0">
            <p className="text-sm text-muted-foreground">
              У вас есть несохраненные изменения
            </p>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={handleCancel}>
                <X className="size-4 mr-2" />
                Отменить
              </Button>
              <Button size="sm" onClick={handleSave}>
                <Save className="size-4 mr-2" />
                Сохранить изменения
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Компоненты для каждой категории
function GeneralSEOSettings({ onChangeDetected }: { onChangeDetected: () => void }) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold mb-2">Общие настройки SEO</h2>
        <p className="text-muted-foreground">
          Базовые параметры для поисковой оптимизации сайта
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Основная информация</CardTitle>
          <CardDescription>
            Эти данные используются по умолчанию для всех страниц сайта
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="site-title">Заголовок сайта</Label>
            <Input 
              id="site-title" 
              defaultValue="Мой технический блог" 
              onChange={onChangeDetected}
            />
            <p className="text-xs text-muted-foreground">
              Отображается в результатах поиска и в табе браузера (50-60 символов)
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="site-description">Описание сайта</Label>
            <Textarea 
              id="site-description" 
              defaultValue="Блог о веб-разработке, React, TypeScript и современных технологиях"
              onChange={onChangeDetected}
              rows={3}
            />
            <p className="text-xs text-muted-foreground">
              Meta description для главной страницы (150-160 символов)
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="keywords">Ключевые слова</Label>
            <Input 
              id="keywords" 
              defaultValue="react, typescript, веб-разработка, javascript"
              onChange={onChangeDetected}
            />
            <p className="text-xs text-muted-foreground">
              Через запятую (опционально, современные поисковики не используют этот тег активно)
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Open Graph</CardTitle>
          <CardDescription>
            Настройки для социальных сетей (Facebook, LinkedIn, и др.)
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="og-title">OG заголовок</Label>
            <Input 
              id="og-title" 
              placeholder="Мой технический блог"
              onChange={onChangeDetected}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="og-description">OG описание</Label>
            <Textarea 
              id="og-description" 
              placeholder="Статьи о веб-разработке и современных технологиях"
              onChange={onChangeDetected}
              rows={2}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="og-image">OG изображение (URL)</Label>
            <Input 
              id="og-image" 
              placeholder="https://example.com/og-image.jpg"
              onChange={onChangeDetected}
            />
            <p className="text-xs text-muted-foreground">
              Рекомендуется 1200x630px
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Twitter Cards</CardTitle>
          <CardDescription>
            Настройки для отображения в Twitter/X
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="twitter-handle">Twitter username</Label>
            <Input 
              id="twitter-handle" 
              placeholder="@myblog"
              onChange={onChangeDetected}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="twitter-card">Тип карточки</Label>
            <Select defaultValue="summary_large_image">
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="summary">Summary</SelectItem>
                <SelectItem value="summary_large_image">Summary Large Image</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function MetaTagsSettings({ onChangeDetected }: { onChangeDetected: () => void }) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold mb-2">Мета-теги статей</h2>
        <p className="text-muted-foreground">
          Шаблоны и автоматическая генерация мета-тегов для статей
        </p>
      </div>

      <Card className="border-blue-500/20 bg-blue-500/5">
        <CardHeader>
          <div className="flex items-start gap-3">
            <Sparkles className="size-5 text-blue-500 mt-0.5 flex-shrink-0" />
            <div>
              <CardTitle className="text-base">Современный подход к SEO (2024-2026)</CardTitle>
              <CardDescription className="mt-2">
                AI-поисковики (Google Gemini, ChatGPT Search, Perplexity) фокусируются на <strong>смысле и качестве контента</strong>, 
                а не на формульных шаблонах. Рекомендации:
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="space-y-1.5 text-sm">
            <p className="flex items-start gap-2">
              <span className="text-blue-500 mt-0.5">•</span>
              <span><strong>Приоритет смыслу:</strong> Каждый символ title должен работать на привлечение клика и понимание темы</span>
            </p>
            <p className="flex items-start gap-2">
              <span className="text-blue-500 mt-0.5">•</span>
              <span><strong>Брендинг опционален:</strong> Постфикс "| Название сайта" забирает 10-20 символов. Полезен для известных брендов, но не критичен для контента</span>
            </p>
            <p className="flex items-start gap-2">
              <span className="text-blue-500 mt-0.5">•</span>
              <span><strong>Естественный язык:</strong> Пишите для людей, не для роботов. AI понимает контекст и намерения</span>
            </p>
            <p className="flex items-start gap-2">
              <span className="text-blue-500 mt-0.5">•</span>
              <span><strong>Уникальность:</strong> Каждая страница должна иметь уникальный, описательный заголовок</span>
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Стратегия заголовков</CardTitle>
          <CardDescription>
            Выберите подход к формированию title тегов
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title-strategy">Подход к title</Label>
            <Select defaultValue="content-first">
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="content-first">
                  <div className="flex flex-col items-start">
                    <span className="font-medium">Контент-ориентированный (рекомендуется)</span>
                    <span className="text-xs text-muted-foreground">Пример: "Полное руководство по React Hooks 2024"</span>
                  </div>
                </SelectItem>
                <SelectItem value="branded">
                  <div className="flex flex-col items-start">
                    <span className="font-medium">С брендингом</span>
                    <span className="text-xs text-muted-foreground">Пример: "Руководство по React Hooks | Мой Блог"</span>
                  </div>
                </SelectItem>
                <SelectItem value="category-branded">
                  <div className="flex flex-col items-start">
                    <span className="font-medium">Категория + бренд</span>
                    <span className="text-xs text-muted-foreground">Пример: "React: Полное руководство по Hooks | Блог"</span>
                  </div>
                </SelectItem>
                <SelectItem value="custom">
                  <div className="flex flex-col items-start">
                    <span className="font-medium">Свой шаблон</span>
                    <span className="text-xs text-muted-foreground">Настроить вручную</span>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="title-template">Шаблон для статей</Label>
            <Input 
              id="title-template" 
              defaultValue="{title}"
              onChange={onChangeDetected}
            />
            <p className="text-xs text-muted-foreground">
              Переменные: {'{title}'}, {'{category}'}, {'{author}'}, {'{site}'}. 
              <strong className="text-foreground"> Совет:</strong> Оставьте только {'{title}'} для максимальной релевантности
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="category-template">Шаблон для категорий</Label>
            <Input 
              id="category-template" 
              defaultValue="{category} - статьи и руководства"
              onChange={onChangeDetected}
            />
          </div>

          <div className="p-3 rounded-lg border bg-muted/30">
            <div className="flex items-start gap-2">
              <Eye className="size-4 text-muted-foreground mt-0.5 flex-shrink-0" />
              <div className="text-xs text-muted-foreground">
                <strong className="text-foreground">Зачем добавлять название сайта?</strong><br/>
                <span className="mt-1 block">✓ Брендинг: узнаваемость в результатах поиска</span>
                <span className="block">✓ Навигация: помогает в табах браузера</span>
                <span className="block">✗ Забирает ценные символы (лимит 50-60)</span>
                <span className="block">✗ Может снижать кликабельность (CTR)</span>
                <span className="mt-1 block"><strong>Вывод:</strong> Используйте брендинг для известных брендов или корпоративных блогов. 
                Для контентных проектов лучше фокусироваться на смысле заголовка.</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Автогенерация описаний</CardTitle>
          <CardDescription>
            Автоматическое создание meta description из контента
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Включить автогенерацию</Label>
              <p className="text-sm text-muted-foreground">
                Создавать описание из первых 150 символов статьи
              </p>
            </div>
            <Switch defaultChecked onChange={onChangeDetected} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description-length">Длина описания (символов)</Label>
            <Input 
              id="description-length" 
              type="number"
              defaultValue="155"
              onChange={onChangeDetected}
            />
            <p className="text-xs text-muted-foreground">
              Рекомендуется 120-155 символов. Google может переписать слишком короткие или длинные описания
            </p>
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Добавлять призыв к действию</Label>
              <p className="text-sm text-muted-foreground">
                "Читать далее", "Узнать больше" в конце описания
              </p>
            </div>
            <Switch onChange={onChangeDetected} />
          </div>

          <div className="p-3 rounded-lg border bg-muted/30">
            <p className="text-xs text-muted-foreground">
              <strong className="text-foreground">Важно:</strong> Meta description не влияет на ранжирование напрямую, 
              но улучшает CTR (кликабельность). Google часто переписывает описания, показывая наиболее релевантный фрагмент.
              Пишите информативно и убедительно для пользователя, а не для алгоритма.
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>AI-оптимизация мета-тегов</CardTitle>
          <CardDescription>
            Использовать AI для улучшения SEO-заголовков и описаний
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Включить AI-помощник</Label>
              <p className="text-sm text-muted-foreground">
                AI предложит варианты заголовков с фокусом на намерение пользователя (search intent)
              </p>
            </div>
            <Switch onChange={onChangeDetected} />
          </div>

          <div className="p-3 rounded-lg border bg-blue-500/5 border-blue-500/20">
            <div className="flex items-start gap-2">
              <Sparkles className="size-4 text-blue-500 mt-0.5 flex-shrink-0" />
              <div className="text-xs">
                <strong className="text-foreground">AI анализирует:</strong>
                <div className="mt-1 space-y-0.5 text-muted-foreground">
                  <p>• Поисковые запросы и намерения пользователей</p>
                  <p>• Эмоциональную привлекательность заголовка</p>
                  <p>• Конкурентов в поисковой выдаче</p>
                  <p>• Тренды и актуальность темы</p>
                </div>
              </div>
            </div>
          </div>

          <Button variant="outline" className="w-full" disabled>
            <Sparkles className="size-4 mr-2" />
            Настроить AI-модель
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

function SitemapSettings({ onChangeDetected }: { onChangeDetected: () => void }) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold mb-2">Sitemap и Robots.txt</h2>
        <p className="text-muted-foreground">
          Управление индексацией сайта поисковыми системами
        </p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Sitemap.xml</CardTitle>
              <CardDescription>
                Карта сайта для поисковых систем
              </CardDescription>
            </div>
            <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20">
              <CheckCircle className="size-3 mr-1" />
              Активна
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Автообновление</Label>
              <p className="text-sm text-muted-foreground">
                Обновлять sitemap при публикации контента
              </p>
            </div>
            <Switch defaultChecked onChange={onChangeDetected} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="sitemap-url">URL sitemap</Label>
            <div className="flex gap-2">
              <Input 
                id="sitemap-url" 
                defaultValue="https://myblog.com/sitemap.xml"
                readOnly
                className="flex-1"
              />
              <Button variant="outline" size="icon">
                <ExternalLink className="size-4" />
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Включить в sitemap</Label>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm">Статьи</span>
                <Switch defaultChecked onChange={onChangeDetected} />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Категории</span>
                <Switch defaultChecked onChange={onChangeDetected} />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Метки</span>
                <Switch onChange={onChangeDetected} />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Страницы</span>
                <Switch defaultChecked onChange={onChangeDetected} />
              </div>
            </div>
          </div>

          <Button variant="outline" className="w-full">
            Сгенерировать sitemap сейчас
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Robots.txt</CardTitle>
          <CardDescription>
            Правила для поисковых роботов
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="robots-content">Содержимое robots.txt</Label>
            <Textarea 
              id="robots-content"
              rows={8}
              defaultValue={`User-agent: *\nAllow: /\nDisallow: /admin/\nDisallow: /api/\n\nSitemap: https://myblog.com/sitemap.xml`}
              onChange={onChangeDetected}
              className="font-mono text-sm"
            />
          </div>

          <div className="flex gap-2">
            <Button variant="outline" className="flex-1">
              Восстановить по умолчанию
            </Button>
            <Button variant="outline" className="flex-1">
              <ExternalLink className="size-4 mr-2" />
              Просмотр
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Приоритеты и частота</CardTitle>
          <CardDescription>
            Настройки обхода для разных типов страниц
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Главная страница</p>
                <p className="text-xs text-muted-foreground">Приоритет: 1.0, Частота: daily</p>
              </div>
              <Button variant="ghost" size="sm">Изменить</Button>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Статьи</p>
                <p className="text-xs text-muted-foreground">Приоритет: 0.8, Частота: weekly</p>
              </div>
              <Button variant="ghost" size="sm">Изменить</Button>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Категории</p>
                <p className="text-xs text-muted-foreground">Приоритет: 0.6, Частота: weekly</p>
              </div>
              <Button variant="ghost" size="sm">Изменить</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function SchemaSettings({ onChangeDetected }: { onChangeDetected: () => void }) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold mb-2">Структурированные данные</h2>
        <p className="text-muted-foreground">
          Schema.org разметка для расширенных сниппетов в поиске
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Article Schema</CardTitle>
          <CardDescription>
            Разметка статей по стандарту Schema.org
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Включить Article Schema</Label>
              <p className="text-sm text-muted-foreground">
                Автоматически добавлять структурированные данные к статьям
              </p>
            </div>
            <Switch defaultChecked onChange={onChangeDetected} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="article-type">Тип статьи</Label>
            <Select defaultValue="BlogPosting">
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Article">Article</SelectItem>
                <SelectItem value="BlogPosting">Blog Posting</SelectItem>
                <SelectItem value="NewsArticle">News Article</SelectItem>
                <SelectItem value="TechArticle">Tech Article</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Включать время прочтения</Label>
              <p className="text-sm text-muted-foreground">
                Добавлять estimated reading time в schema
              </p>
            </div>
            <Switch defaultChecked onChange={onChangeDetected} />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Organization Schema</CardTitle>
          <CardDescription>
            Информация об организации/авторе блога
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Включить Organization Schema</Label>
              <p className="text-sm text-muted-foreground">
                Для Knowledge Graph в Google
              </p>
            </div>
            <Switch defaultChecked onChange={onChangeDetected} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="org-name">Название организации</Label>
            <Input 
              id="org-name" 
              defaultValue="My Tech Blog"
              onChange={onChangeDetected}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="org-logo">URL логотипа</Label>
            <Input 
              id="org-logo" 
              placeholder="https://example.com/logo.png"
              onChange={onChangeDetected}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="org-social">Социальные сети</Label>
            <Input 
              id="org-social" 
              placeholder="https://twitter.com/myblog, https://github.com/myblog"
              onChange={onChangeDetected}
            />
            <p className="text-xs text-muted-foreground">
              Через запятую
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Breadcrumb Schema</CardTitle>
          <CardDescription>
            Разметка хлебных крошек для поисковых результатов
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Включить Breadcrumb Schema</Label>
              <p className="text-sm text-muted-foreground">
                Отображать навигационную цепочку в поиске
              </p>
            </div>
            <Switch defaultChecked onChange={onChangeDetected} />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Person Schema</CardTitle>
          <CardDescription>
            Информация об авторах
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Добавлять данные авторов</Label>
              <p className="text-sm text-muted-foreground">
                Включать Person schema для каждого автора
              </p>
            </div>
            <Switch defaultChecked onChange={onChangeDetected} />
          </div>

          <Button variant="outline" className="w-full">
            Управление профилями авторов
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

function MonitoringSettings({ onChangeDetected }: { onChangeDetected: () => void }) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold mb-2">Мониторинг и аналитика</h2>
        <p className="text-muted-foreground">
          Отслеживание SEO-метрик и индексации
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Google Search Console</CardTitle>
          <CardDescription>
            Интеграция с инструментами вебмастера Google
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="gsc-verification">Код подтверждения GSC</Label>
            <Input 
              id="gsc-verification" 
              placeholder="google-site-verification=XXXXXXXXXX"
              onChange={onChangeDetected}
            />
            <p className="text-xs text-muted-foreground">
              Вставьте код верификации из Google Search Console
            </p>
          </div>

          <Button variant="outline" className="w-full">
            <ExternalLink className="size-4 mr-2" />
            Открыть Search Console
          </Button>

          <div className="grid grid-cols-3 gap-4 pt-4">
            <div className="text-center">
              <p className="text-2xl font-bold">156</p>
              <p className="text-xs text-muted-foreground">Страниц</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold">12.4K</p>
              <p className="text-xs text-muted-foreground">Кликов</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold">89K</p>
              <p className="text-xs text-muted-foreground">Показов</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Статус индексации</CardTitle>
          <CardDescription>
            Текущее состояние индексации страниц
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 rounded-lg border">
              <div className="flex items-center gap-3">
                <CheckCircle className="size-5 text-green-500" />
                <div>
                  <p className="text-sm font-medium">Проиндексировано</p>
                  <p className="text-xs text-muted-foreground">142 страницы</p>
                </div>
              </div>
              <Badge variant="outline" className="bg-green-500/10 text-green-500">91%</Badge>
            </div>

            <div className="flex items-center justify-between p-3 rounded-lg border">
              <div className="flex items-center gap-3">
                <AlertCircle className="size-5 text-yellow-500" />
                <div>
                  <p className="text-sm font-medium">В очереди</p>
                  <p className="text-xs text-muted-foreground">8 страниц</p>
                </div>
              </div>
              <Badge variant="outline" className="bg-yellow-500/10 text-yellow-500">5%</Badge>
            </div>

            <div className="flex items-center justify-between p-3 rounded-lg border">
              <div className="flex items-center gap-3">
                <TrendingDown className="size-5 text-red-500" />
                <div>
                  <p className="text-sm font-medium">Ошибки</p>
                  <p className="text-xs text-muted-foreground">6 страниц</p>
                </div>
              </div>
              <Badge variant="outline" className="bg-red-500/10 text-red-500">4%</Badge>
            </div>
          </div>

          <Button variant="outline" className="w-full">
            Запросить переиндексацию
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Отслеживание позиций</CardTitle>
          <CardDescription>
            Мониторинг рейтинга ключевых слов
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Включить мониторинг позиций</Label>
              <p className="text-sm text-muted-foreground">
                Отслеживать изменения в поисковой выдаче
              </p>
            </div>
            <Switch defaultChecked onChange={onChangeDetected} />
          </div>

          <div className="space-y-2">
            <Label>Топ ключевых слов</Label>
            <div className="space-y-2">
              <div className="flex items-center justify-between p-2 rounded border">
                <span className="text-sm">react хуки</span>
                <div className="flex items-center gap-2">
                  <Badge variant="outline">Позиция 3</Badge>
                  <span className="text-xs text-green-500">↑ 2</span>
                </div>
              </div>
              <div className="flex items-center justify-between p-2 rounded border">
                <span className="text-sm">typescript гайд</span>
                <div className="flex items-center gap-2">
                  <Badge variant="outline">Позиция 7</Badge>
                  <span className="text-xs text-green-500">↑ 1</span>
                </div>
              </div>
              <div className="flex items-center justify-between p-2 rounded border">
                <span className="text-sm">веб-разработка</span>
                <div className="flex items-center gap-2">
                  <Badge variant="outline">Позиция 12</Badge>
                  <span className="text-xs text-red-500">↓ 3</span>
                </div>
              </div>
            </div>
          </div>

          <Button variant="outline" className="w-full">
            Добавить ключевые слова
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

function PerformanceSettings({ onChangeDetected }: { onChangeDetected: () => void }) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold mb-2">Производительность</h2>
        <p className="text-muted-foreground">
          Оптимизация скорости загрузки и Core Web Vitals
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Core Web Vitals</CardTitle>
          <CardDescription>
            Ключевые метрики производительности Google
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center p-4 rounded-lg border">
              <p className="text-xs text-muted-foreground mb-2">LCP</p>
              <p className="text-2xl font-bold text-green-500">1.8s</p>
              <p className="text-xs text-muted-foreground mt-1">Хорошо</p>
            </div>
            <div className="text-center p-4 rounded-lg border">
              <p className="text-xs text-muted-foreground mb-2">FID</p>
              <p className="text-2xl font-bold text-green-500">45ms</p>
              <p className="text-xs text-muted-foreground mt-1">Хорошо</p>
            </div>
            <div className="text-center p-4 rounded-lg border">
              <p className="text-xs text-muted-foreground mb-2">CLS</p>
              <p className="text-2xl font-bold text-yellow-500">0.12</p>
              <p className="text-xs text-muted-foreground mt-1">Средне</p>
            </div>
          </div>

          <Button variant="outline" className="w-full">
            <ExternalLink className="size-4 mr-2" />
            PageSpeed Insights
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Оптимизация изображений</CardTitle>
          <CardDescription>
            Автоматическое сжатие и оптимизация медиафайлов
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Автосжатие изображений</Label>
              <p className="text-sm text-muted-foreground">
                Сжимать изображения при загрузке
              </p>
            </div>
            <Switch defaultChecked onChange={onChangeDetected} />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Конвертация в WebP</Label>
              <p className="text-sm text-muted-foreground">
                Преобразовывать изображения в формат WebP
              </p>
            </div>
            <Switch defaultChecked onChange={onChangeDetected} />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Lazy loading</Label>
              <p className="text-sm text-muted-foreground">
                Отложенная загрузка изображений
              </p>
            </div>
            <Switch defaultChecked onChange={onChangeDetected} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="image-quality">Качество сжатия</Label>
            <Input 
              id="image-quality" 
              type="number"
              min="1"
              max="100"
              defaultValue="85"
              onChange={onChangeDetected}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Кэширование</CardTitle>
          <CardDescription>
            Настройки кэширования для ускорения загрузки
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Браузерное кэширование</Label>
              <p className="text-sm text-muted-foreground">
                Cache-Control заголовки
              </p>
            </div>
            <Switch defaultChecked onChange={onChangeDetected} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="cache-duration">Время кэш��рования (дни)</Label>
            <Input 
              id="cache-duration" 
              type="number"
              defaultValue="30"
              onChange={onChangeDetected}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Мобильная оптимизация</CardTitle>
          <CardDescription>
            Настройки для мобильных устройств
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Адаптивные изображения</Label>
              <p className="text-sm text-muted-foreground">
                Разные размеры для разных устройств
              </p>
            </div>
            <Switch defaultChecked onChange={onChangeDetected} />
          </div>

          <div className="flex items-center justify-between p-3 rounded-lg border">
            <div>
              <p className="text-sm font-medium">Mobile-Friendly тест</p>
              <p className="text-xs text-muted-foreground">Последняя проверка: 2 дня назад</p>
            </div>
            <Badge variant="outline" className="bg-green-500/10 text-green-500">
              <CheckCircle className="size-3 mr-1" />
              Passed
            </Badge>
          </div>

          <Button variant="outline" className="w-full">
            Запустить тест
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

function URLSettings({ onChangeDetected }: { onChangeDetected: () => void }) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold mb-2">URL и редиректы</h2>
        <p className="text-muted-foreground">
          Настройка структуры URL и управление редиректами
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Структура URL</CardTitle>
          <CardDescription>
            Формат человекопонятных URL (ЧПУ)
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="post-url-structure">Формат URL статей</Label>
            <Select defaultValue="date-slug">
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="slug">/{'{slug}'}</SelectItem>
                <SelectItem value="category-slug">/{'{category}'}/{'{slug}'}</SelectItem>
                <SelectItem value="date-slug">/{'{year}'}/{'{month}'}/{'{slug}'}</SelectItem>
                <SelectItem value="id-slug">/{'{id}'}-{'{slug}'}</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
              Пример: /2026/02/my-awesome-post
            </p>
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Автогенерация slug</Label>
              <p className="text-sm text-muted-foreground">
                Создавать URL из заголовка статьи
              </p>
            </div>
            <Switch defaultChecked onChange={onChangeDetected} />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Удалять стоп-слова</Label>
              <p className="text-sm text-muted-foreground">
                Убирать "и", "в", "на" и т.д. из URL
              </p>
            </div>
            <Switch defaultChecked onChange={onChangeDetected} />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Транслитерация</Label>
              <p className="text-sm text-muted-foreground">
                Преобразовывать кириллицу в латиницу
              </p>
            </div>
            <Switch defaultChecked onChange={onChangeDetected} />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Canonical URL</CardTitle>
          <CardDescription>
            Предпочтительные версии страниц для поисковиков
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Добавлять canonical теги</Label>
              <p className="text-sm text-muted-foreground">
                Указывать каноническую версию страницы
              </p>
            </div>
            <Switch defaultChecked onChange={onChangeDetected} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="canonical-domain">Предпочтительный домен</Label>
            <Select defaultValue="https">
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="https">https://example.com</SelectItem>
                <SelectItem value="https-www">https://www.example.com</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>301 Редиректы</CardTitle>
              <CardDescription>
                Перенаправление старых URL на новые
              </CardDescription>
            </div>
            <Button size="sm">
              Добавить редирект
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between p-3 rounded-lg border">
              <div className="flex-1">
                <p className="text-sm font-medium">/old-post-url</p>
                <p className="text-xs text-muted-foreground">→ /2026/02/new-post-url</p>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline">301</Badge>
                <Button variant="ghost" size="sm">Удалить</Button>
              </div>
            </div>

            <div className="flex items-center justify-between p-3 rounded-lg border">
              <div className="flex-1">
                <p className="text-sm font-medium">/category/old-name</p>
                <p className="text-xs text-muted-foreground">→ /category/new-name</p>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline">301</Badge>
                <Button variant="ghost" size="sm">Удалить</Button>
              </div>
            </div>
          </div>

          <Button variant="outline" className="w-full">
            Импортировать редиректы из CSV
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Trailing Slash</CardTitle>
          <CardDescription>
            Обработка завершающего слэша в URL
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="trailing-slash">Политика trailing slash</Label>
            <Select defaultValue="no-slash">
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="no-slash">Без слэша (/page)</SelectItem>
                <SelectItem value="with-slash">Со слэшем (/page/)</SelectItem>
                <SelectItem value="auto">Автоматически</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Автоматический редирект</Label>
              <p className="text-sm text-muted-foreground">
                Перенаправлять на выбранный формат
              </p>
            </div>
            <Switch defaultChecked onChange={onChangeDetected} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function ContentAnalysisSettings({ onChangeDetected }: { onChangeDetected: () => void }) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold mb-2">Контент-анализ</h2>
        <p className="text-muted-foreground">
          Инструменты для оценки и оптимизации контента
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Анализ ключевых слов</CardTitle>
          <CardDescription>
            Автоматическая проверка оптимизации контента
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Включить анализ ключевых слов</Label>
              <p className="text-sm text-muted-foreground">
                Подсвечивать проблемы с ключевыми словами при создании статьи
              </p>
            </div>
            <Switch defaultChecked onChange={onChangeDetected} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="keyword-density">Оптимальная плотность ключевых слов (%)</Label>
            <Input 
              id="keyword-density" 
              type="number"
              step="0.1"
              defaultValue="1.5"
              onChange={onChangeDetected}
            />
            <p className="text-xs text-muted-foreground">
              Рекомендуется 1-2%
            </p>
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Предупреждать о переоптимизации</Label>
              <p className="text-sm text-muted-foreground">
                Слишком высокая плотность ключевых слов
              </p>
            </div>
            <Switch defaultChecked onChange={onChangeDetected} />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>SEO-рекомендации</CardTitle>
          <CardDescription>
            Автоматические подсказки по улучшению SEO
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Проверка длины заголовка</Label>
              <p className="text-sm text-muted-foreground">
                50-60 символов для title
              </p>
            </div>
            <Switch defaultChecked onChange={onChangeDetected} />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Проверка длины описания</Label>
              <p className="text-sm text-muted-foreground">
                150-160 символов для meta description
              </p>
            </div>
            <Switch defaultChecked onChange={onChangeDetected} />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Наличие заголовков H2-H3</Label>
              <p className="text-sm text-muted-foreground">
                Структурированность контента
              </p>
            </div>
            <Switch defaultChecked onChange={onChangeDetected} />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Проверка alt-текстов</Label>
              <p className="text-sm text-muted-foreground">
                Наличие описаний у изображений
              </p>
            </div>
            <Switch defaultChecked onChange={onChangeDetected} />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Анализ читабельности</Label>
              <p className="text-sm text-muted-foreground">
                Flesch Reading Ease Score
              </p>
            </div>
            <Switch defaultChecked onChange={onChangeDetected} />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Дубли контента</CardTitle>
          <CardDescription>
            Проверка на дублирование и плагиат
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Автопроверка на дубли</Label>
              <p className="text-sm text-muted-foreground">
                Искать похожий контент внутри блога
              </p>
            </div>
            <Switch defaultChecked onChange={onChangeDetected} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="similarity-threshold">Порог схожести (%)</Label>
            <Input 
              id="similarity-threshold" 
              type="number"
              defaultValue="30"
              onChange={onChangeDetected}
            />
            <p className="text-xs text-muted-foreground">
              При превышении будет предупреждение
            </p>
          </div>

          <Button variant="outline" className="w-full">
            Запустить полную проверку
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Внутренняя перелинковка</CardTitle>
          <CardDescription>
            Рекомендации по связыванию статей
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Автопредложения ссылок</Label>
              <p className="text-sm text-muted-foreground">
                Предлагать релевантные статьи для ссылок
              </p>
            </div>
            <Switch defaultChecked onChange={onChangeDetected} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="min-internal-links">Минимум внутренних ссылок</Label>
            <Input 
              id="min-internal-links" 
              type="number"
              defaultValue="3"
              onChange={onChangeDetected}
            />
            <p className="text-xs text-muted-foreground">
              Рекомендуемое количество ссылок на другие статьи
            </p>
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Проверка анкор-текстов</Label>
              <p className="text-sm text-muted-foreground">
                Анализировать тексты ссылок
              </p>
            </div>
            <Switch defaultChecked onChange={onChangeDetected} />
          </div>

          <Button variant="outline" className="w-full">
            <Eye className="size-4 mr-2" />
            Карта перелинковки
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Скоринг контента</CardTitle>
          <CardDescription>
            Общая оценка SEO-качества статей
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Показывать SEO-оценку</Label>
              <p className="text-sm text-muted-foreground">
                Баллы по 100-балльной шкале
              </p>
            </div>
            <Switch defaultChecked onChange={onChangeDetected} />
          </div>

          <div className="space-y-2">
            <Label>Топ статей по SEO</Label>
            <div className="space-y-2">
              <div className="flex items-center justify-between p-2 rounded border">
                <span className="text-sm">Полное руководство по React Hooks</span>
                <Badge variant="outline" className="bg-green-500/10 text-green-500">95</Badge>
              </div>
              <div className="flex items-center justify-between p-2 rounded border">
                <span className="text-sm">TypeScript: от новичка до профи</span>
                <Badge variant="outline" className="bg-green-500/10 text-green-500">92</Badge>
              </div>
              <div className="flex items-center justify-between p-2 rounded border">
                <span className="text-sm">Next.js 14: что нового?</span>
                <Badge variant="outline" className="bg-yellow-500/10 text-yellow-500">78</Badge>
              </div>
            </div>
          </div>

          <Button variant="outline" className="w-full">
            Посмотреть все оценки
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}