import { useHeaderStore } from "@/app/store/header-store";
import { breadcrumbPresets } from "@/app/utils/breadcrumbs-helper";

import { useState, useMemo, useEffect } from "react";
import { cn } from "@/app/components/ui/utils";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Badge } from "@/app/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/app/components/ui/dialog";
import { Label } from "@/app/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/app/components/ui/dropdown-menu";
import {
  Plus,
  Search,
  MoreVertical,
  Edit2,
  Trash2,
  Tag as TagIcon,
  TrendingUp,
  Clock,
  Hash,
  AlertCircle,
  Cloud,
  Grid3x3,
  List,
  Pencil,
  Link2,
} from "lucide-react";

interface Tag {
  id: string;
  name: string;
  slug: string;
  color: string;
  articlesCount: number;
  category?: string;
  createdAt: Date;
}

const COLORS = [
  { name: "Серый", value: "bg-gray-500" },
  { name: "Красный", value: "bg-red-500" },
  { name: "Оранжевый", value: "bg-orange-500" },
  { name: "Желтый", value: "bg-yellow-500" },
  { name: "Зеленый", value: "bg-green-500" },
  { name: "Синий", value: "bg-blue-500" },
  { name: "Фиолетовый", value: "bg-purple-500" },
  { name: "Розовый", value: "bg-pink-500" },
];

const TAG_GROUPS = [
  "Технологии",
  "Дизайн",
  "Маркетинг",
  "Бизнес",
  "Лайфстайл",
  "Без группы",
];

const initialTags: Tag[] = [
  { id: "1", name: "React", slug: "react", color: "bg-blue-500", articlesCount: 45, category: "Технологии", createdAt: new Date(2024, 0, 15) },
  { id: "2", name: "TypeScript", slug: "typescript", color: "bg-blue-500", articlesCount: 38, category: "Технологии", createdAt: new Date(2024, 0, 20) },
  { id: "3", name: "UI/UX", slug: "ui-ux", color: "bg-pink-500", articlesCount: 32, category: "Дизайн", createdAt: new Date(2024, 1, 1) },
  { id: "4", name: "JavaScript", slug: "javascript", color: "bg-yellow-500", articlesCount: 28, category: "Технологии", createdAt: new Date(2024, 0, 10) },
  { id: "5", name: "CSS", slug: "css", color: "bg-purple-500", articlesCount: 24, category: "Тхнологии", createdAt: new Date(2024, 1, 5) },
  { id: "6", name: "Веб-дизайн", slug: "web-design", color: "bg-pink-500", articlesCount: 22, category: "Дизайн", createdAt: new Date(2024, 1, 10) },
  { id: "7", name: "Продуктивность", slug: "productivity", color: "bg-green-500", articlesCount: 19, category: "Лайфстайл", createdAt: new Date(2024, 1, 15) },
  { id: "8", name: "SEO", slug: "seo", color: "bg-orange-500", articlesCount: 17, category: "Маркетинг", createdAt: new Date(2024, 0, 25) },
  { id: "9", name: "Node.js", slug: "nodejs", color: "bg-green-500", articlesCount: 15, category: "Технологии", createdAt: new Date(2024, 1, 20) },
  { id: "10", name: "Tailwind", slug: "tailwind", color: "bg-blue-500", articlesCount: 14, category: "Технологии", createdAt: new Date(2024, 1, 22) },
  { id: "11", name: "Бренд", slug: "brand", color: "bg-red-500", articlesCount: 12, category: "Маркетинг", createdAt: new Date(2024, 1, 25) },
  { id: "12", name: "API", slug: "api", color: "bg-purple-500", articlesCount: 11, category: "Технологии", createdAt: new Date(2024, 1, 28) },
  { id: "13", name: "Мобайл", slug: "mobile", color: "bg-green-500", articlesCount: 10, category: "Технологии", createdAt: new Date(2024, 0, 30) },
  { id: "14", name: "Аналитика", slug: "analytics", color: "bg-orange-500", articlesCount: 9, category: "Бизнес", createdAt: new Date(2024, 1, 12) },
  { id: "15", name: "Figma", slug: "figma", color: "bg-pink-500", articlesCount: 8, category: "Дизайн", createdAt: new Date(2024, 1, 18) },
  { id: "16", name: "Git", slug: "git", color: "bg-orange-500", articlesCount: 7, category: "Технологии", createdAt: new Date(2024, 1, 8) },
  { id: "17", name: "Контент", slug: "content", color: "bg-yellow-500", articlesCount: 6, category: "Маркетинг", createdAt: new Date(2024, 1, 14) },
  { id: "18", name: "AI", slug: "ai", color: "bg-purple-500", articlesCount: 5, category: "Технологии", createdAt: new Date(2024, 1, 29) },
  { id: "19", name: "Стартап", slug: "startup", color: "bg-red-500", articlesCount: 4, category: "Бизнес", createdAt: new Date(2024, 1, 16) },
  { id: "20", name: "Тренды", slug: "trends", color: "bg-pink-500", articlesCount: 3, category: "Лайфстайл", createdAt: new Date(2024, 1, 27) },
  { id: "21", name: "Тестирование", slug: "testing", color: "bg-green-500", articlesCount: 2, category: "Технологии", createdAt: new Date(2024, 1, 21) },
  { id: "22", name: "DevOps", slug: "devops", color: "bg-blue-500", articlesCount: 1, category: "Технологии", createdAt: new Date(2024, 1, 26) },
  { id: "23", name: "Монетизация", slug: "monetization", color: "bg-green-500", articlesCount: 0, category: "Бизнес", createdAt: new Date(2024, 1, 30) },
];

