import { useHeaderStore } from "@/app/store/header-store";
import { breadcrumbPresets } from "@/app/utils/breadcrumbs-helper";
import { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/app/components/ui/table";
import { Badge } from "@/app/components/ui/badge";
import { Button } from "@/app/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/app/components/ui/dropdown-menu";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/app/components/ui/popover";
import { Input } from "@/app/components/ui/input";
import { Checkbox } from "@/app/components/ui/checkbox";
import { Calendar } from "@/app/components/ui/calendar";
import { MoreHorizontal, Eye, Edit, Trash2, Search, X, CalendarIcon, ChevronDown, Plus } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/app/components/ui/card";
import { cn } from "@/app/components/ui/utils";

interface Article {
  id: number;
  title: string;
  status: "published" | "draft" | "archived" | "scheduled";
  category: string;
  author: string;
  views: number;
  comments: number;
  date: string;
}

const mockArticles: Article[] = [
  {
    id: 1,
    title: "Как создать современный дашбоард с React",
    status: "published",
    category: "Разработка",
    author: "Иван Петров",
    views: 1234,
    comments: 15,
    date: "2026-01-15",
  },
  {
    id: 2,
    title: "Введение в Tailwind CSS 4.0",
    status: "published",
    category: "CSS",
    author: "Мария Сидорова",
    views: 890,
    comments: 8,
    date: "2026-01-12",
  },
  {
    id: 3,
    title: "Лучшие практики TypeScript в 2026",
    status: "draft",
    category: "TypeScript",
    author: "Алексей Иванов",
    views: 0,
    comments: 0,
    date: "2026-01-10",
  },
  {
    id: 4,
    title: "Оптимизация производительности React приложений",
    status: "published",
    category: "Разработка",
    author: "Иван Петров",
    views: 2341,
    comments: 23,
    date: "2026-01-08",
  },
  {
    id: 5,
    title: "shadcn/ui: Компоненты нового поколения",
    status: "draft",
    category: "UI/UX",
    author: "Мария Сидорова",
    views: 0,
    comments: 0,
    date: "2026-01-05",
  },
  {
    id: 6,
    title: "Микрофронтенды: архитектура будущего",
    status: "published",
    category: "Архитектура",
    author: "Дмитрий Козлов",
    views: 567,
    comments: 12,
    date: "2026-01-03",
  },
  {
    id: 7,
    title: "Accessibility в веб-разработке",
    status: "published",
    category: "UI/UX",
    author: "Елена Волкова",
    views: 443,
    comments: 6,
    date: "2026-01-01",
  },
  {
    id: 8,
    title: "GraphQL vs REST: что выбрать в 2026",
    status: "archived",
    category: "API",
    author: "Алексей Иванов",
    views: 1890,
    comments: 34,
    date: "2025-12-28",
  },
  {
    id: 9,
    title: "Планирование релизов с помощью GitFlow",
    status: "scheduled",
    category: "Разработка",
    author: "Иван Петров",
    views: 0,
    comments: 0,
    date: "2026-02-01",
  },
];

const STATUSES = [
  { value: "published", label: "Опубликованные" },
  { value: "draft", label: "Черновики" },
  { value: "archived", label: "Архив" },
  { value: "scheduled", label: "Запланированные" },
];

const CATEGORIES = ["Разработка", "CSS", "TypeScript", "UI/UX", "Архитектура", "API"];

export function ArticlesSection() {
  const [articles] = useState<Article[]>(mockArticles);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [dateRange, setDateRange] = useState<{ from?: Date; to?: Date }>({});

  // Header store for breadcrumbs
  const { setBreadcrumbs, reset } = useHeaderStore();

  // Set breadcrumbs
  useEffect(() => {
    setBreadcrumbs(breadcrumbPresets.articles());

    return () => reset();
  }, [setBreadcrumbs, reset]);

  // Toggle status filter
  const toggleStatus = (status: string) => {
    setSelectedStatuses(prev =>
      prev.includes(status)
        ? prev.filter(s => s !== status)
        : [...prev, status]
    );
  };

  // Toggle category filter
  const toggleCategory = (category: string) => {
    setSelectedCategories(prev =>
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  // Clear all filters
  const clearAllFilters = () => {
    setSelectedStatuses([]);
    setSelectedCategories([]);
    setDateRange({});
    setSearchQuery("");
  };

  // Apply filters
  const filteredArticles = articles.filter((article) => {
    const matchesSearch =
      article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.author.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = selectedStatuses.length === 0 || selectedStatuses.includes(article.status);
    const matchesCategory = selectedCategories.length === 0 || selectedCategories.includes(article.category);
    
    const articleDate = new Date(article.date);
    const matchesDateFrom = !dateRange.from || articleDate >= dateRange.from;
    const matchesDateTo = !dateRange.to || articleDate <= dateRange.to;
    const matchesDate = matchesDateFrom && matchesDateTo;

    return matchesSearch && matchesStatus && matchesCategory && matchesDate;
  });

  const hasActiveFilters = selectedStatuses.length > 0 || selectedCategories.length > 0 || dateRange.from || dateRange.to;

  const getStatusColor = (status: string) => {
    switch (status) {
      case "published":
        return "bg-green-500/10 text-green-700 dark:text-green-400 hover:bg-green-500/20";
      case "draft":
        return "bg-yellow-500/10 text-yellow-700 dark:text-yellow-400 hover:bg-yellow-500/20";
      case "scheduled":
        return "bg-blue-500/10 text-blue-700 dark:text-blue-400 hover:bg-blue-500/20";
      default:
        return "";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "published":
        return "Опубликована";
      case "draft":
        return "Черновик";
      case "scheduled":
        return "Запланирована";
      default:
        return status;
    }
  };

  const publishedCount = articles.filter(a => a.status === "published").length;
  const draftCount = articles.filter(a => a.status === "draft").length;
  const scheduledCount = articles.filter(a => a.status === "scheduled").length;
  const totalViews = articles.reduce((sum, a) => sum + a.views, 0);

  useEffect(() => {
    useHeaderStore.setState({ title: "Управление статьями" });
  }, []);

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">
            Управление статьями
          </h1>
          <p className="text-muted-foreground mt-1">
            {articles.length} статей • {publishedCount} опубликовано • {draftCount} черновиков • {totalViews.toLocaleString()} просмотров
          </p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Новая статья
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Всего статей</CardDescription>
            <CardTitle className="text-3xl">{articles.length}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Опубликовано</CardDescription>
            <CardTitle className="text-3xl">
              {articles.filter(a => a.status === "published").length}
            </CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Черновиков</CardDescription>
            <CardTitle className="text-3xl">
              {articles.filter(a => a.status === "draft").length}
            </CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Всего просмотров</CardDescription>
            <CardTitle className="text-3xl">
              {articles.reduce((sum, a) => sum + a.views, 0).toLocaleString()}
            </CardTitle>
          </CardHeader>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card className="sticky top-16 z-10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
        <CardHeader>
          <div className="flex flex-col gap-4">
            {/* Search Bar */}
            <div className="flex-1 max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Поиск по названию или автору..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>

            {/* Filter Chips */}
            <div className="flex flex-wrap items-center gap-2">
              {/* Status Filter */}
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className={cn(
                      "h-8",
                      selectedStatuses.length > 0 && "border-primary"
                    )}
                  >
                    Статус
                    {selectedStatuses.length > 0 && (
                      <Badge variant="secondary" className="ml-2 h-5 px-1.5">
                        {selectedStatuses.length}
                      </Badge>
                    )}
                    <ChevronDown className="ml-2 h-3 w-3" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-56 p-3" align="start">
                  <div className="space-y-2">
                    <div className="font-medium text-sm mb-3">Статус статьи</div>
                    {STATUSES.map((status) => (
                      <div key={status.value} className="flex items-center space-x-2">
                        <Checkbox
                          id={`status-${status.value}`}
                          checked={selectedStatuses.includes(status.value)}
                          onCheckedChange={() => toggleStatus(status.value)}
                        />
                        <label
                          htmlFor={`status-${status.value}`}
                          className="text-sm cursor-pointer flex-1"
                        >
                          {status.label}
                        </label>
                      </div>
                    ))}
                  </div>
                </PopoverContent>
              </Popover>

              {/* Category Filter */}
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className={cn(
                      "h-8",
                      selectedCategories.length > 0 && "border-primary"
                    )}
                  >
                    Категория
                    {selectedCategories.length > 0 && (
                      <Badge variant="secondary" className="ml-2 h-5 px-1.5">
                        {selectedCategories.length}
                      </Badge>
                    )}
                    <ChevronDown className="ml-2 h-3 w-3" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-56 p-3" align="start">
                  <div className="space-y-2">
                    <div className="font-medium text-sm mb-3">Категории</div>
                    {CATEGORIES.map((category) => (
                      <div key={category} className="flex items-center space-x-2">
                        <Checkbox
                          id={`category-${category}`}
                          checked={selectedCategories.includes(category)}
                          onCheckedChange={() => toggleCategory(category)}
                        />
                        <label
                          htmlFor={`category-${category}`}
                          className="text-sm cursor-pointer flex-1"
                        >
                          {category}
                        </label>
                      </div>
                    ))}
                  </div>
                </PopoverContent>
              </Popover>

              {/* Date Range Filter */}
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className={cn(
                      "h-8",
                      (dateRange.from || dateRange.to) && "border-primary"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-3 w-3" />
                    Дата
                    {(dateRange.from || dateRange.to) && (
                      <Badge variant="secondary" className="ml-2 h-5 px-1.5">
                        1
                      </Badge>
                    )}
                    <ChevronDown className="ml-2 h-3 w-3" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <div className="p-3">
                    <div className="font-medium text-sm mb-3">Диапазон дат</div>
                    <Calendar
                      mode="range"
                      selected={{ from: dateRange.from, to: dateRange.to }}
                      onSelect={(range) => setDateRange(range || {})}
                      numberOfMonths={2}
                    />
                  </div>
                </PopoverContent>
              </Popover>

              {/* Clear All Button */}
              {hasActiveFilters && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearAllFilters}
                  className="h-8 text-muted-foreground"
                >
                  <X className="mr-2 h-3 w-3" />
                  Сбросить все
                </Button>
              )}

              {/* Active Filter Chips */}
              {selectedStatuses.map((status) => (
                <Badge
                  key={status}
                  variant="secondary"
                  className="h-8 gap-1 pl-3 pr-2"
                >
                  {STATUSES.find(s => s.value === status)?.label}
                  <button
                    onClick={() => toggleStatus(status)}
                    className="ml-1 hover:bg-muted rounded-sm p-0.5"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}

              {selectedCategories.map((category) => (
                <Badge
                  key={category}
                  variant="secondary"
                  className="h-8 gap-1 pl-3 pr-2"
                >
                  {category}
                  <button
                    onClick={() => toggleCategory(category)}
                    className="ml-1 hover:bg-muted rounded-sm p-0.5"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}

              {(dateRange.from || dateRange.to) && (
                <Badge
                  variant="secondary"
                  className="h-8 gap-1 pl-3 pr-2"
                >
                  {dateRange.from && dateRange.to
                    ? `${dateRange.from.toLocaleDateString('ru-RU')} - ${dateRange.to.toLocaleDateString('ru-RU')}`
                    : dateRange.from
                    ? `С ${dateRange.from.toLocaleDateString('ru-RU')}`
                    : `До ${dateRange.to?.toLocaleDateString('ru-RU')}`
                  }
                  <button
                    onClick={() => setDateRange({})}
                    className="ml-1 hover:bg-muted rounded-sm p-0.5"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Заголовок</TableHead>
                <TableHead>Автор</TableHead>
                <TableHead>Статус</TableHead>
                <TableHead>Кате��ория</TableHead>
                <TableHead>Просмотры</TableHead>
                <TableHead>Комментарии</TableHead>
                <TableHead>Дата</TableHead>
                <TableHead className="text-right">Действия</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredArticles.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center h-24 text-muted-foreground">
                    Статьи не найдены
                  </TableCell>
                </TableRow>
              ) : (
                filteredArticles.map((article) => (
                  <TableRow key={article.id}>
                    <TableCell className="font-medium max-w-md truncate">
                      {article.title}
                    </TableCell>
                    <TableCell>{article.author}</TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(article.status)}>
                        {getStatusLabel(article.status)}
                      </Badge>
                    </TableCell>
                    <TableCell>{article.category}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Eye className="h-3 w-3 text-muted-foreground" />
                        {article.views.toLocaleString()}
                      </div>
                    </TableCell>
                    <TableCell>{article.comments}</TableCell>
                    <TableCell>{new Date(article.date).toLocaleDateString('ru-RU')}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Открыть меню</span>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Действия</DropdownMenuLabel>
                          <DropdownMenuItem>
                            <Eye className="mr-2 h-4 w-4" />
                            Просмотр
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Edit className="mr-2 h-4 w-4" />
                            Редактировать
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-destructive">
                            <Trash2 className="mr-2 h-4 w-4" />
                            Удалить
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}