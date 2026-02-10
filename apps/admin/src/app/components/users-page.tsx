import { useEffect, useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Badge } from '@/app/components/ui/badge';
import { useHeaderStore } from '@/app/store/header-store';
import { 
  Users, 
  UserPlus, 
  Shield, 
  Mail,
  Clock,
  MoreVertical,
  LayoutDashboard,
  Search,
  Filter,
  UserCheck,
  UserX,
  UserCog,
  Eye,
  Edit,
  Trash2,
  ChevronRight,
  FileText,
  Activity,
  CheckCircle,
  XCircle,
  AlertCircle,
  Crown,
  PenTool,
  BookOpen,
  Settings,
  MessageSquare,
  Ban,
  Key,
  HeadphonesIcon,
  Send,
  History,
  UsersRound,
  Cog,
  TrendingUp,
  BarChart3,
  LayoutPanelTop,
  SearchCheck,
  ShieldCheck,
  ShieldAlert,
  Lock,
  Copy,
  Plus,
} from 'lucide-react';
import { cn } from '@/app/components/ui/utils';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/app/components/ui/dropdown-menu';
import { ScrollArea } from '@/app/components/ui/scroll-area';
import { Separator } from '@/app/components/ui/separator';
import { Avatar, AvatarFallback } from '@/app/components/ui/avatar';
import { Label } from '@/app/components/ui/label';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'editor' | 'author' | 'viewer';
  status: 'active' | 'inactive' | 'invited';
  avatar: string;
  lastActive: string;
  articlesCount: number;
  joinedDate?: string;
  department?: string;
}

const users: User[] = [
  {
    id: '1',
    name: 'Николай Иванов',
    email: 'nikolay@example.com',
    role: 'admin',
    status: 'active',
    avatar: 'Н',
    lastActive: '5 минут назад',
    articlesCount: 45,
    joinedDate: '15 янв 2024',
    department: 'Управление',
  },
  {
    id: '2',
    name: 'Мария Петрова',
    email: 'maria@example.com',
    role: 'editor',
    status: 'active',
    avatar: 'М',
    lastActive: '1 час назад',
    articlesCount: 32,
    joinedDate: '20 янв 2024',
    department: 'Редакция',
  },
  {
    id: '3',
    name: 'Алексей Смирнов',
    email: 'alexey@example.com',
    role: 'author',
    status: 'active',
    avatar: 'А',
    lastActive: '3 часа назад',
    articlesCount: 18,
    joinedDate: '1 фев 2024',
    department: 'Контент',
  },
  {
    id: '4',
    name: 'Екатерина Волкова',
    email: 'ekaterina@example.com',
    role: 'author',
    status: 'active',
    avatar: 'Е',
    lastActive: 'Вчера',
    articlesCount: 24,
    joinedDate: '3 фев 2024',
    department: 'Контент',
  },
  {
    id: '5',
    name: 'Дмитрий Козлов',
    email: 'dmitry@example.com',
    role: 'viewer',
    status: 'invited',
    avatar: 'Д',
    lastActive: 'Не заходил',
    articlesCount: 0,
    joinedDate: '6 фев 2024',
    department: 'Наблюдатели',
  },
  {
    id: '6',
    name: 'Анна Сидорова',
    email: 'anna@example.com',
    role: 'author',
    status: 'active',
    avatar: 'А',
    lastActive: '2 дня назад',
    articlesCount: 15,
    joinedDate: '10 фев 2024',
    department: 'Контент',
  },
  {
    id: '7',
    name: 'Сергей Новиков',
    email: 'sergey@example.com',
    role: 'editor',
    status: 'inactive',
    avatar: 'С',
    lastActive: 'Неделю назад',
    articlesCount: 28,
    joinedDate: '5 янв 2024',
    department: 'Редакция',
  },
];

const roleLabels: Record<User['role'], string> = {
  admin: 'Администратор',
  editor: 'Редактор',
  author: 'Автор',
  viewer: 'Наблюдатель',
};

const roleIcons: Record<User['role'], any> = {
  admin: Crown,
  editor: PenTool,
  author: BookOpen,
  viewer: Eye,
};

