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
import { Label } from '@/app/components/ui/label';
import { FormField } from '@/app/components/ui/form-field';
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
  User,
  Save,
  Lock,
  Camera,
  Loader2,
  Link,
  Unlink,
  LogIn,
  Trash2,
  Plus,
} from 'lucide-react';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/app/components/ui/tabs';
import { cn } from '@/app/components/ui/utils';
import { PasswordInput } from './PasswordInput';

// Компонент настроек профиля (PW-034)
export function ProfileSettings() {
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
