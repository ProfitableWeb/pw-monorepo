import {
  Users,
  UsersRound,
  Send,
  MessageSquare,
  Ban,
  Shield,
  Key,
  Activity,
  HeadphonesIcon,
  Crown,
  PenTool,
  BookOpen,
  Eye,
} from 'lucide-react';
import type { User, NavigationItem } from './users.types';

export const users: User[] = [
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

export const roleLabels: Record<User['role'], string> = {
  admin: 'Администратор',
  editor: 'Редактор',
  author: 'Автор',
  viewer: 'Наблюдатель',
};

export const roleIcons: Record<User['role'], any> = {
  admin: Crown,
  editor: PenTool,
  author: BookOpen,
  viewer: Eye,
};

export const roleColors: Record<User['role'], string> = {
  admin: 'bg-red-500/10 text-red-500 border-red-500/20',
  editor: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
  author: 'bg-green-500/10 text-green-500 border-green-500/20',
  viewer: 'bg-gray-500/10 text-gray-500 border-gray-500/20',
};

export const statusLabels: Record<User['status'], string> = {
  active: 'Активен',
  inactive: 'Неактивен',
  invited: 'Приглашен',
};

export const statusColors: Record<User['status'], string> = {
  active: 'bg-green-500/10 text-green-500 border-green-500/20',
  inactive: 'bg-gray-500/10 text-gray-500 border-gray-500/20',
  invited: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
};

export const NAVIGATION_ITEMS: NavigationItem[] = [
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