const roleColors: Record<User['role'], string> = {
  admin: 'bg-red-500/10 text-red-500 border-red-500/20',
  editor: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
  author: 'bg-green-500/10 text-green-500 border-green-500/20',
  viewer: 'bg-gray-500/10 text-gray-500 border-gray-500/20',
};

const statusLabels: Record<User['status'], string> = {
  active: 'Активен',
  inactive: 'Неактивен',
  invited: 'Приглашен',
};

const statusColors: Record<User['status'], string> = {
  active: 'bg-green-500/10 text-green-500 border-green-500/20',
  inactive: 'bg-gray-500/10 text-gray-500 border-gray-500/20',
  invited: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
};

interface NavigationItem {
  id: string;
  label: string;
  icon: any;
}

const NAVIGATION_ITEMS: NavigationItem[] = [
  { id: 'list', label: 'Список пользователей', icon: Users },
  { id: 'team', label: 'Команда издания', icon: UsersRound },
  { id: 'invites', label: 'Приглашения', icon: Send },
  { id: 'comments', label: 'Комментарии', icon: MessageSquare },
  { id: 'blacklist', label: 'Чёрный список', icon: Ban },
  { id: 'roles', label: 'Роли и права', icon: Shield },
  { id: 'access', label: 'Настройка доступа', icon: Key },
  { id: 'activity', label: 'Активность', icon: Activity },
  { id: 'support', label: 'Служба поддержки', icon: HeadphonesIcon },
];

export function UsersPage() {
  const { setBreadcrumbs, reset } = useHeaderStore();
  const [activeSubsection, setActiveSubsection] = useState('list');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
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
      { label: 'Пользователи', icon: Users },
    ]);

    return () => reset();
  }, [setBreadcrumbs, reset]);

  const renderSubsection = () => {
    switch (activeSubsection) {
      case 'list':
        return <UsersList searchQuery={searchQuery} />;
      case 'team':
        return <TeamSection />;
      case 'invites':
        return <InvitesSection />;
      case 'comments':
        return <CommentsSection />;
      case 'blacklist':
        return <BlacklistSection />;
      case 'roles':
        return <RolesSection />;
      case 'access':
        return <AccessSection />;
      case 'activity':
        return <ActivitySection />;
      case 'support':
        return <SupportSection />;
      default:
        return <UsersList searchQuery={searchQuery} />;
    }
  };

  return (
    <div className="flex h-full overflow-hidden">
      {/* Sidebar Navigation */}
      <aside className="w-64 border-r bg-card flex-shrink-0 flex flex-col">
        <div className="p-4 border-b flex-shrink-0">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Поиск..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>

        <ScrollArea className="flex-1 min-h-0">
          <nav className="p-2">
            {NAVIGATION_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive = activeSubsection === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => setActiveSubsection(item.id)}
                  className={cn(
                    "w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors mb-1",
                    isActive
                      ? "bg-accent text-accent-foreground font-medium"
                      : "text-muted-foreground hover:bg-accent/50 hover:text-accent-foreground"
                  )}
                >
                  <Icon className="size-4 flex-shrink-0" />
                  <span className="flex-1 text-left">{item.label}</span>
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

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 min-h-0">
        <ScrollArea className="flex-1 min-h-0">
          <div className="max-w-6xl mx-auto p-6">
            {renderSubsection()}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}

