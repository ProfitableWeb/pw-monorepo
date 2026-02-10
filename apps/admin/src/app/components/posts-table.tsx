import { useState } from "react";
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
import { MoreHorizontal, Eye, Edit, Trash2 } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/app/components/ui/card";

interface Post {
  id: number;
  title: string;
  status: "published" | "draft" | "archived";
  category: string;
  views: number;
  date: string;
}

const mockPosts: Post[] = [
  {
    id: 1,
    title: "Как создать современный дашбоард с React",
    status: "published",
    category: "Разработка",
    views: 1234,
    date: "2026-01-15",
  },
  {
    id: 2,
    title: "Введение в Tailwind CSS 4.0",
    status: "published",
    category: "CSS",
    views: 890,
    date: "2026-01-12",
  },
  {
    id: 3,
    title: "Лучшие практики TypeScript в 2026",
    status: "draft",
    category: "TypeScript",
    views: 0,
    date: "2026-01-10",
  },
  {
    id: 4,
    title: "Оптимизация производительности React приложений",
    status: "published",
    category: "Разработка",
    views: 2341,
    date: "2026-01-08",
  },
  {
    id: 5,
    title: "shadcn/ui: Компоненты нового поколения",
    status: "draft",
    category: "UI/UX",
    views: 0,
    date: "2026-01-05",
  },
];

const statusVariant = {
  published: "default",
  draft: "secondary",
  archived: "outline",
} as const;

const statusLabel = {
  published: "Опубликован",
  draft: "Черновик",
  archived: "Архив",
};

export function PostsTable() {
  const [posts] = useState<Post[]>(mockPosts);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Последние посты</CardTitle>
        <CardDescription>Управление вашими публикациями</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Заголовок</TableHead>
              <TableHead>Статус</TableHead>
              <TableHead>Категория</TableHead>
              <TableHead>Просмотры</TableHead>
              <TableHead>Дата</TableHead>
              <TableHead className="text-right">Действия</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {posts.map((post) => (
              <TableRow key={post.id}>
                <TableCell className="font-medium max-w-md truncate">
                  {post.title}
                </TableCell>
                <TableCell>
                  <Badge variant={statusVariant[post.status]}>
                    {statusLabel[post.status]}
                  </Badge>
                </TableCell>
                <TableCell>{post.category}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    <Eye className="h-3 w-3 text-muted-foreground" />
                    {post.views.toLocaleString()}
                  </div>
                </TableCell>
                <TableCell>{new Date(post.date).toLocaleDateString('ru-RU')}</TableCell>
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
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
