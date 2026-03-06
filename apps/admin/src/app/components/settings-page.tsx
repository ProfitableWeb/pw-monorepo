import { useEffect, useState, useRef } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Badge } from '@/app/components/ui/badge';
import { useHeaderStore } from '@/app/store/header-store';
import { useAuthStore } from '@/app/store/auth-store';
import {
  getProfile,
  updateProfile,
  uploadAvatar,
  deleteAvatar,
  setPassword,
  changePassword,
  getOAuthLinkUrl,
  unlinkOAuth,
  type UserProfile,
} from '@/lib/api-client';
import {
  Settings,
  Globe,
  Bell,
  Shield,
  Zap,
  Palette,
  Key,
  Sliders,
  LayoutDashboard,
  Search,
  ChevronRight,
  Save,
  X,
  Lock,
  Mail,
  Smartphone,
  Calendar,
  Eye,
  EyeOff,
  Type,
  Image as ImageIcon,
  Code,
  Webhook,
  Database,
  Languages,
  MapPin,
  Cog,
  User,
  Users,
  Rss,
  MessageSquare,
  Activity,
  BarChart3,
  LogIn,
  Paintbrush,
  Sparkles,
  Box,
  FileKey,
  Plus,
  TrendingUp,
  LayoutPanelTop,
  SearchCheck,
  ShieldCheck,
  ShieldAlert,
  UserCheck,
  Clock,
  Trash2,
  Edit,
  Copy,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Ban,
  Globe2,
  Camera,
  Loader2,
  Link,
  Unlink,
} from 'lucide-react';
import { cn } from '@/app/components/ui/utils';
import { Switch } from '@/app/components/ui/switch';
import { Label } from '@/app/components/ui/label';
import { FormField } from '@/app/components/ui/form-field';
import { ScrollArea } from '@/app/components/ui/scroll-area';
import { Separator } from '@/app/components/ui/separator';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/app/components/ui/select';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/app/components/ui/tabs';

interface SettingsCategory {
  id: string;
  label: string;
  icon: typeof Settings;
  sections?: {
    id: string;
    label: string;
  }[];
}

const settingsCategories: SettingsCategory[] = [
  {
    id: 'profile',
    label: 'Профиль',
    icon: User,
    sections: [
      { id: 'data', label: 'Данные' },
      { id: 'security', label: 'Безопасность' },
      { id: 'oauth', label: 'OAuth' },
    ],
  },
  {
    id: 'general',
    label: 'Общие',
    icon: Sliders,
    sections: [
      { id: 'basics', label: 'Основные' },
      { id: 'regional', label: 'Региональные' },
      { id: 'localization', label: 'Локализация' },
    ],
  },
  {
    id: 'blog',
    label: 'Блог',
    icon: Globe,
    sections: [
      { id: 'publishing', label: 'Публикация' },
      { id: 'comments', label: 'Комментарии' },
      { id: 'rss', label: 'RSS и подписки' },
    ],
  },
  {
    id: 'security',
    label: 'Безопасность',
    icon: Shield,
    sections: [
      { id: 'authentication', label: 'Аутентификация' },
      { id: 'password', label: 'Пароль' },
      { id: 'sessions', label: 'Сессии' },
      { id: 'access-control', label: 'Настройка доступа' },
    ],
  },
  {
    id: 'notifications',
    label: 'Уведомления',
    icon: Bell,
    sections: [
      { id: 'email', label: 'Email' },
      { id: 'push', label: 'Push' },
      { id: 'digest', label: 'Дайджесты' },
    ],
  },
  {
    id: 'integrations',
    label: 'Интеграции',
    icon: Zap,
    sections: [
      { id: 'services', label: 'Внешние сервисы' },
      { id: 'api-keys', label: 'API ключи' },
      { id: 'webhooks', label: 'Webhooks' },
    ],
  },
  {
    id: 'appearance',
    label: 'Внешний вид',
    icon: Palette,
    sections: [
      { id: 'theme', label: 'Тема' },
      { id: 'branding', label: 'Брендинг' },
      { id: 'customization', label: 'Кастомизация' },
    ],
  },
  {
    id: 'developers',
    label: 'Разработчики',
    icon: Key,
    sections: [
      { id: 'api', label: 'API' },
      { id: 'oauth', label: 'OAuth приложения' },
      { id: 'advanced', label: 'Расширенные' },
    ],
  },
];