// User List Component
function UsersList({ searchQuery }: { searchQuery: string }) {
  const filteredUsers = useMemo(() => {
    if (!searchQuery) return users;
    return users.filter((user) =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  const activeUsers = users.filter(u => u.status === 'active').length;
  const totalArticles = users.reduce((sum, u) => sum + u.articlesCount, 0);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight mb-2">Список пользователей</h2>
        <p className="text-muted-foreground">
          Управление всеми пользователями системы
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Users className="size-4" />
              Всего пользователей
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{users.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <CheckCircle className="size-4" />
              Активных
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{activeUsers}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <AlertCircle className="size-4" />
              Приглашено
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {users.filter(u => u.status === 'invited').length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <FileText className="size-4" />
              Всего статей
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalArticles}</div>
          </CardContent>
        </Card>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2">
        <Button>
          <UserPlus className="h-4 w-4 mr-2" />
          Пригласить пользователя
        </Button>
        <Button variant="outline">
          <Filter className="h-4 w-4 mr-2" />
          Фильтры
        </Button>
      </div>

      {/* Users List */}
      <div className="space-y-3">
        {filteredUsers.map((user) => {
          const RoleIcon = roleIcons[user.role];

          return (
            <div
              key={user.id}
              className="group flex items-center gap-4 p-4 rounded-lg border bg-card transition-all hover:shadow-md"
            >
              <Avatar className="h-12 w-12 flex-shrink-0">
                <AvatarFallback className="text-base font-medium">
                  {user.avatar}
                </AvatarFallback>
              </Avatar>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-medium truncate">{user.name}</h3>
                  <Badge 
                    variant="outline" 
                    className={cn("text-xs", roleColors[user.role])}
                  >
                    <RoleIcon className="size-3 mr-1" />
                    {roleLabels[user.role]}
                  </Badge>
                  <Badge 
                    variant="outline" 
                    className={cn("text-xs", statusColors[user.status])}
                  >
                    {statusLabels[user.status]}
                  </Badge>
                </div>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Mail className="size-3" />
                    {user.email}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="size-3" />
                    {user.lastActive}
                  </span>
                  {user.articlesCount > 0 && (
                    <span className="flex items-center gap-1">
                      <FileText className="size-3" />
                      {user.articlesCount} статей
                    </span>
                  )}
                </div>
              </div>

              <div className="flex-shrink-0">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button size="icon" variant="ghost" className="h-8 w-8">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>
                      <Eye className="h-4 w-4 mr-2" />
                      Просмотр профиля
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Edit className="h-4 w-4 mr-2" />
                      Редактировать
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <UserCog className="h-4 w-4 mr-2" />
                      Изменить роль
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="text-destructive">
                      <Trash2 className="h-4 w-4 mr-2" />
                      Удалить
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// Team Section
function TeamSection() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight mb-2">Команда издания</h2>
        <p className="text-muted-foreground">
          Структура редакции и распределение по отделам
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Crown className="size-5 text-red-500" />
              Управление
            </CardTitle>
            <CardDescription>Администраторы системы</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold mb-2">
              {users.filter(u => u.role === 'admin').length}
            </div>
            <p className="text-sm text-muted-foreground">человек</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PenTool className="size-5 text-blue-500" />
              Редакция
            </CardTitle>
            <CardDescription>Главные редакторы</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold mb-2">
              {users.filter(u => u.role === 'editor').length}
            </div>
            <p className="text-sm text-muted-foreground">человек</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="size-5 text-green-500" />
              Контент
            </CardTitle>
            <CardDescription>Авторы и журналисты</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold mb-2">
              {users.filter(u => u.role === 'author').length}
            </div>
            <p className="text-sm text-muted-foreground">человек</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="size-5 text-gray-500" />
              Наблюдатели
            </CardTitle>
            <CardDescription>Только просмотр</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold mb-2">
              {users.filter(u => u.role === 'viewer').length}
            </div>
            <p className="text-sm text-muted-foreground">человек</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Организационная структура</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {['Управление', 'Редакция', 'Контент', 'Наблюдатели'].map((dept) => {
              const deptUsers = users.filter(u => u.department === dept);
              return (
                <div key={dept} className="border-l-4 border-primary pl-4">
                  <h3 className="font-medium mb-2">{dept}</h3>
                  <div className="flex -space-x-2">
                    {deptUsers.map(user => (
                      <Avatar key={user.id} className="h-8 w-8 border-2 border-background">
                        <AvatarFallback className="text-xs">{user.avatar}</AvatarFallback>
                      </Avatar>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Invites Section
function InvitesSection() {
  const invitedUsers = users.filter(u => u.status === 'invited');

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight mb-2">Приглашения</h2>
        <p className="text-muted-foreground">
          Управление отпавленными приглашениями
        </p>
      </div>

      <div className="flex items-center gap-2">
        <Button>
          <Send className="h-4 w-4 mr-2" />
          Отправить приглашение
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Ожидают активации</CardTitle>
          <CardDescription>{invitedUsers.length} приглашений</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {invitedUsers.map(user => (
              <div key={user.id} className="flex items-center justify-between p-3 rounded-lg border">
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback>{user.avatar}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{user.name}</p>
                    <p className="text-sm text-muted-foreground">{user.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className={statusColors.invited}>
                    Ожидает
                  </Badge>
                  <Button size="sm" variant="ghost">
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Placeholder sections
function CommentsSection() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight mb-2">Комментарии</h2>
        <p className="text-muted-foreground">
          Модерация комментариев пользователей
        </p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Последние комментарии</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Функционал в разработке</p>
        </CardContent>
      </Card>
    </div>
  );
}

function BlacklistSection() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight mb-2">Чёрный список</h2>
        <p className="text-muted-foreground">
          Заблокированные пользователи и IP-адреса
        </p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Ban className="size-5 text-destructive" />
            Заблокированные
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Нет заблокированных пользователей</p>
        </CardContent>
      </Card>
    </div>
  );
}

function RolesSection() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight mb-2">Роли и права</h2>
        <p className="text-muted-foreground">
          Настройка ролей и прав доступа
        </p>
      </div>
      
      <div className="grid gap-4">
        {['admin', 'editor', 'author', 'viewer'].map((role) => {
          const RoleIcon = roleIcons[role as User['role']];
          return (
            <Card key={role}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <RoleIcon className="size-5" />
                  {roleLabels[role as User['role']]}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-3">
                  Пользователей с этой ролью: {users.filter(u => u.role === role).length}
                </p>
                <Button variant="outline" size="sm">
                  <Settings className="h-4 w-4 mr-2" />
                  Настроить права
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

function AccessSection() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight mb-2">Настройка доступа</h2>
        <p className="text-muted-foreground">
          Детальная настройка прав доступа к разделам
        </p>
      </div>

      {/* Roles and Permissions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ShieldCheck className="size-5" />
            Роли и разрешения
          </CardTitle>
          <CardDescription>Управлеие ролями пользователей и их пр��вами доступа</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Administrator Role */}
          <div className="p-4 rounded-lg border bg-card">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-red-500/10">
                  <ShieldAlert className="size-4" />
                </div>
                <div>
                  <p className="font-medium">Администратор</p>
                  <p className="text-sm text-muted-foreground">Полный доступ ко всем функциям системы</p>
                </div>
              </div>
              <Button variant="ghost" size="icon">
                <Edit className="size-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              <Badge variant="outline" className="text-xs bg-green-500/10 text-green-500 border-green-500/20">
                <CheckCircle className="size-3 mr-1" />
                Управление пользователями
              </Badge>
              <Badge variant="outline" className="text-xs bg-green-500/10 text-green-500 border-green-500/20">
                <CheckCircle className="size-3 mr-1" />
                Настройки системы
              </Badge>
              <Badge variant="outline" className="text-xs bg-green-500/10 text-green-500 border-green-500/20">
                <CheckCircle className="size-3 mr-1" />
                Все разделы
              </Badge>
            </div>
          </div>

          {/* Editor Role */}
          <div className="p-4 rounded-lg border bg-card">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-blue-500/10">
                  <ShieldCheck className="size-4" />
                </div>
                <div>
                  <p className="font-medium">Редактор</p>
                  <p className="text-sm text-muted-foreground">Управление контентом и публикациями</p>
                </div>
              </div>
              <Button variant="ghost" size="icon">
                <Edit className="size-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              <Badge variant="outline" className="text-xs bg-green-500/10 text-green-500 border-green-500/20">
                <CheckCircle className="size-3 mr-1" />
                Создание статей
              </Badge>
              <Badge variant="outline" className="text-xs bg-green-500/10 text-green-500 border-green-500/20">
                <CheckCircle className="size-3 mr-1" />
                Управление медиа
              </Badge>
              <Badge variant="outline" className="text-xs bg-green-500/10 text-green-500 border-green-500/20">
                <CheckCircle className="size-3 mr-1" />
                Категории и метки
              </Badge>
              <Badge variant="outline" className="text-xs bg-red-500/10 text-red-500 border-red-500/20">
                <XCircle className="size-3 mr-1" />
                Настройки системы
              </Badge>
            </div>
          </div>

          {/* Author Role */}
          <div className="p-4 rounded-lg border bg-card">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-purple-500/10">
                  <UserCheck className="size-4" />
                </div>
                <div>
                  <p className="font-medium">Автор</p>
                  <p className="text-sm text-muted-foreground">Создание и редактирование собственных статей</p>
                </div>
              </div>
              <Button variant="ghost" size="icon">
                <Edit className="size-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              <Badge variant="outline" className="text-xs bg-green-500/10 text-green-500 border-green-500/20">
                <CheckCircle className="size-3 mr-1" />
                Свои статьи
              </Badge>
              <Badge variant="outline" className="text-xs bg-green-500/10 text-green-500 border-green-500/20">
                <CheckCircle className="size-3 mr-1" />
                Загрузка медиа
              </Badge>
              <Badge variant="outline" className="text-xs bg-red-500/10 text-red-500 border-red-500/20">
                <XCircle className="size-3 mr-1" />
                Чужие статьи
              </Badge>
              <Badge variant="outline" className="text-xs bg-red-500/10 text-red-500 border-red-500/20">
                <XCircle className="size-3 mr-1" />
                Управление пользователями
              </Badge>
            </div>
          </div>

          <Button variant="outline" className="w-full">
            <Plus className="size-4 mr-2" />
            Создать новую роль
          </Button>
        </CardContent>
      </Card>

      {/* IP Access Control */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe2 className="size-5" />
            Контроль доступа по IP
          </CardTitle>
          <CardDescription>Белые и черные списки IP-адресов</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <Label>Заблокированные IP-адреса</Label>
            <div className="space-y-2">
              <div className="flex items-center justify-between p-3 rounded-lg border bg-muted/30">
                <div className="flex items-center gap-3">
                  <Ban className="size-4 text-red-500" />
                  <div>
                    <p className="text-sm font-medium font-mono">192.168.1.100</p>
                    <p className="text-xs text-muted-foreground">Добавлен 5 фев 2026</p>
                  </div>
                </div>
                <Button variant="ghost" size="icon">
                  <Trash2 className="size-4" />
                </Button>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg border bg-muted/30">
                <div className="flex items-center gap-3">
                  <Ban className="size-4 text-red-500" />
                  <div>
                    <p className="text-sm font-medium font-mono">10.0.0.55</p>
                    <p className="text-xs text-muted-foreground">Добавлен 3 фев 2026</p>
                  </div>
                </div>
                <Button variant="ghost" size="icon">
                  <Trash2 className="size-4" />
                </Button>
              </div>
            </div>
            <div className="flex gap-2">
              <Input placeholder="Введите IP-адрес..." />
              <Button>
                <Plus className="size-4 mr-2" />
                Добавить
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* API Access Tokens */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Key className="size-5" />
            API токены доступа
          </CardTitle>
          <CardDescription>Управление токенами для доступа к API</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between p-4 rounded-lg border bg-card">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <p className="font-medium text-sm">Основной токен</p>
                  <Badge variant="outline" className="text-xs bg-green-500/10 text-green-500 border-green-500/20">
                    Активен
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground mb-2">Создан 15 янв 2026 • Полный доступ</p>
                <code className="text-xs bg-muted px-2 py-1 rounded font-mono">
                  sk_live_••••••••••••••••••••••abc123
                </code>
              </div>
              <div className="flex gap-2">
                <Button variant="ghost" size="icon">
                  <Copy className="size-4" />
                </Button>
                <Button variant="ghost" size="icon">
                  <Trash2 className="size-4" />
                </Button>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 rounded-lg border bg-card">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <p className="font-medium text-sm">Токен только для чтения</p>
                  <Badge variant="outline" className="text-xs bg-green-500/10 text-green-500 border-green-500/20">
                    Активен
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground mb-2">Создан 20 янв 2026 • Только чтение</p>
                <code className="text-xs bg-muted px-2 py-1 rounded font-mono">
                  sk_live_••••••••••••••••••••••xyz789
                </code>
              </div>
              <div className="flex gap-2">
                <Button variant="ghost" size="icon">
                  <Copy className="size-4" />
                </Button>
                <Button variant="ghost" size="icon">
                  <Trash2 className="size-4" />
                </Button>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 rounded-lg border bg-card opacity-60">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <p className="font-medium text-sm">Тестовый токен (отозван)</p>
                  <Badge variant="outline" className="text-xs bg-red-500/10 text-red-500 border-red-500/20">
                    Неактивен
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground mb-2">Создан 10 янв 2026 • Отозван 25 янв 2026</p>
                <code className="text-xs bg-muted px-2 py-1 rounded font-mono">
                  sk_test_••••••••••••••••••••••test01
                </code>
              </div>
              <div className="flex gap-2">
                <Button variant="ghost" size="icon" disabled>
                  <Trash2 className="size-4" />
                </Button>
              </div>
            </div>
          </div>

          <Button variant="outline" className="w-full">
            <Plus className="size-4 mr-2" />
            Создать новый токен
          </Button>
        </CardContent>
      </Card>

      {/* Security Log */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="size-5" />
            Журнал безопасности
          </CardTitle>
          <CardDescription>Последние события безопасности</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-start gap-3 p-3 rounded-lg border bg-green-500/5 border-green-500/20">
              <CheckCircle className="size-4 text-green-500 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-medium">Успешный вход</p>
                <p className="text-xs text-muted-foreground">admin@example.com • 192.168.1.50 • 7 фев 2026, 14:32</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 rounded-lg border bg-blue-500/5 border-blue-500/20">
              <Key className="size-4 text-blue-500 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-medium">Создан новый API токен</p>
                <p className="text-xs text-muted-foreground">admin@example.com • 7 фев 2026, 12:15</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 rounded-lg border bg-yellow-500/5 border-yellow-500/20">
              <AlertCircle className="size-4 text-yellow-500 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-medium">Изменены права доступа</p>
                <p className="text-xs text-muted-foreground">admin@example.com изменил роль user@example.com • 6 фев 2026, 18:45</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 rounded-lg border bg-red-500/5 border-red-500/20">
              <XCircle className="size-4 text-red-500 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-medium">Неудачная попытка входа</p>
                <p className="text-xs text-muted-foreground">unknown@example.com • 10.0.0.55 • 6 фев 2026, 03:22</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 rounded-lg border bg-red-500/5 border-red-500/20">
              <Ban className="size-4 text-red-500 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-medium">IP-адрес зблокирован</p>
                <p className="text-xs text-muted-foreground">192.168.1.100 • Причина: множественные неудачные попытки • 5 фев 2026, 22:10</p>
              </div>
            </div>
          </div>

          <Button variant="outline" className="w-full mt-4">
            Посмотреть полный журнал
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

function ActivitySection() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight mb-2">Активность</h2>
        <p className="text-muted-foreground">
          История действий и логи пользователей
        </p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="size-5" />
            Журнал активности
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {users.slice(0, 5).map(user => (
              <div key={user.id} className="flex items-center gap-3 p-2 rounded-lg border">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="text-xs">{user.avatar}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <p className="text-sm font-medium">{user.name}</p>
                  <p className="text-xs text-muted-foreground">{user.lastActive}</p>
                </div>
                <CheckCircle className="h-4 w-4 text-green-500" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function SupportSection() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight mb-2">Служба поддержки</h2>
        <p className="text-muted-foreground">
          Обращения и запросы пользователей
        </p>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Открытых тикетов
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              В работе
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">5</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Решено сегодня
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">12</div>
          </CardContent>
        </Card>
      </div>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <HeadphonesIcon className="size-5" />
            Последние обращения
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Нет новых обращений</p>
        </CardContent>
      </Card>
    </div>
  );
}