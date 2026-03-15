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
import type { UserBrief, UserStatus, NavigationItem } from './users.types';

export const roleLabels: Record<UserBrief['role'], string> = {
  admin: 'Администратор',
  editor: 'Редактор',
  author: 'Автор',
  viewer: 'Наблюдатель',
};

export const roleIcons: Record<UserBrief['role'], any> = {
  admin: Crown,
  editor: PenTool,
  author: BookOpen,
  viewer: Eye,
};

export const roleColors: Record<UserBrief['role'], string> = {
  admin: 'bg-red-500/10 text-red-500 border-red-500/20',
  editor: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
  author: 'bg-green-500/10 text-green-500 border-green-500/20',
  viewer: 'bg-gray-500/10 text-gray-500 border-gray-500/20',
};

export const statusLabels: Record<UserStatus, string> = {
  active: 'Активен',
  inactive: 'Неактивен',
};

export const statusColors: Record<UserStatus, string> = {
  active: 'bg-green-500/10 text-green-500 border-green-500/20',
  inactive: 'bg-gray-500/10 text-gray-500 border-gray-500/20',
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