export function SettingsPage() {
  const { setBreadcrumbs, reset } = useHeaderStore();
  const [activeCategory, setActiveCategory] = useState('profile');
  const [searchQuery, setSearchQuery] = useState('');
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

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
        ],
      },
      { label: 'Настройки', icon: Settings },
    ]);

    return () => reset();
  }, [setBreadcrumbs, reset]);

  const renderCategoryContent = () => {
    switch (activeCategory) {
      case 'profile':
        return <ProfileSettings />;
      case 'general':
        return (
          <GeneralSettings
            onChangeDetected={() => setHasUnsavedChanges(true)}
          />
        );
      case 'blog':
        return (
          <BlogSettings onChangeDetected={() => setHasUnsavedChanges(true)} />
        );
      case 'security':
        return (
          <SecuritySettings
            onChangeDetected={() => setHasUnsavedChanges(true)}
          />
        );
      case 'notifications':
        return (
          <NotificationSettings
            onChangeDetected={() => setHasUnsavedChanges(true)}
          />
        );
      case 'integrations':
        return (
          <IntegrationSettings
            onChangeDetected={() => setHasUnsavedChanges(true)}
          />
        );
      case 'appearance':
        return (
          <AppearanceSettings
            onChangeDetected={() => setHasUnsavedChanges(true)}
          />
        );
      case 'developers':
        return (
          <DeveloperSettings
            onChangeDetected={() => setHasUnsavedChanges(true)}
          />
        );
      default:
        return null;
    }
  };

  const handleSave = () => {
    // Save logic here
    setHasUnsavedChanges(false);
  };

  const handleCancel = () => {
    setHasUnsavedChanges(false);
  };

  return (
    <div className='flex h-full overflow-hidden'>
      {/* Sidebar Navigation */}
      <aside className='w-64 border-r bg-card flex-shrink-0 flex flex-col'>
        <div className='p-4 border-b flex-shrink-0'>
          <div className='relative'>
            <Search className='absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground' />
            <Input
              placeholder='Поиск настроек...'
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className='pl-9'
            />
          </div>
        </div>
        <ScrollArea className='flex-1 min-h-0'>
          <nav className='p-2'>
            {settingsCategories.map(category => {
              const Icon = category.icon;
              const isActive = activeCategory === category.id;

              return (
                <button
                  key={category.id}
                  onClick={() => setActiveCategory(category.id)}
                  className={cn(
                    'w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors mb-1',
                    isActive
                      ? 'bg-accent text-accent-foreground font-medium'
                      : 'text-muted-foreground hover:bg-accent/50 hover:text-accent-foreground'
                  )}
                >
                  <Icon className='size-4 flex-shrink-0' />
                  <span className='flex-1 text-left'>{category.label}</span>
                  <ChevronRight
                    className={cn(
                      'size-4 transition-transform flex-shrink-0',
                      isActive && 'rotate-90'
                    )}
                  />
                </button>
              );
            })}
          </nav>
        </ScrollArea>
      </aside>

      {/* Main Content Area */}
      <div className='flex-1 flex flex-col min-w-0 min-h-0'>
        <ScrollArea className='flex-1 min-h-0'>
          <div className='max-w-4xl mx-auto p-6 pb-24'>
            {renderCategoryContent()}
          </div>
        </ScrollArea>

        {/* Fixed Action Bar */}
        {hasUnsavedChanges && (
          <div className='border-t bg-card p-4 flex items-center justify-between flex-shrink-0'>
            <p className='text-sm text-muted-foreground'>
              У вас есть несохраненные изменения
            </p>
            <div className='flex gap-2'>
              <Button variant='outline' size='sm' onClick={handleCancel}>
                <X className='size-4 mr-2' />
                Отменить
              </Button>
              <Button size='sm' onClick={handleSave}>
                <Save className='size-4 mr-2' />
                Сохранить изменения
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Password input с toggle видимости
function PasswordInput(
  props: React.InputHTMLAttributes<HTMLInputElement> & { className?: string }
) {
  const [visible, setVisible] = useState(false);
  return (
    <div className='relative'>
      <Input
        {...props}
        type={visible ? 'text' : 'password'}
        autoComplete='new-password'
        className={cn('pr-10', props.className)}
      />
      <button
        type='button'
        className='absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-accent transition-colors'
        onClick={() => setVisible(v => !v)}
        aria-label={visible ? 'Скрыть пароль' : 'Показать пароль'}
        tabIndex={-1}
      >
        {visible ? <EyeOff className='size-4' /> : <Eye className='size-4' />}
      </button>
    </div>
  );
}

// Profile Settings Component (PW-034)
function ProfileSettings() {
  const { user, updateUser } = useAuthStore();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  // Данные профиля
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [bio, setBio] = useState('');
  const [links, setLinks] = useState<string[]>([]);
  const [savingProfile, setSavingProfile] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [emailVerificationSent, setEmailVerificationSent] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const MAX_LINKS = 5;

  // Пароль — установка
  const [newPass, setNewPass] = useState('');
  const [confirmPass, setConfirmPass] = useState('');

  // Пароль — смена
  const [oldPass, setOldPass] = useState('');
  const [newPassChange, setNewPassChange] = useState('');
  const [confirmPassChange, setConfirmPassChange] = useState('');
  const [savingPassword, setSavingPassword] = useState(false);

  // OAuth
  const [linkingProvider, setLinkingProvider] = useState<string | null>(null);
  const [unlinkingProvider, setUnlinkingProvider] = useState<string | null>(
    null
  );

  useEffect(() => {
    getProfile()
      .then(p => {
        setProfile(p);
        if (p) {
          setName(p.name);
          setEmail(p.email);
          setBio(p.bio || '');
          setLinks(p.links || []);
        }
      })
      .finally(() => setLoading(false));
  }, []);

  const emailChanged = email !== (profile?.email || '');
  const hasProfileChanges =
    name !== (profile?.name || '') ||
    bio !== (profile?.bio || '') ||
    JSON.stringify(links) !== JSON.stringify(profile?.links || []);

  const handleSaveProfile = async () => {
    setSavingProfile(true);
    try {
      const updates: { name?: string; bio?: string; links?: string[] } = {};
      if (name !== profile?.name) updates.name = name;
      if (bio !== (profile?.bio || '')) updates.bio = bio;
      const filteredLinks = links.filter(l => l.trim() !== '');
      if (
        JSON.stringify(filteredLinks) !== JSON.stringify(profile?.links || [])
      )
        updates.links = filteredLinks;
      const result = await updateProfile(updates);
      setProfile(result);
      updateUser({ name: result.name, email: result.email });
    } catch (error) {
      console.error('Profile update error:', error);
    } finally {
      setSavingProfile(false);
    }
  };

  const handleEmailChange = async () => {
    // TODO: POST /users/me/email/change { new_email: email }
    setEmailVerificationSent(true);
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const result = await uploadAvatar(file);
      setProfile(result);
      updateUser({ avatar: result.avatar });
    } catch (error) {
      console.error('Avatar upload error:', error);
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleDeleteAvatar = async () => {
    setUploading(true);
    try {
      const result = await deleteAvatar();
      setProfile(result);
      updateUser({ avatar: undefined });
    } catch (error) {
      console.error('Avatar delete error:', error);
    } finally {
      setUploading(false);
    }
  };

  const handleSetPassword = async () => {
    if (newPass !== confirmPass || newPass.length < 8) return;
    setSavingPassword(true);
    try {
      const result = await setPassword(newPass);
      setProfile(result);
      setNewPass('');
      setConfirmPass('');
    } catch (error) {
      console.error('Set password error:', error);
    } finally {
      setSavingPassword(false);
    }
  };

  const handleChangePassword = async () => {
    if (newPassChange !== confirmPassChange || newPassChange.length < 8) return;
    setSavingPassword(true);
    try {
      const result = await changePassword(oldPass, newPassChange);
      setProfile(result);
      setOldPass('');
      setNewPassChange('');
      setConfirmPassChange('');
    } catch (error) {
      console.error('Change password error:', error);
    } finally {
      setSavingPassword(false);
    }
  };

  const OAUTH_PROVIDERS = ['google', 'yandex', 'telegram'] as const;
  const providerLabels: Record<string, string> = {
    google: 'Google',
    yandex: 'Яндекс',
    telegram: 'Telegram',
  };

  const handleLinkProvider = async (provider: string) => {
    setLinkingProvider(provider);
    try {
      const url = await getOAuthLinkUrl(provider);
      window.location.href = url;
    } catch (error) {
      console.error('OAuth link error:', error);
      setLinkingProvider(null);
    }
  };

  const handleUnlinkProvider = async (provider: string) => {
    setUnlinkingProvider(provider);
    try {
      const result = await unlinkOAuth(provider);
      setProfile(result);
    } catch (error) {
      console.error('OAuth unlink error:', error);
    } finally {
      setUnlinkingProvider(null);
    }
  };

  if (loading) {
    return (
      <div className='flex items-center justify-center py-12'>
        <Loader2 className='size-6 animate-spin text-muted-foreground' />
      </div>
    );
  }

  return (
    <div className='space-y-6'>
      <div>
        <h2 className='text-2xl font-semibold tracking-tight mb-2'>Профиль</h2>
        <p className='text-muted-foreground'>
          Управление личными данными и безопасностью
        </p>
      </div>

      <Tabs defaultValue='data' className='w-full'>
        <TabsList>
          <TabsTrigger value='data'>Данные</TabsTrigger>
          <TabsTrigger value='security'>Безопасность</TabsTrigger>
          <TabsTrigger value='oauth'>OAuth</TabsTrigger>
        </TabsList>

        <TabsContent value='data' className='space-y-6 mt-6'>
          {/* Аватар */}
          <Card>
            <CardHeader>
              <CardTitle className='text-lg flex items-center gap-2'>
                <Camera className='size-4' />
                Аватар
              </CardTitle>
              <CardDescription>Фото профиля</CardDescription>
            </CardHeader>
            <CardContent>
              <div className='flex items-center gap-6'>
                <div className='relative size-20 rounded-full overflow-hidden bg-muted flex-shrink-0'>
                  {user?.avatar ? (
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className='size-full object-cover'
                    />
                  ) : (
                    <div className='size-full flex items-center justify-center text-2xl font-medium text-muted-foreground'>
                      {user?.name?.charAt(0)?.toUpperCase() || '?'}
                    </div>
                  )}
                </div>
                <div className='flex gap-2'>
                  <input
                    ref={fileInputRef}
                    type='file'
                    accept='image/jpeg,image/png,image/gif,image/webp'
                    className='hidden'
                    onChange={handleAvatarUpload}
                  />
                  <Button
                    variant='outline'
                    size='sm'
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploading}
                  >
                    {uploading ? (
                      <>
                        <Loader2 className='size-4 mr-2 animate-spin' />{' '}
                        Загрузка...
                      </>
                    ) : (
                      'Изменить'
                    )}
                  </Button>
                  {user?.avatar && (
                    <Button
                      variant='outline'
                      size='sm'
                      onClick={handleDeleteAvatar}
                      disabled={uploading}
                    >
                      Удалить
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Имя и Email */}
          <Card>
            <CardHeader>
              <CardTitle className='text-lg flex items-center gap-2'>
                <User className='size-4' />
                Личные данные
              </CardTitle>
              <CardDescription>Имя и email</CardDescription>
            </CardHeader>
            <CardContent className='space-y-4'>
              <FormField label='Имя' htmlFor='profile-name'>
                <Input
                  id='profile-name'
                  value={name}
                  onChange={e => setName(e.target.value)}
                />
              </FormField>
              <FormField
                label='Email'
                htmlFor='profile-email'
                description={
                  emailChanged
                    ? emailVerificationSent
                      ? undefined
                      : 'Для смены email отправим письмо с подтверждением'
                    : undefined
                }
              >
                <Input
                  id='profile-email'
                  type='email'
                  value={email}
                  onChange={e => {
                    setEmail(e.target.value);
                    setEmailVerificationSent(false);
                  }}
                />
                {emailChanged && (
                  <p className='pl-1 text-xs text-muted-foreground'>
                    {emailVerificationSent ? (
                      <span className='text-green-500'>
                        ✓ Письмо отправлено на {email}
                      </span>
                    ) : (
                      <button
                        type='button'
                        className='text-primary underline underline-offset-2 hover:opacity-80'
                        onClick={handleEmailChange}
                      >
                        Отправить
                      </button>
                    )}
                  </p>
                )}
              </FormField>
              <FormField label='О себе' htmlFor='profile-bio'>
                <textarea
                  id='profile-bio'
                  className='flex min-h-[80px] max-h-[200px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-vertical'
                  placeholder='Расскажите немного о себе...'
                  value={bio}
                  onChange={e => setBio(e.target.value)}
                  maxLength={300}
                  rows={3}
                />
                <p className='text-xs text-muted-foreground text-right'>
                  {bio.length}/300
                </p>
              </FormField>
              <FormField label='Ссылки'>
                <div className='space-y-2'>
                  {links.map((link, index) => (
                    <div key={index} className='flex gap-2'>
                      <Input
                        placeholder='https://...'
                        value={link}
                        onChange={e => {
                          const updated = [...links];
                          updated[index] = e.target.value;
                          setLinks(updated);
                        }}
                      />
                      <Button
                        variant='ghost'
                        size='icon'
                        onClick={() =>
                          setLinks(links.filter((_, i) => i !== index))
                        }
                      >
                        <Trash2 className='size-4' />
                      </Button>
                    </div>
                  ))}
                  {links.length < MAX_LINKS && (
                    <Button
                      variant='outline'
                      size='sm'
                      onClick={() => setLinks([...links, ''])}
                    >
                      <Plus className='size-4 mr-2' />
                      Добавить ссылку
                    </Button>
                  )}
                </div>
              </FormField>
              {hasProfileChanges && (
                <div className='flex gap-2 pt-2'>
                  <Button
                    size='sm'
                    onClick={handleSaveProfile}
                    disabled={savingProfile}
                  >
                    {savingProfile ? (
                      <>
                        <Loader2 className='size-4 mr-2 animate-spin' />{' '}
                        Сохранение...
                      </>
                    ) : (
                      <>
                        <Save className='size-4 mr-2' /> Сохранить
                      </>
                    )}
                  </Button>
                  <Button
                    variant='outline'
                    size='sm'
                    onClick={() => {
                      setName(profile?.name || '');
                      setEmail(profile?.email || '');
                      setEmailVerificationSent(false);
                      setBio(profile?.bio || '');
                      setLinks(profile?.links || []);
                    }}
                    disabled={savingProfile}
                  >
                    Отмена
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value='security' className='space-y-6 mt-6'>
          {profile && !profile.hasPassword && (
            <Card>
              <CardHeader>
                <CardTitle className='text-lg flex items-center gap-2'>
                  <Lock className='size-4' />
                  Установить пароль
                </CardTitle>
                <CardDescription>
                  Вы вошли через OAuth. Установите пароль для входа по email.
                </CardDescription>
              </CardHeader>
              <CardContent className='space-y-4'>
                <div className='space-y-2'>
                  <Label htmlFor='new-password'>Новый пароль</Label>
                  <PasswordInput
                    id='new-password'
                    placeholder='Минимум 8 символов'
                    value={newPass}
                    onChange={e => setNewPass(e.target.value)}
                  />
                </div>
                <div className='space-y-2'>
                  <Label htmlFor='confirm-password'>Подтвердите пароль</Label>
                  <PasswordInput
                    id='confirm-password'
                    placeholder='Повторите пароль'
                    value={confirmPass}
                    onChange={e => setConfirmPass(e.target.value)}
                  />
                </div>
                {newPass && confirmPass && newPass !== confirmPass && (
                  <p className='text-sm text-destructive'>
                    Пароли не совпадают
                  </p>
                )}
                <Button
                  size='sm'
                  onClick={handleSetPassword}
                  disabled={
                    savingPassword ||
                    !newPass ||
                    !confirmPass ||
                    newPass !== confirmPass ||
                    newPass.length < 8
                  }
                >
                  {savingPassword ? (
                    <>
                      <Loader2 className='size-4 mr-2 animate-spin' />{' '}
                      Сохранение...
                    </>
                  ) : (
                    'Установить пароль'
                  )}
                </Button>
              </CardContent>
            </Card>
          )}

          {profile && profile.hasPassword && (
            <Card>
              <CardHeader>
                <CardTitle className='text-lg flex items-center gap-2'>
                  <Lock className='size-4' />
                  Сменить пароль
                </CardTitle>
              </CardHeader>
              <CardContent className='space-y-4'>
                <div className='space-y-2'>
                  <Label htmlFor='old-password'>Текущий пароль</Label>
                  <PasswordInput
                    id='old-password'
                    value={oldPass}
                    onChange={e => setOldPass(e.target.value)}
                  />
                </div>
                <div className='space-y-2'>
                  <Label htmlFor='new-password-change'>Новый пароль</Label>
                  <PasswordInput
                    id='new-password-change'
                    placeholder='Минимум 8 символов'
                    value={newPassChange}
                    onChange={e => setNewPassChange(e.target.value)}
                  />
                </div>
                <div className='space-y-2'>
                  <Label htmlFor='confirm-password-change'>
                    Подтвердите новый пароль
                  </Label>
                  <PasswordInput
                    id='confirm-password-change'
                    value={confirmPassChange}
                    onChange={e => setConfirmPassChange(e.target.value)}
                  />
                </div>
                {newPassChange &&
                  confirmPassChange &&
                  newPassChange !== confirmPassChange && (
                    <p className='text-sm text-destructive'>
                      Пароли не совпадают
                    </p>
                  )}
                <Button
                  size='sm'
                  onClick={handleChangePassword}
                  disabled={
                    savingPassword ||
                    !oldPass ||
                    !newPassChange ||
                    !confirmPassChange ||
                    newPassChange !== confirmPassChange ||
                    newPassChange.length < 8
                  }
                >
                  {savingPassword ? (
                    <>
                      <Loader2 className='size-4 mr-2 animate-spin' />{' '}
                      Сохранение...
                    </>
                  ) : (
                    'Сменить пароль'
                  )}
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value='oauth' className='space-y-6 mt-6'>
          <Card>
            <CardHeader>
              <CardTitle className='text-lg flex items-center gap-2'>
                <LogIn className='size-4' />
                Привязанные аккаунты
              </CardTitle>
              <CardDescription>
                Подключите социальные сети для быстрого входа
              </CardDescription>
            </CardHeader>
            <CardContent className='space-y-3'>
              {OAUTH_PROVIDERS.map(provider => {
                const isConnected = profile?.oauthProviders?.includes(provider);
                const isLinking = linkingProvider === provider;
                const isUnlinking = unlinkingProvider === provider;
                return (
                  <div
                    key={provider}
                    className={cn(
                      'flex items-center justify-between p-3 rounded-lg border',
                      isConnected && 'bg-muted/40'
                    )}
                  >
                    <div className='flex items-center gap-3'>
                      <span className='text-sm font-medium'>
                        {providerLabels[provider]}
                      </span>
                      {isConnected && (
                        <Badge variant='secondary' className='text-xs'>
                          <span className='size-2 rounded-full bg-green-500 mr-1.5 inline-block' />
                          Подключён
                        </Badge>
                      )}
                    </div>
                    {isConnected ? (
                      <Button
                        variant='outline'
                        size='sm'
                        onClick={() => handleUnlinkProvider(provider)}
                        disabled={isUnlinking}
                      >
                        {isUnlinking ? (
                          <Loader2 className='size-4 mr-2 animate-spin' />
                        ) : (
                          <Unlink className='size-4 mr-2' />
                        )}
                        Отключить
                      </Button>
                    ) : (
                      <Button
                        variant='outline'
                        size='sm'
                        onClick={() => handleLinkProvider(provider)}
                        disabled={isLinking}
                      >
                        {isLinking ? (
                          <Loader2 className='size-4 mr-2 animate-spin' />
                        ) : (
                          <Link className='size-4 mr-2' />
                        )}
                        Подключить
                      </Button>
                    )}
                  </div>
                );
              })}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

// General Settings Component
function GeneralSettings({
  onChangeDetected,
}: {
  onChangeDetected: () => void;
}) {
  return (
    <div className='space-y-6'>
      <div>
        <h2 className='text-2xl font-semibold tracking-tight mb-2'>
          Общие настройки
        </h2>
        <p className='text-muted-foreground'>
          Основные параметры и конфигурация блога
        </p>
      </div>

      <Tabs defaultValue='basics' className='w-full'>
        <TabsList>
          <TabsTrigger value='basics'>Основные</TabsTrigger>
          <TabsTrigger value='regional'>Региональные</TabsTrigger>
          <TabsTrigger value='localization'>Локализация</TabsTrigger>
        </TabsList>

        <TabsContent value='basics' className='space-y-6 mt-6'>
          <Card>
            <CardHeader>
              <CardTitle className='text-lg'>Информация о блоге</CardTitle>
              <CardDescription>Основные данные вашего издания</CardDescription>
            </CardHeader>
            <CardContent className='space-y-4'>
              <div className='space-y-2'>
                <Label htmlFor='blog-name'>Название блога</Label>
                <Input
                  id='blog-name'
                  defaultValue='BlogDash'
                  onChange={onChangeDetected}
                />
              </div>
              <div className='space-y-2'>
                <Label htmlFor='blog-description'>Описание</Label>
                <Input
                  id='blog-description'
                  defaultValue='Современное издание о технологиях и разработке'
                  onChange={onChangeDetected}
                />
              </div>
              <div className='space-y-2'>
                <Label htmlFor='blog-url'>URL блога</Label>
                <Input
                  id='blog-url'
                  defaultValue='https://blogdash.example.com'
                  onChange={onChangeDetected}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className='text-lg flex items-center gap-2'>
                <Globe className='size-4' />
                Доступ и видимость
              </CardTitle>
            </CardHeader>
            <CardContent className='space-y-4'>
              <SettingRow
                icon={Eye}
                label='Публичный доступ'
                description='Блог доступен всем пользователям интернета'
                defaultChecked={true}
                onChange={onChangeDetected}
              />
              <Separator />
              <SettingRow
                icon={Users}
                label='Регистрация читателей'
                description='Разрешить пользователям создавать аккаунты'
                defaultChecked={true}
                onChange={onChangeDetected}
              />
              <Separator />
              <SettingRow
                icon={Search}
                label='Индексация поисковиками'
                description='Разрешить поисковым сисемам индексировать контент'
                defaultChecked={true}
                onChange={onChangeDetected}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value='regional' className='space-y-6 mt-6'>
          <Card>
            <CardHeader>
              <CardTitle className='text-lg flex items-center gap-2'>
                <MapPin className='size-4' />
                Региональные настройки
              </CardTitle>
              <CardDescription>
                Часовой пояс и региональные параметры
              </CardDescription>
            </CardHeader>
            <CardContent className='space-y-4'>
              <div className='space-y-2'>
                <Label htmlFor='timezone'>Часовой пояс</Label>
                <Select
                  defaultValue='europe-moscow'
                  onValueChange={onChangeDetected}
                >
                  <SelectTrigger id='timezone'>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='europe-moscow'>
                      Москва (GMT+3)
                    </SelectItem>
                    <SelectItem value='europe-london'>
                      Лондон (GMT+0)
                    </SelectItem>
                    <SelectItem value='america-new-york'>
                      Нью-Йорк (GMT-5)
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className='space-y-2'>
                <Label htmlFor='date-format'>Формат даты</Label>
                <Select
                  defaultValue='dd-mm-yyyy'
                  onValueChange={onChangeDetected}
                >
                  <SelectTrigger id='date-format'>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='dd-mm-yyyy'>ДД.ММ.ГГГГ</SelectItem>
                    <SelectItem value='mm-dd-yyyy'>MM/DD/YYYY</SelectItem>
                    <SelectItem value='yyyy-mm-dd'>YYYY-MM-DD</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className='space-y-2'>
                <Label htmlFor='time-format'>Формат времени</Label>
                <Select defaultValue='24h' onValueChange={onChangeDetected}>
                  <SelectTrigger id='time-format'>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='24h'>24-часовой</SelectItem>
                    <SelectItem value='12h'>12-часовой (AM/PM)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value='localization' className='space-y-6 mt-6'>
          <Card>
            <CardHeader>
              <CardTitle className='text-lg flex items-center gap-2'>
                <Languages className='size-4' />
                Язык и локализация
              </CardTitle>
            </CardHeader>
            <CardContent className='space-y-4'>
              <div className='space-y-2'>
                <Label htmlFor='language'>Язык интерфейса</Label>
                <Select defaultValue='ru' onValueChange={onChangeDetected}>
                  <SelectTrigger id='language'>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='ru'>Русский</SelectItem>
                    <SelectItem value='en'>English</SelectItem>
                    <SelectItem value='es'>Español</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Separator />
              <SettingRow
                icon={Languages}
                label='Мультиязычность'
                description='Включить поддержку нескольких языков для контента'
                defaultChecked={false}
                onChange={onChangeDetected}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

// Blog Settings Component
function BlogSettings({ onChangeDetected }: { onChangeDetected: () => void }) {
  return (
    <div className='space-y-6'>
      <div>
        <h2 className='text-2xl font-semibold tracking-tight mb-2'>
          Настройки блога
        </h2>
        <p className='text-muted-foreground'>
          Управление публикациями и взаимодействием с читателями
        </p>
      </div>

      <Tabs defaultValue='publishing' className='w-full'>
        <TabsList>
          <TabsTrigger value='publishing'>Публикация</TabsTrigger>
          <TabsTrigger value='comments'>Комментарии</TabsTrigger>
          <TabsTrigger value='rss'>RSS</TabsTrigger>
        </TabsList>

        <TabsContent value='publishing' className='space-y-6 mt-6'>
          <Card>
            <CardHeader>
              <CardTitle className='text-lg'>Параметры публикации</CardTitle>
            </CardHeader>
            <CardContent className='space-y-4'>
              <SettingRow
                icon={Eye}
                label='Автопубликация'
                description='Автоматически публиковать статьи по расписанию'
                defaultChecked={true}
                onChange={onChangeDetected}
              />
              <Separator />
              <SettingRow
                icon={Clock}
                label='Показывать дату изменения'
                description='Отображать дату последнего обновления статьи'
                defaultChecked={true}
                onChange={onChangeDetected}
              />
              <Separator />
              <SettingRow
                icon={Users}
                label='Показывать автора'
                description='Отображать информацию об авторе в статье'
                defaultChecked={true}
                onChange={onChangeDetected}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className='text-lg'>Формат контента</CardTitle>
            </CardHeader>
            <CardContent className='space-y-4'>
              <div className='space-y-2'>
                <Label htmlFor='excerpt-length'>Длина анонса (символов)</Label>
                <Input
                  id='excerpt-length'
                  type='number'
                  defaultValue='160'
                  onChange={onChangeDetected}
                />
              </div>
              <div className='space-y-2'>
                <Label htmlFor='posts-per-page'>Статей на странице</Label>
                <Input
                  id='posts-per-page'
                  type='number'
                  defaultValue='10'
                  onChange={onChangeDetected}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value='comments' className='space-y-6 mt-6'>
          <Card>
            <CardHeader>
              <CardTitle className='text-lg flex items-center gap-2'>
                <MessageSquare className='size-4' />
                Комментарии
              </CardTitle>
            </CardHeader>
            <CardContent className='space-y-4'>
              <SettingRow
                icon={MessageSquare}
                label='Разрешить комментарии'
                description='Пользователи могут комментировать статьи'
                defaultChecked={true}
                onChange={onChangeDetected}
              />
              <Separator />
              <SettingRow
                icon={Shield}
                label='Модерация комментариев'
                description='Требовать одобрение перед публикацией'
                defaultChecked={true}
                onChange={onChangeDetected}
              />
              <Separator />
              <SettingRow
                icon={Lock}
                label='Комментарии только для авторизованных'
                description='Разреить комментировать только зарегистрированным пользователям'
                defaultChecked={false}
                onChange={onChangeDetected}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value='rss' className='space-y-6 mt-6'>
          <Card>
            <CardHeader>
              <CardTitle className='text-lg flex items-center gap-2'>
                <Rss className='size-4' />
                RSS лента
              </CardTitle>
            </CardHeader>
            <CardContent className='space-y-4'>
              <SettingRow
                icon={Rss}
                label='Включить RSS'
                description='Разрешить подписку через RSS'
                defaultChecked={true}
                onChange={onChangeDetected}
              />
              <Separator />
              <div className='space-y-2'>
                <Label htmlFor='rss-items'>Статей в ленте</Label>
                <Input
                  id='rss-items'
                  type='number'
                  defaultValue='20'
                  onChange={onChangeDetected}
                />
              </div>
              <Separator />
              <SettingRow
                icon={Type}
                label='Полный текст в RSS'
                description='Включать полный текст статьи вместо анонса'
                defaultChecked={false}
                onChange={onChangeDetected}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

// Security Settings Component
function SecuritySettings({
  onChangeDetected,
}: {
  onChangeDetected: () => void;
}) {
  return (
    <div className='space-y-6'>
      <div>
        <h2 className='text-2xl font-semibold tracking-tight mb-2'>
          Безопасность
        </h2>
        <p className='text-muted-foreground'>
          Параметры защиты и контроля доступа
        </p>
      </div>

      <Tabs defaultValue='authentication' className='w-full'>
        <TabsList>
          <TabsTrigger value='authentication'>Аутентификация</TabsTrigger>
          <TabsTrigger value='password'>Пароль</TabsTrigger>
          <TabsTrigger value='sessions'>Сессии</TabsTrigger>
          <TabsTrigger value='access-control'>Настройка доступа</TabsTrigger>
        </TabsList>

        <TabsContent value='authentication' className='space-y-6 mt-6'>
          <Card>
            <CardHeader>
              <CardTitle className='text-lg flex items-center gap-2'>
                <Shield className='size-4' />
                Двухфакторная аутентификация
              </CardTitle>
            </CardHeader>
            <CardContent className='space-y-4'>
              <SettingRow
                icon={Smartphone}
                label='2FA через приложение'
                description='Использовать приложение-аутентификатор'
                defaultChecked={false}
                onChange={onChangeDetected}
              />
              <Separator />
              <SettingRow
                icon={Mail}
                label='2FA через email'
                description='Отправлять код подтвеждения на почту'
                defaultChecked={false}
                onChange={onChangeDetected}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className='text-lg flex items-center gap-2'>
                <LogIn className='size-4' />
                Безопасность входа
              </CardTitle>
            </CardHeader>
            <CardContent className='space-y-4'>
              <SettingRow
                icon={Activity}
                label='История входов'
                description='Отслеживать попытки входа в систему'
                defaultChecked={true}
                onChange={onChangeDetected}
              />
              <Separator />
              <SettingRow
                icon={Mail}
                label='Уведомления о новых входах'
                description='Email при входе с нового устройства'
                defaultChecked={true}
                onChange={onChangeDetected}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value='password' className='space-y-6 mt-6'>
          <Card>
            <CardHeader>
              <CardTitle className='text-lg'>Требования к паролю</CardTitle>
            </CardHeader>
            <CardContent className='space-y-4'>
              <div className='space-y-2'>
                <Label htmlFor='min-password-length'>
                  Минимальная длина пароля
                </Label>
                <Input
                  id='min-password-length'
                  type='number'
                  defaultValue='8'
                  onChange={onChangeDetected}
                />
              </div>
              <Separator />
              <SettingRow
                icon={Key}
                label='Требовать специальные символы'
                description='Пароль должен содержать спецсимволы'
                defaultChecked={true}
                onChange={onChangeDetected}
              />
              <Separator />
              <SettingRow
                icon={Key}
                label='Требовать цифры'
                description='Пароль должен содержать цифры'
                defaultChecked={true}
                onChange={onChangeDetected}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value='sessions' className='space-y-6 mt-6'>
          <Card>
            <CardHeader>
              <CardTitle className='text-lg flex items-center gap-2'>
                <Clock className='size-4' />
                Управление сессиями
              </CardTitle>
            </CardHeader>
            <CardContent className='space-y-4'>
              <SettingRow
                icon={Clock}
                label='Автовыход при неакивности'
                description='Выход после 30 минут неактивности'
                defaultChecked={true}
                onChange={onChangeDetected}
              />
              <Separator />
              <div className='space-y-2'>
                <Label htmlFor='session-duration'>
                  Длительность сессии (дней)
                </Label>
                <Input
                  id='session-duration'
                  type='number'
                  defaultValue='30'
                  onChange={onChangeDetected}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value='access-control' className='space-y-6 mt-6'>
          {/* Roles and Permissions */}
          <Card>
            <CardHeader>
              <CardTitle className='text-lg flex items-center gap-2'>
                <ShieldCheck className='size-4' />
                Роли и разрешения
              </CardTitle>
              <CardDescription>
                Управление ролями пользователей и их правами доступа
              </CardDescription>
            </CardHeader>
            <CardContent className='space-y-4'>
              {/* Administrator Role */}
              <div className='p-4 rounded-lg border bg-card'>
                <div className='flex items-start justify-between mb-3'>
                  <div className='flex items-start gap-3'>
                    <div className='p-2 rounded-lg bg-red-500/10'>
                      <ShieldAlert className='size-4 text-red-500' />
                    </div>
                    <div>
                      <p className='font-medium'>Администратор</p>
                      <p className='text-sm text-muted-foreground'>
                        Полный доступ ко всем функциям системы
                      </p>
                    </div>
                  </div>
                  <Button variant='ghost' size='icon'>
                    <Edit className='size-4' />
                  </Button>
                </div>
                <div className='flex flex-wrap gap-2'>
                  <Badge
                    variant='outline'
                    className='text-xs bg-green-500/10 text-green-500 border-green-500/20'
                  >
                    <CheckCircle className='size-3 mr-1' />
                    Управление пользователями
                  </Badge>
                  <Badge
                    variant='outline'
                    className='text-xs bg-green-500/10 text-green-500 border-green-500/20'
                  >
                    <CheckCircle className='size-3 mr-1' />
                    Настройки системы
                  </Badge>
                  <Badge
                    variant='outline'
                    className='text-xs bg-green-500/10 text-green-500 border-green-500/20'
                  >
                    <CheckCircle className='size-3 mr-1' />
                    Все разделы
                  </Badge>
                </div>
              </div>

              {/* Editor Role */}
              <div className='p-4 rounded-lg border bg-card'>
                <div className='flex items-start justify-between mb-3'>
                  <div className='flex items-start gap-3'>
                    <div className='p-2 rounded-lg bg-blue-500/10'>
                      <ShieldCheck className='size-4 text-blue-500' />
                    </div>
                    <div>
                      <p className='font-medium'>Редактор</p>
                      <p className='text-sm text-muted-foreground'>
                        Управление контентом и публикациями
                      </p>
                    </div>
                  </div>
                  <Button variant='ghost' size='icon'>
                    <Edit className='size-4' />
                  </Button>
                </div>
                <div className='flex flex-wrap gap-2'>
                  <Badge
                    variant='outline'
                    className='text-xs bg-green-500/10 text-green-500 border-green-500/20'
                  >
                    <CheckCircle className='size-3 mr-1' />
                    Создание статей
                  </Badge>
                  <Badge
                    variant='outline'
                    className='text-xs bg-green-500/10 text-green-500 border-green-500/20'
                  >
                    <CheckCircle className='size-3 mr-1' />
                    Управление медиа
                  </Badge>
                  <Badge
                    variant='outline'
                    className='text-xs bg-green-500/10 text-green-500 border-green-500/20'
                  >
                    <CheckCircle className='size-3 mr-1' />
                    Категории и метки
                  </Badge>
                  <Badge
                    variant='outline'
                    className='text-xs bg-red-500/10 text-red-500 border-red-500/20'
                  >
                    <XCircle className='size-3 mr-1' />
                    Настройки системы
                  </Badge>
                </div>
              </div>

              {/* Author Role */}
              <div className='p-4 rounded-lg border bg-card'>
                <div className='flex items-start justify-between mb-3'>
                  <div className='flex items-start gap-3'>
                    <div className='p-2 rounded-lg bg-purple-500/10'>
                      <UserCheck className='size-4 text-purple-500' />
                    </div>
                    <div>
                      <p className='font-medium'>Автор</p>
                      <p className='text-sm text-muted-foreground'>
                        Создание и редактирование собственных статей
                      </p>
                    </div>
                  </div>
                  <Button variant='ghost' size='icon'>
                    <Edit className='size-4' />
                  </Button>
                </div>
                <div className='flex flex-wrap gap-2'>
                  <Badge
                    variant='outline'
                    className='text-xs bg-green-500/10 text-green-500 border-green-500/20'
                  >
                    <CheckCircle className='size-3 mr-1' />
                    Свои статьи
                  </Badge>
                  <Badge
                    variant='outline'
                    className='text-xs bg-green-500/10 text-green-500 border-green-500/20'
                  >
                    <CheckCircle className='size-3 mr-1' />
                    Загрузка медиа
                  </Badge>
                  <Badge
                    variant='outline'
                    className='text-xs bg-red-500/10 text-red-500 border-red-500/20'
                  >
                    <XCircle className='size-3 mr-1' />
                    Чужие статьи
                  </Badge>
                  <Badge
                    variant='outline'
                    className='text-xs bg-red-500/10 text-red-500 border-red-500/20'
                  >
                    <XCircle className='size-3 mr-1' />
                    Управление пользователями
                  </Badge>
                </div>
              </div>

              <Button variant='outline' className='w-full'>
                <Plus className='size-4 mr-2' />
                Создать новую роль
              </Button>
            </CardContent>
          </Card>

          {/* IP Access Control */}
          <Card>
            <CardHeader>
              <CardTitle className='text-lg flex items-center gap-2'>
                <Globe2 className='size-4' />
                Контроль доступа по IP
              </CardTitle>
              <CardDescription>
                Белые и черные списки IP-адресов
              </CardDescription>
            </CardHeader>
            <CardContent className='space-y-4'>
              <SettingRow
                icon={CheckCircle}
                label='IP Whitelist'
                description='Разрешить доступ только с указанных IP-адресов'
                defaultChecked={false}
                onChange={onChangeDetected}
              />
              <Separator />
              <SettingRow
                icon={Ban}
                label='IP Blacklist'
                description='Блокировать доступ с указанных IP-адресов'
                defaultChecked={true}
                onChange={onChangeDetected}
              />
              <Separator />

              <div className='space-y-3'>
                <Label>Заблокированные IP-адреса</Label>
                <div className='space-y-2'>
                  <div className='flex items-center justify-between p-3 rounded-lg border bg-muted/30'>
                    <div className='flex items-center gap-3'>
                      <Ban className='size-4 text-red-500' />
                      <div>
                        <p className='text-sm font-medium font-mono'>
                          192.168.1.100
                        </p>
                        <p className='text-xs text-muted-foreground'>
                          Добавлен 5 фев 2026
                        </p>
                      </div>
                    </div>
                    <Button variant='ghost' size='icon'>
                      <Trash2 className='size-4' />
                    </Button>
                  </div>
                  <div className='flex items-center justify-between p-3 rounded-lg border bg-muted/30'>
                    <div className='flex items-center gap-3'>
                      <Ban className='size-4 text-red-500' />
                      <div>
                        <p className='text-sm font-medium font-mono'>
                          10.0.0.55
                        </p>
                        <p className='text-xs text-muted-foreground'>
                          Добавлен 3 фев 2026
                        </p>
                      </div>
                    </div>
                    <Button variant='ghost' size='icon'>
                      <Trash2 className='size-4' />
                    </Button>
                  </div>
                </div>
                <div className='flex gap-2'>
                  <Input placeholder='Введите IP-адрес...' />
                  <Button>
                    <Plus className='size-4 mr-2' />
                    Добавить
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* API Access Tokens */}
          <Card>
            <CardHeader>
              <CardTitle className='text-lg flex items-center gap-2'>
                <Key className='size-4' />
                API токены доступа
              </CardTitle>
              <CardDescription>
                Управление токенами для доступа к API
              </CardDescription>
            </CardHeader>
            <CardContent className='space-y-4'>
              <div className='space-y-3'>
                <div className='flex items-center justify-between p-4 rounded-lg border bg-card'>
                  <div className='flex-1'>
                    <div className='flex items-center gap-2 mb-1'>
                      <p className='font-medium text-sm'>Основной токен</p>
                      <Badge
                        variant='outline'
                        className='text-xs bg-green-500/10 text-green-500 border-green-500/20'
                      >
                        Активен
                      </Badge>
                    </div>
                    <p className='text-xs text-muted-foreground mb-2'>
                      Создан 15 янв 2026 • Полный доступ
                    </p>
                    <code className='text-xs bg-muted px-2 py-1 rounded font-mono'>
                      sk_live_••••••••••••••••••••••abc123
                    </code>
                  </div>
                  <div className='flex gap-2'>
                    <Button variant='ghost' size='icon'>
                      <Copy className='size-4' />
                    </Button>
                    <Button variant='ghost' size='icon'>
                      <Trash2 className='size-4' />
                    </Button>
                  </div>
                </div>

                <div className='flex items-center justify-between p-4 rounded-lg border bg-card'>
                  <div className='flex-1'>
                    <div className='flex items-center gap-2 mb-1'>
                      <p className='font-medium text-sm'>
                        Токен только для чтения
                      </p>
                      <Badge
                        variant='outline'
                        className='text-xs bg-green-500/10 text-green-500 border-green-500/20'
                      >
                        Активен
                      </Badge>
                    </div>
                    <p className='text-xs text-muted-foreground mb-2'>
                      Создан 20 янв 2026 • Только чтение
                    </p>
                    <code className='text-xs bg-muted px-2 py-1 rounded font-mono'>
                      sk_live_••••••••••••••••••••••xyz789
                    </code>
                  </div>
                  <div className='flex gap-2'>
                    <Button variant='ghost' size='icon'>
                      <Copy className='size-4' />
                    </Button>
                    <Button variant='ghost' size='icon'>
                      <Trash2 className='size-4' />
                    </Button>
                  </div>
                </div>

                <div className='flex items-center justify-between p-4 rounded-lg border bg-card opacity-60'>
                  <div className='flex-1'>
                    <div className='flex items-center gap-2 mb-1'>
                      <p className='font-medium text-sm'>
                        Тестовый токен (отозван)
                      </p>
                      <Badge
                        variant='outline'
                        className='text-xs bg-red-500/10 text-red-500 border-red-500/20'
                      >
                        Неактивен
                      </Badge>
                    </div>
                    <p className='text-xs text-muted-foreground mb-2'>
                      Создан 10 янв 2026 • Отозван 25 янв 2026
                    </p>
                    <code className='text-xs bg-muted px-2 py-1 rounded font-mono'>
                      sk_test_••••••••••••••••••••••test01
                    </code>
                  </div>
                  <div className='flex gap-2'>
                    <Button variant='ghost' size='icon' disabled>
                      <Trash2 className='size-4' />
                    </Button>
                  </div>
                </div>
              </div>

              <Button variant='outline' className='w-full'>
                <Plus className='size-4 mr-2' />
                Создать новый токен
              </Button>
            </CardContent>
          </Card>

          {/* Security Policies */}
          <Card>
            <CardHeader>
              <CardTitle className='text-lg flex items-center gap-2'>
                <ShieldCheck className='size-4' />
                Политики безопасности
              </CardTitle>
              <CardDescription>Правила доступа и безопасности</CardDescription>
            </CardHeader>
            <CardContent className='space-y-4'>
              <SettingRow
                icon={Lock}
                label='Требовать 2FA для администраторов'
                description='Обязательная двухфакторная аутентификация для пользователей с ролью Администратор'
                defaultChecked={true}
                onChange={onChangeDetected}
              />
              <Separator />
              <SettingRow
                icon={Clock}
                label='Автоматическая блокировка'
                description='Блокировать аккаунт после 5 неудачных попыток входа'
                defaultChecked={true}
                onChange={onChangeDetected}
              />
              <Separator />
              <SettingRow
                icon={Activity}
                label='Логирование всех действий'
                description='Записывать все действия пользователей в журнал безопасности'
                defaultChecked={true}
                onChange={onChangeDetected}
              />
              <Separator />
              <div className='space-y-2'>
                <Label htmlFor='session-limit'>
                  Максимум одновременных сессий
                </Label>
                <Select defaultValue='3' onValueChange={onChangeDetected}>
                  <SelectTrigger id='session-limit'>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='1'>1 устройство</SelectItem>
                    <SelectItem value='3'>3 устройства</SelectItem>
                    <SelectItem value='5'>5 устройств</SelectItem>
                    <SelectItem value='unlimited'>Без ограничений</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Security Log */}
          <Card>
            <CardHeader>
              <CardTitle className='text-lg flex items-center gap-2'>
                <Activity className='size-4' />
                Журнал безопасности
              </CardTitle>
              <CardDescription>Последние события безопасности</CardDescription>
            </CardHeader>
            <CardContent>
              <div className='space-y-3'>
                <div className='flex items-start gap-3 p-3 rounded-lg border bg-green-500/5 border-green-500/20'>
                  <CheckCircle className='size-4 text-green-500 mt-0.5' />
                  <div className='flex-1'>
                    <p className='text-sm font-medium'>Успешный вход</p>
                    <p className='text-xs text-muted-foreground'>
                      admin@example.com • 192.168.1.50 • 7 фев 2026, 14:32
                    </p>
                  </div>
                </div>

                <div className='flex items-start gap-3 p-3 rounded-lg border bg-blue-500/5 border-blue-500/20'>
                  <Key className='size-4 text-blue-500 mt-0.5' />
                  <div className='flex-1'>
                    <p className='text-sm font-medium'>
                      Создан новый API токен
                    </p>
                    <p className='text-xs text-muted-foreground'>
                      admin@example.com • 7 фев 2026, 12:15
                    </p>
                  </div>
                </div>

                <div className='flex items-start gap-3 p-3 rounded-lg border bg-yellow-500/5 border-yellow-500/20'>
                  <AlertTriangle className='size-4 text-yellow-500 mt-0.5' />
                  <div className='flex-1'>
                    <p className='text-sm font-medium'>
                      Изменены права доступа
                    </p>
                    <p className='text-xs text-muted-foreground'>
                      admin@example.com изменил роль user@example.com • 6 фев
                      2026, 18:45
                    </p>
                  </div>
                </div>

                <div className='flex items-start gap-3 p-3 rounded-lg border bg-red-500/5 border-red-500/20'>
                  <XCircle className='size-4 text-red-500 mt-0.5' />
                  <div className='flex-1'>
                    <p className='text-sm font-medium'>
                      Неудачная попытка входа
                    </p>
                    <p className='text-xs text-muted-foreground'>
                      unknown@example.com • 10.0.0.55 • 6 фев 2026, 03:22
                    </p>
                  </div>
                </div>

                <div className='flex items-start gap-3 p-3 rounded-lg border bg-red-500/5 border-red-500/20'>
                  <Ban className='size-4 text-red-500 mt-0.5' />
                  <div className='flex-1'>
                    <p className='text-sm font-medium'>IP-адрес заблокирован</p>
                    <p className='text-xs text-muted-foreground'>
                      192.168.1.100 • Причина: множественные неудачные попытки •
                      5 фев 2026, 22:10
                    </p>
                  </div>
                </div>
              </div>

              <Button variant='outline' className='w-full mt-4'>
                Посмотреть полный журнал
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

// Notification Settings Component
function NotificationSettings({
  onChangeDetected,
}: {
  onChangeDetected: () => void;
}) {
  return (
    <div className='space-y-6'>
      <div>
        <h2 className='text-2xl font-semibold tracking-tight mb-2'>
          Уведомления
        </h2>
        <p className='text-muted-foreground'>Настройка системы оповещений</p>
      </div>

      <Tabs defaultValue='email' className='w-full'>
        <TabsList>
          <TabsTrigger value='email'>Email</TabsTrigger>
          <TabsTrigger value='push'>Push</TabsTrigger>
          <TabsTrigger value='digest'>Дайджесты</TabsTrigger>
        </TabsList>

        <TabsContent value='email' className='space-y-6 mt-6'>
          <Card>
            <CardHeader>
              <CardTitle className='text-lg flex items-center gap-2'>
                <Mail className='size-4' />
                Email уведомления
              </CardTitle>
            </CardHeader>
            <CardContent className='space-y-4'>
              <SettingRow
                icon={MessageSquare}
                label='Новые комментарии'
                description='Уведомления о новых комментариях к вашим статьям'
                defaultChecked={true}
                onChange={onChangeDetected}
              />
              <Separator />
              <SettingRow
                icon={Users}
                label='Активность команды'
                description='Уведомления о действиях других авторов'
                defaultChecked={true}
                onChange={onChangeDetected}
              />
              <Separator />
              <SettingRow
                icon={Activity}
                label='Системные уведомления'
                description='Важные обновления и изменения системы'
                defaultChecked={true}
                onChange={onChangeDetected}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value='push' className='space-y-6 mt-6'>
          <Card>
            <CardHeader>
              <CardTitle className='text-lg flex items-center gap-2'>
                <Bell className='size-4' />
                Push уведомления
              </CardTitle>
            </CardHeader>
            <CardContent className='space-y-4'>
              <SettingRow
                icon={Bell}
                label='Браузерные уведомления'
                description='Показывать уведомления в браузере'
                defaultChecked={false}
                onChange={onChangeDetected}
              />
              <Separator />
              <SettingRow
                icon={Smartphone}
                label='Мобильные push'
                description='Отправлять push-уведомления на мобильные устройства'
                defaultChecked={false}
                onChange={onChangeDetected}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value='digest' className='space-y-6 mt-6'>
          <Card>
            <CardHeader>
              <CardTitle className='text-lg flex items-center gap-2'>
                <Calendar className='size-4' />
                Дайджесты
              </CardTitle>
            </CardHeader>
            <CardContent className='space-y-4'>
              <SettingRow
                icon={Calendar}
                label='Еженедельный дайджест'
                description='Сводка активности за неделю'
                defaultChecked={true}
                onChange={onChangeDetected}
              />
              <Separator />
              <SettingRow
                icon={Calendar}
                label='Ежемесячный отчет'
                description='Детальная статистика за месяц'
                defaultChecked={true}
                onChange={onChangeDetected}
              />
              <Separator />
              <div className='space-y-2'>
                <Label htmlFor='digest-day'>День отправки дайджеста</Label>
                <Select defaultValue='monday' onValueChange={onChangeDetected}>
                  <SelectTrigger id='digest-day'>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='monday'>Понедельник</SelectItem>
                    <SelectItem value='friday'>Пятница</SelectItem>
                    <SelectItem value='sunday'>Воскресенье</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

// Integration Settings Component
function IntegrationSettings({
  onChangeDetected,
}: {
  onChangeDetected: () => void;
}) {
  return (
    <div className='space-y-6'>
      <div>
        <h2 className='text-2xl font-semibold tracking-tight mb-2'>
          Интеграции
        </h2>
        <p className='text-muted-foreground'>
          Подключение внешних сервисов и API
        </p>
      </div>

      <Tabs defaultValue='services' className='w-full'>
        <TabsList>
          <TabsTrigger value='services'>Сервисы</TabsTrigger>
          <TabsTrigger value='api-keys'>API ключи</TabsTrigger>
          <TabsTrigger value='webhooks'>Webhooks</TabsTrigger>
        </TabsList>

        <TabsContent value='services' className='space-y-6 mt-6'>
          <Card>
            <CardHeader>
              <CardTitle className='text-lg'>Подключенные сервисы</CardTitle>
            </CardHeader>
            <CardContent className='space-y-4'>
              <SettingRow
                icon={BarChart3}
                label='Google Analytics'
                description='Аналитика посещаемости и поведения пользователей'
                defaultChecked={true}
                onChange={onChangeDetected}
              />
              <Separator />
              <SettingRow
                icon={MessageSquare}
                label='Telegram Bot'
                description='Уведомления и управление через Telegram'
                defaultChecked={false}
                onChange={onChangeDetected}
              />
              <Separator />
              <SettingRow
                icon={Zap}
                label='Zapier'
                description='Автоматизация и интеграция с другими сервисами'
                defaultChecked={false}
                onChange={onChangeDetected}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value='api-keys' className='space-y-6 mt-6'>
          <Card>
            <CardHeader>
              <CardTitle className='text-lg flex items-center gap-2'>
                <Key className='size-4' />
                API ключи
              </CardTitle>
              <CardDescription>
                Управление ключами доступа к API
              </CardDescription>
            </CardHeader>
            <CardContent className='space-y-4'>
              <div className='space-y-3'>
                <div className='flex items-center justify-between p-3 rounded-lg border'>
                  <div>
                    <p className='font-medium text-sm'>Основной API ключ</p>
                    <p className='text-xs text-muted-foreground'>
                      Создан 15 янв 2026
                    </p>
                  </div>
                  <Button variant='outline' size='sm'>
                    Показать
                  </Button>
                </div>
                <div className='flex items-center justify-between p-3 rounded-lg border'>
                  <div>
                    <p className='font-medium text-sm'>Публичный ключ</p>
                    <p className='text-xs text-muted-foreground'>
                      Создан 20 янв 2026
                    </p>
                  </div>
                  <Button variant='outline' size='sm'>
                    Показать
                  </Button>
                </div>
              </div>
              <Button className='w-full' variant='outline'>
                <Key className='size-4 mr-2' />
                Создать новый ключ
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value='webhooks' className='space-y-6 mt-6'>
          <Card>
            <CardHeader>
              <CardTitle className='text-lg flex items-center gap-2'>
                <Webhook className='size-4' />
                Webhooks
              </CardTitle>
            </CardHeader>
            <CardContent className='space-y-4'>
              <SettingRow
                icon={Webhook}
                label='Включить webhooks'
                description='Отправлять события на внешние URL'
                defaultChecked={false}
                onChange={onChangeDetected}
              />
              <Separator />
              <SettingRow
                icon={Activity}
                label='Логирование событий'
                description='Сохранять историю отправленных webhook событий'
                defaultChecked={true}
                onChange={onChangeDetected}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

// Appearance Settings Component
function AppearanceSettings({
  onChangeDetected,
}: {
  onChangeDetected: () => void;
}) {
  return (
    <div className='space-y-6'>
      <div>
        <h2 className='text-2xl font-semibold tracking-tight mb-2'>
          Внешний вид
        </h2>
        <p className='text-muted-foreground'>
          Настройка визуального оформления блога
        </p>
      </div>

      <Tabs defaultValue='theme' className='w-full'>
        <TabsList>
          <TabsTrigger value='theme'>Тема</TabsTrigger>
          <TabsTrigger value='branding'>Брендинг</TabsTrigger>
          <TabsTrigger value='customization'>Кастомизация</TabsTrigger>
        </TabsList>

        <TabsContent value='theme' className='space-y-6 mt-6'>
          <Card>
            <CardHeader>
              <CardTitle className='text-lg flex items-center gap-2'>
                <Palette className='size-4' />
                Цветовая тема
              </CardTitle>
            </CardHeader>
            <CardContent className='space-y-4'>
              <div className='space-y-2'>
                <Label>Тема по умолчанию</Label>
                <Select defaultValue='light' onValueChange={onChangeDetected}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='light'>Светлая</SelectItem>
                    <SelectItem value='dark'>Темная</SelectItem>
                    <SelectItem value='system'>Системная</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Separator />
              <SettingRow
                icon={Paintbrush}
                label='Разрешить переключение темы'
                description='Пользователи могут выбирать тему'
                defaultChecked={true}
                onChange={onChangeDetected}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value='branding' className='space-y-6 mt-6'>
          <Card>
            <CardHeader>
              <CardTitle className='text-lg flex items-center gap-2'>
                <Sparkles className='size-4' />
                Брендинг
              </CardTitle>
            </CardHeader>
            <CardContent className='space-y-4'>
              <SettingRow
                icon={ImageIcon}
                label='Кастомный логотип'
                description='Использовать загруженный логотип вместо названия'
                defaultChecked={true}
                onChange={onChangeDetected}
              />
              <Separator />
              <SettingRow
                icon={ImageIcon}
                label='Фавикон'
                description='Собственная иконка для вкладки бразера'
                defaultChecked={true}
                onChange={onChangeDetected}
              />
              <Separator />
              <div className='space-y-2'>
                <Label htmlFor='accent-color'>Акцентный цвет</Label>
                <div className='flex gap-2'>
                  <Input
                    id='accent-color'
                    type='color'
                    defaultValue='#3b82f6'
                    className='w-20 h-10'
                    onChange={onChangeDetected}
                  />
                  <Input
                    defaultValue='#3b82f6'
                    className='flex-1'
                    onChange={onChangeDetected}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value='customization' className='space-y-6 mt-6'>
          <Card>
            <CardHeader>
              <CardTitle className='text-lg flex items-center gap-2'>
                <Box className='size-4' />
                Кастомизация
              </CardTitle>
            </CardHeader>
            <CardContent className='space-y-4'>
              <SettingRow
                icon={Type}
                label='Кастомные шрифты'
                description='Использовать собственные шрифты для заголовков и текста'
                defaultChecked={false}
                onChange={onChangeDetected}
              />
              <Separator />
              <SettingRow
                icon={Code}
                label='Пользовательский CSS'
                description='Добавить собственные стили CSS'
                defaultChecked={false}
                onChange={onChangeDetected}
              />
              <Separator />
              <SettingRow
                icon={Code}
                label='Пользовательский JavaScript'
                description='Добавить собственные скрипты'
                defaultChecked={false}
                onChange={onChangeDetected}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

// Developer Settings Component
function DeveloperSettings({
  onChangeDetected,
}: {
  onChangeDetected: () => void;
}) {
  return (
    <div className='space-y-6'>
      <div>
        <h2 className='text-2xl font-semibold tracking-tight mb-2'>
          Разработчики
        </h2>
        <p className='text-muted-foreground'>
          Настройки API и инструменты для разработчиков
        </p>
      </div>

      <Tabs defaultValue='api' className='w-full'>
        <TabsList>
          <TabsTrigger value='api'>API</TabsTrigger>
          <TabsTrigger value='oauth'>OAuth</TabsTrigger>
          <TabsTrigger value='advanced'>Расширенные</TabsTrigger>
        </TabsList>

        <TabsContent value='api' className='space-y-6 mt-6'>
          <Card>
            <CardHeader>
              <CardTitle className='text-lg flex items-center gap-2'>
                <Code className='size-4' />
                API доступ
              </CardTitle>
            </CardHeader>
            <CardContent className='space-y-4'>
              <SettingRow
                icon={Database}
                label='REST API'
                description='Включить доступ к REST API'
                defaultChecked={true}
                onChange={onChangeDetected}
              />
              <Separator />
              <SettingRow
                icon={Database}
                label='GraphQL API'
                description='Включить доступ к GraphQL API'
                defaultChecked={false}
                onChange={onChangeDetected}
              />
              <Separator />
              <div className='space-y-2'>
                <Label htmlFor='rate-limit'>Лимит запросов (в час)</Label>
                <Input
                  id='rate-limit'
                  type='number'
                  defaultValue='1000'
                  onChange={onChangeDetected}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value='oauth' className='space-y-6 mt-6'>
          <Card>
            <CardHeader>
              <CardTitle className='text-lg flex items-center gap-2'>
                <FileKey className='size-4' />
                OAuth приложения
              </CardTitle>
              <CardDescription>Управление OAuth приложениями</CardDescription>
            </CardHeader>
            <CardContent>
              <div className='text-center py-8 text-muted-foreground'>
                <p className='mb-4'>Нет зарегистрированных OAuth приложений</p>
                <Button variant='outline'>
                  <Plus className='size-4 mr-2' />
                  Создать приложение
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value='advanced' className='space-y-6 mt-6'>
          <Card>
            <CardHeader>
              <CardTitle className='text-lg flex items-center gap-2'>
                <Settings className='size-4' />
                Расширенные настройки
              </CardTitle>
            </CardHeader>
            <CardContent className='space-y-4'>
              <SettingRow
                icon={Activity}
                label='Режим отладки'
                description='Включить детальное логирование для разработки'
                defaultChecked={false}
                onChange={onChangeDetected}
              />
              <Separator />
              <SettingRow
                icon={Database}
                label='Экспорт данных'
                description='Разрешить экспорт всех данных через API'
                defaultChecked={true}
                onChange={onChangeDetected}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

// Reusable Setting Row Component
function SettingRow({
  icon: Icon,
  label,
  description,
  defaultChecked,
  onChange,
}: {
  icon: any;
  label: string;
  description: string;
  defaultChecked: boolean;
  onChange: () => void;
}) {
  return (
    <div className='flex items-start justify-between gap-4'>
      <div className='flex gap-3 flex-1'>
        <div className='p-2 rounded-lg bg-muted/50 h-fit'>
          <Icon className='size-4 text-muted-foreground' />
        </div>
        <div className='space-y-0.5 flex-1'>
          <Label className='text-sm font-medium cursor-pointer'>{label}</Label>
          <p className='text-sm text-muted-foreground'>{description}</p>
        </div>
      </div>
      <Switch defaultChecked={defaultChecked} onCheckedChange={onChange} />
    </div>
  );
}