type ViewMode = "cloud" | "grid" | "list";

export function TagsSection() {
  const [tags, setTags] = useState<Tag[]>(initialTags);
  const [viewMode, setViewMode] = useState<ViewMode>("cloud");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTag, setSelectedTag] = useState<Tag | null>(null);
  const [selectedGroup, setSelectedGroup] = useState<string | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingTag, setEditingTag] = useState<Tag | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    color: "bg-gray-500",
    category: "Без группы",
  });

  // Header store for breadcrumbs
  const { setBreadcrumbs, reset } = useHeaderStore();

  // Set breadcrumbs
  useEffect(() => {
    setBreadcrumbs(breadcrumbPresets.tags());

    return () => reset();
  }, [setBreadcrumbs, reset]);

  const filteredTags = useMemo(() => {
    let result = tags;
    
    if (searchQuery) {
      result = result.filter((tag) =>
        tag.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tag.slug.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    return result;
  }, [tags, searchQuery]);

  const maxCount = Math.max(...tags.map((t) => t.articlesCount), 1);

  const topTags = useMemo(() => {
    return [...tags].sort((a, b) => b.articlesCount - a.articlesCount).slice(0, 10);
  }, [tags]);

  const recentTags = useMemo(() => {
    return [...tags].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime()).slice(0, 5);
  }, [tags]);

  const unusedTags = useMemo(() => {
    return tags.filter((t) => t.articlesCount === 0);
  }, [tags]);

  const tagsByGroup = useMemo(() => {
    const groups: Record<string, Tag[]> = {};
    tags.forEach((tag) => {
      const group = tag.category || "Без группы";
      if (!groups[group]) groups[group] = [];
      groups[group].push(tag);
    });
    return groups;
  }, [tags]);

  const getTagSize = (count: number) => {
    const ratio = count / maxCount;
    if (ratio > 0.7) return "text-4xl";
    if (ratio > 0.5) return "text-3xl";
    if (ratio > 0.3) return "text-2xl";
    if (ratio > 0.15) return "text-xl";
    return "text-base";
  };

  const getTagOpacity = (count: number) => {
    const ratio = count / maxCount;
    if (ratio > 0.7) return "opacity-100";
    if (ratio > 0.5) return "opacity-90";
    if (ratio > 0.3) return "opacity-80";
    if (ratio > 0.15) return "opacity-70";
    return "opacity-60";
  };

  const handleSave = () => {
    if (editingTag) {
      setTags((prev) =>
        prev.map((t) =>
          t.id === editingTag.id ? { ...t, ...formData } : t
        )
      );
    } else {
      const newTag: Tag = {
        id: Date.now().toString(),
        name: formData.name,
        slug: formData.slug,
        color: formData.color,
        articlesCount: 0,
        category: formData.category,
        createdAt: new Date(),
      };
      setTags((prev) => [...prev, newTag]);
    }
    handleCloseDialog();
  };

  const handleDelete = (id: string) => {
    setTags((prev) => prev.filter((t) => t.id !== id));
    setSelectedTag(null);
  };

  const handleEdit = (tag: Tag) => {
    setEditingTag(tag);
    setFormData({
      name: tag.name,
      slug: tag.slug,
      color: tag.color,
      category: tag.category || "Без группы",
    });
    setIsAddDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsAddDialogOpen(false);
    setEditingTag(null);
    setFormData({ name: "", slug: "", color: "bg-gray-500", category: "Без группы" });
  };

  const handleQuickAdd = () => {
    if (searchQuery && !tags.find((t) => t.name.toLowerCase() === searchQuery.toLowerCase())) {
      setFormData({
        name: searchQuery,
        slug: searchQuery.toLowerCase().replace(/\s+/g, "-"),
        color: "bg-gray-500",
        category: "Без группы",
      });
      setIsAddDialogOpen(true);
    }
  };

  const totalArticles = tags.reduce((sum, tag) => sum + tag.articlesCount, 0);

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Управление метками</h1>
          <p className="text-muted-foreground mt-1">
            {tags.length} меток • {totalArticles} использований • {unusedTags.length} неиспользуемых
          </p>
        </div>
        <Button onClick={() => setIsAddDialogOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Новая метка
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 border rounded-lg bg-card space-y-2">
          <div className="flex items-center gap-2 text-muted-foreground">
            <TrendingUp className="h-4 w-4" />
            <span className="text-sm font-medium">Популярные метки</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {topTags.slice(0, 5).map((tag) => (
              <Badge key={tag.id} variant="secondary" className="text-xs">
                {tag.name} ({tag.articlesCount})
              </Badge>
            ))}
          </div>
        </div>

        <div className="p-4 border rounded-lg bg-card space-y-2">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Clock className="h-4 w-4" />
            <span className="text-sm font-medium">Недавно добавленные</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {recentTags.map((tag) => (
              <Badge key={tag.id} variant="secondary" className="text-xs">
                {tag.name}
              </Badge>
            ))}
          </div>
        </div>

        <div className="p-4 border rounded-lg bg-card space-y-2">
          <div className="flex items-center gap-2 text-muted-foreground">
            <AlertCircle className="h-4 w-4" />
            <span className="text-sm font-medium">Неиспользуемые</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {unusedTags.length > 0 ? (
              unusedTags.slice(0, 5).map((tag) => (
                <Badge key={tag.id} variant="outline" className="text-xs">
                  {tag.name}
                </Badge>
              ))
            ) : (
              <p className="text-xs text-muted-foreground">Все метки используются!</p>
            )}
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Поиск меток..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 pr-20"
          />
          {searchQuery && !filteredTags.find((t) => t.name.toLowerCase() === searchQuery.toLowerCase()) && (
            <Button
              size="sm"
              variant="ghost"
              className="absolute right-1 top-1/2 -translate-y-1/2 h-7 text-xs"
              onClick={handleQuickAdd}
            >
              <Plus className="h-3 w-3 mr-1" />
              Создать
            </Button>
          )}
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 border rounded-lg p-1">
            <Button
              size="sm"
              variant={viewMode === "cloud" ? "default" : "ghost"}
              onClick={() => setViewMode("cloud")}
              className="h-8 w-8 p-0"
            >
              <Cloud className="h-4 w-4" />
            </Button>
            <Button
              size="sm"
              variant={viewMode === "grid" ? "default" : "ghost"}
              onClick={() => setViewMode("grid")}
              className="h-8 w-8 p-0"
            >
              <Grid3x3 className="h-4 w-4" />
            </Button>
            <Button
              size="sm"
              variant={viewMode === "list" ? "default" : "ghost"}
              onClick={() => setViewMode("list")}
              className="h-8 w-8 p-0"
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Group Filters */}
      <div className="flex items-center gap-2 flex-wrap">
        <Button
          size="sm"
          variant={selectedGroup === null ? "default" : "outline"}
          onClick={() => setSelectedGroup(null)}
        >
          Все группы
        </Button>
        {TAG_GROUPS.map((group) => (
          <Button
            key={group}
            size="sm"
            variant={selectedGroup === group ? "default" : "outline"}
            onClick={() => setSelectedGroup(group)}
          >
            {group} ({tagsByGroup[group]?.length || 0})
          </Button>
        ))}
      </div>

      {/* Tags Display */}
      {viewMode === "cloud" && (
        <div className="p-8 border rounded-lg bg-muted/30 min-h-[400px] flex flex-wrap items-center justify-center gap-4 content-center">
          {filteredTags.map((tag) => (
            <button
              key={tag.id}
              onClick={() => setSelectedTag(tag)}
              className={cn(
                "font-semibold transition-all duration-300 hover:scale-110 cursor-pointer",
                getTagSize(tag.articlesCount),
                getTagOpacity(tag.articlesCount),
                selectedTag?.id === tag.id && "scale-125 text-primary"
              )}
              style={{
                color: tag.color.replace("bg-", ""),
                filter: "saturate(0.8)",
              }}
            >
              #{tag.name}
            </button>
          ))}
        </div>
      )}

      {viewMode === "grid" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredTags.map((tag) => (
            <div
              key={tag.id}
              className="group p-4 border rounded-lg bg-card hover:shadow-md transition-all cursor-pointer"
              onClick={() => setSelectedTag(tag)}
            >
              <div className="flex items-start justify-between mb-2">
                <div className={cn("p-2 rounded-lg", tag.color)}>
                  <Hash className="h-4 w-4 text-white" />
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                    <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={(e) => { e.stopPropagation(); handleEdit(tag); }}>
                      <Pencil className="h-4 w-4 mr-2" />
                      Редактировать
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={(e) => { e.stopPropagation(); handleDelete(tag.id); }}
                      className="text-destructive"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Удалить
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <h3 className="font-semibold mb-1">{tag.name}</h3>
              <p className="text-xs text-muted-foreground mb-2">/{tag.slug}</p>
              <div className="flex items-center justify-between">
                <Badge variant="secondary" className="text-xs">
                  {tag.articlesCount} статей
                </Badge>
                {tag.category && (
                  <span className="text-xs text-muted-foreground">{tag.category}</span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {viewMode === "list" && (
        <div className="border rounded-lg overflow-hidden">
          <table className="w-full">
            <thead className="bg-muted/50">
              <tr className="text-sm">
                <th className="text-left p-3 font-medium">Метка</th>
                <th className="text-left p-3 font-medium">Группа</th>
                <th className="text-left p-3 font-medium">Статей</th>
                <th className="text-left p-3 font-medium">Создана</th>
                <th className="text-right p-3 font-medium">Действия</th>
              </tr>
            </thead>
            <tbody>
              {filteredTags.map((tag, index) => (
                <tr
                  key={tag.id}
                  className={cn(
                    "border-t hover:bg-muted/30 transition-colors cursor-pointer",
                    index % 2 === 0 && "bg-muted/10"
                  )}
                  onClick={() => setSelectedTag(tag)}
                >
                  <td className="p-3">
                    <div className="flex items-center gap-2">
                      <div className={cn("w-3 h-3 rounded-full", tag.color)} />
                      <div>
                        <div className="font-medium">{tag.name}</div>
                        <div className="text-xs text-muted-foreground">/{tag.slug}</div>
                      </div>
                    </div>
                  </td>
                  <td className="p-3 text-sm text-muted-foreground">
                    {tag.category || "—"}
                  </td>
                  <td className="p-3">
                    <Badge variant="secondary" className="text-xs">
                      {tag.articlesCount}
                    </Badge>
                  </td>
                  <td className="p-3 text-sm text-muted-foreground">
                    {tag.createdAt.toLocaleDateString("ru-RU", { day: "2-digit", month: "short", year: "numeric" })}
                  </td>
                  <td className="p-3 text-right" onClick={(e) => e.stopPropagation()}>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleEdit(tag)}>
                          <Pencil className="h-4 w-4 mr-2" />
                          Редактировать
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleDelete(tag.id)}
                          className="text-destructive"
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Удалить
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Tag Details Dialog */}
      <Dialog open={selectedTag !== null} onOpenChange={() => setSelectedTag(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <div className={cn("p-2 rounded-lg", selectedTag?.color)}>
                <Hash className="h-4 w-4 text-white" />
              </div>
              {selectedTag?.name}
            </DialogTitle>
            <DialogDescription>
              Детальная информация о метке
            </DialogDescription>
          </DialogHeader>

          {selectedTag && (
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-xs text-muted-foreground">Slug</Label>
                  <p className="text-sm font-medium mt-1">/{selectedTag.slug}</p>
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">Группа</Label>
                  <p className="text-sm font-medium mt-1">{selectedTag.category || "—"}</p>
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">Использований</Label>
                  <p className="text-sm font-medium mt-1">{selectedTag.articlesCount} статей</p>
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">Создана</Label>
                  <p className="text-sm font-medium mt-1">
                    {selectedTag.createdAt.toLocaleDateString("ru-RU")}
                  </p>
                </div>
              </div>

              <div className="p-3 border rounded-lg bg-muted/30">
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                  <Link2 className="h-4 w-4" />
                  Часто используется с:
                </div>
                <div className="flex flex-wrap gap-1.5">
                  <Badge variant="outline" className="text-xs">React</Badge>
                  <Badge variant="outline" className="text-xs">TypeScript</Badge>
                  <Badge variant="outline" className="text-xs">UI/UX</Badge>
                </div>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setSelectedTag(null)}>
              Закрыть
            </Button>
            <Button onClick={() => { handleEdit(selectedTag!); setSelectedTag(null); }}>
              <Pencil className="h-4 w-4 mr-2" />
              Редактировать
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add/Edit Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={handleCloseDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>
              {editingTag ? "Редактировать метку" : "Новая метка"}
            </DialogTitle>
            <DialogDescription>
              {editingTag ? "Измените данные метки" : "Создайте новую метку для организации контента"}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Название</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => {
                  const name = e.target.value;
                  setFormData((prev) => ({
                    ...prev,
                    name,
                    slug: prev.slug || name.toLowerCase().replace(/\s+/g, "-"),
                  }));
                }}
                placeholder="Например: React"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="slug">URL (slug)</Label>
              <Input
                id="slug"
                value={formData.slug}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, slug: e.target.value }))
                }
                placeholder="react"
              />
            </div>

            <div className="space-y-2">
              <Label>Цвет</Label>
              <div className="flex gap-2 flex-wrap">
                {COLORS.map((color) => (
                  <button
                    key={color.value}
                    onClick={() => setFormData((prev) => ({ ...prev, color: color.value }))}
                    className={cn(
                      "w-10 h-10 rounded-lg transition-all",
                      color.value,
                      formData.color === color.value && "ring-2 ring-offset-2 ring-foreground scale-110"
                    )}
                    title={color.name}
                  />
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Группа</Label>
              <Select
                id="category"
                value={formData.category}
                onValueChange={(value) =>
                  setFormData((prev) => ({ ...prev, category: value }))
                }
                className="w-full px-3 py-2 border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-ring"
              >
                <SelectTrigger className="w-full px-3 py-2 border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-ring">
                  <SelectValue placeholder="Выберите группу">{formData.category}</SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {TAG_GROUPS.map((group) => (
                    <SelectItem key={group} value={group}>
                      {group}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={handleCloseDialog}>
              Отмена
            </Button>
            <Button onClick={handleSave} disabled={!formData.name || !formData.slug}>
              {editingTag ? "Сохранить" : "Создать"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}