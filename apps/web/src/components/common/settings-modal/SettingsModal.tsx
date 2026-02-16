'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Modal } from '@/components/common/modal';
import { Input, Button, FancyButton } from '@/components/common/form-controls';
import {
  LuUser,
  LuBell,
  LuMail,
  LuCheck,
  LuX,
  LuShield,
  LuCamera,
  LuLoader,
  LuEye,
  LuEyeOff,
  LuLink,
  LuUnlink,
  LuPlus,
  LuTrash2,
} from 'react-icons/lu';
import { useAuth } from '@/contexts/auth';
import { toast } from '@/components/common/toast';
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
import type { UserSettings, SettingsTab } from '@profitable-web/types';
import { DEFAULT_USER_SETTINGS } from '@profitable-web/types';
import './SettingsModal.scss';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const STORAGE_KEY = 'user_settings';

const TABS = [
  { id: 'profile' as SettingsTab, label: 'Профиль', icon: LuUser },
  { id: 'security' as SettingsTab, label: 'Безопасность', icon: LuShield },
  { id: 'notifications' as SettingsTab, label: 'Уведомления', icon: LuBell },
  { id: 'email' as SettingsTab, label: 'Email', icon: LuMail },
];

export const SettingsModal = ({ isOpen, onClose }: SettingsModalProps) => {
  const { user, updateUser } = useAuth();
  const [activeTab, setActiveTab] = useState<SettingsTab>('profile');
  const [settings, setSettings] = useState<UserSettings>(DEFAULT_USER_SETTINGS);
  const [hasChanges, setHasChanges] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Загрузка настроек из localStorage (для notifications/email)
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as UserSettings;
        setSettings(parsed);
      }
    } catch (error) {
      console.error('Failed to load settings:', error);
    }
  }, []);

  // Обнаружение изменений (только для notifications/email)
  useEffect(() => {
    if (activeTab === 'profile' || activeTab === 'security') {
      setHasChanges(false);
      return;
    }
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      const currentStored = stored ? JSON.parse(stored) : DEFAULT_USER_SETTINGS;
      setHasChanges(JSON.stringify(settings) !== JSON.stringify(currentStored));
    } catch {
      setHasChanges(true);
    }
  }, [settings, activeTab]);

  // Сохранение настроек (notifications/email — localStorage)
  const handleSave = useCallback(async () => {
    setIsSaving(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
      setHasChanges(false);
      toast.success('Настройки сохранены');
    } catch (error) {
      toast.error('Ошибка сохранения настроек');
      console.error('Failed to save settings:', error);
    } finally {
      setIsSaving(false);
    }
  }, [settings]);

  // Отмена изменений
  const handleCancel = useCallback(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setSettings(JSON.parse(stored));
      } else {
        setSettings(DEFAULT_USER_SETTINGS);
      }
      setHasChanges(false);
      toast.info('Изменения отменены');
    } catch (error) {
      console.error('Failed to restore settings:', error);
    }
  }, []);

  const handleClose = useCallback(() => {
    onClose();
  }, [onClose]);

  // -------------------------------------------------------------------------
  // Кастомный скроллбар (macOS-style, без re-render — только DOM)
  // -------------------------------------------------------------------------
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const scrollbarRef = useRef<HTMLDivElement>(null);
  const thumbRef = useRef<HTMLDivElement>(null);
  const scrollTimerRef = useRef<ReturnType<typeof setTimeout>>(undefined);
  const isDragging = useRef(false);
  const dragStartY = useRef(0);
  const dragStartScroll = useRef(0);

  // Обновить позицию ползунка через DOM (без setState → без re-render)
  const updateScrollThumb = useCallback(() => {
    const el = scrollAreaRef.current;
    const bar = scrollbarRef.current;
    const thumb = thumbRef.current;
    if (!el || !bar || !thumb) return;

    const { scrollTop, scrollHeight, clientHeight } = el;
    if (scrollHeight <= clientHeight) {
      bar.style.display = 'none';
      return;
    }
    bar.style.display = '';
    const thumbHeight = Math.max((clientHeight / scrollHeight) * 100, 10);
    const thumbTop =
      (scrollTop / (scrollHeight - clientHeight)) * (100 - thumbHeight);
    thumb.style.top = `${thumbTop}%`;
    thumb.style.height = `${thumbHeight}%`;
  }, []);

  const showScrollbar = useCallback(() => {
    scrollbarRef.current?.classList.add('visible');
  }, []);

  const scheduleHide = useCallback(() => {
    clearTimeout(scrollTimerRef.current);
    scrollTimerRef.current = setTimeout(() => {
      if (!isDragging.current) {
        scrollbarRef.current?.classList.remove('visible');
      }
    }, 1200);
  }, []);

  const handleContentScroll = useCallback(() => {
    updateScrollThumb();
    showScrollbar();
    scheduleHide();
  }, [updateScrollThumb, showScrollbar, scheduleHide]);

  // Drag-to-scroll на ползунке
  const handleThumbMouseDown = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      const scrollEl = scrollAreaRef.current;
      const barEl = scrollbarRef.current;
      if (!scrollEl || !barEl) return;

      isDragging.current = true;
      dragStartY.current = e.clientY;
      dragStartScroll.current = scrollEl.scrollTop;
      thumbRef.current?.classList.add('dragging');
      barEl.classList.add('visible');

      const barRect = barEl.getBoundingClientRect();
      const trackHeight = barRect.height;
      const { scrollHeight, clientHeight } = scrollEl;
      const maxScroll = scrollHeight - clientHeight;

      const onMouseMove = (ev: MouseEvent) => {
        const deltaY = ev.clientY - dragStartY.current;
        const thumbRatio = clientHeight / scrollHeight;
        const thumbH = Math.max(thumbRatio * trackHeight, trackHeight * 0.1);
        const scrollableTrack = trackHeight - thumbH;
        if (scrollableTrack <= 0) return;
        const scrollDelta = (deltaY / scrollableTrack) * maxScroll;
        scrollEl.scrollTop = Math.max(
          0,
          Math.min(maxScroll, dragStartScroll.current + scrollDelta)
        );
      };

      const onMouseUp = () => {
        isDragging.current = false;
        thumbRef.current?.classList.remove('dragging');
        scheduleHide();
        document.removeEventListener('mousemove', onMouseMove);
        document.removeEventListener('mouseup', onMouseUp);
      };

      document.addEventListener('mousemove', onMouseMove);
      document.addEventListener('mouseup', onMouseUp);
    },
    [scheduleHide]
  );

  // Клик по треку — прыжок к позиции
  const handleTrackClick = useCallback((e: React.MouseEvent) => {
    const scrollEl = scrollAreaRef.current;
    const barEl = scrollbarRef.current;
    if (!scrollEl || !barEl) return;
    if (
      (e.target as HTMLElement).classList.contains(
        'settings-modal__scrollbar-thumb'
      )
    )
      return;

    const barRect = barEl.getBoundingClientRect();
    const clickY = e.clientY - barRect.top;
    const ratio = clickY / barRect.height;
    const { scrollHeight, clientHeight } = scrollEl;
    scrollEl.scrollTop = ratio * (scrollHeight - clientHeight);
  }, []);

  // Пересчитать при смене вкладки
  useEffect(() => {
    scrollbarRef.current?.classList.remove('visible');
    const t = setTimeout(updateScrollThumb, 50);
    return () => clearTimeout(t);
  }, [activeTab, updateScrollThumb]);

  // Обновление настроек (notifications/email)
  const updateSettings = useCallback(
    <K extends keyof UserSettings>(
      section: K,
      updates: Partial<UserSettings[K]>
    ) => {
      setSettings(prev => ({
        ...prev,
        [section]: { ...prev[section], ...updates },
      }));
    },
    []
  );

  // -------------------------------------------------------------------------
  // Секция профиля (реальный API)
  // -------------------------------------------------------------------------
  const ProfileSection = () => {
    const [name, setName] = useState(user?.name || '');
    const [email, setEmail] = useState(user?.email || '');
    const [bio, setBio] = useState(user?.bio || '');
    const [links, setLinks] = useState<string[]>(user?.links || []);
    const [saving, setSaving] = useState(false);
    const [uploading, setUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const MAX_LINKS = 5;

    const emailChanged = email !== (user?.email || '');
    const [emailVerificationSent, setEmailVerificationSent] = useState(false);

    const hasProfileChanges =
      name !== (user?.name || '') ||
      bio !== (user?.bio || '') ||
      JSON.stringify(links) !== JSON.stringify(user?.links || []);

    const handleSaveProfile = async () => {
      setSaving(true);
      try {
        const updates: { name?: string; bio?: string; links?: string[] } = {};
        if (name !== user?.name) updates.name = name;
        if (bio !== (user?.bio || '')) updates.bio = bio;
        const filteredLinks = links.filter(l => l.trim() !== '');
        if (JSON.stringify(filteredLinks) !== JSON.stringify(user?.links || []))
          updates.links = filteredLinks;
        const result = await updateProfile(updates);
        updateUser({
          name: result.name,
          email: result.email,
          bio: result.bio,
          links: result.links,
        });
        toast.success('Профиль обновлён');
      } catch (error) {
        toast.error(
          error instanceof Error ? error.message : 'Ошибка обновления профиля'
        );
      } finally {
        setSaving(false);
      }
    };

    const handleEmailChange = async () => {
      try {
        // TODO: POST /users/me/email/change { new_email: email }
        // Бэкенд отправит письмо со ссылкой подтверждения
        setEmailVerificationSent(true);
        toast.success('Письмо для подтверждения отправлено на ' + email);
      } catch (error) {
        toast.error(
          error instanceof Error ? error.message : 'Ошибка отправки письма'
        );
      }
    };

    const handleAvatarClick = () => {
      fileInputRef.current?.click();
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      setUploading(true);
      try {
        const result = await uploadAvatar(file);
        updateUser({ avatar: result.avatar });
        toast.success('Аватар обновлён');
      } catch (error) {
        toast.error(
          error instanceof Error ? error.message : 'Ошибка загрузки аватара'
        );
      } finally {
        setUploading(false);
        if (fileInputRef.current) fileInputRef.current.value = '';
      }
    };

    const handleDeleteAvatar = async () => {
      setUploading(true);
      try {
        await deleteAvatar();
        updateUser({ avatar: undefined });
        toast.success('Аватар удалён');
      } catch (error) {
        toast.error(
          error instanceof Error ? error.message : 'Ошибка удаления аватара'
        );
      } finally {
        setUploading(false);
      }
    };

    return (
      <div className='settings-modal__section settings-modal__section--profile'>
        <div className='settings-modal__avatar-section'>
          <div
            className='settings-modal__avatar-wrapper settings-modal__avatar-wrapper--clickable'
            onClick={handleAvatarClick}
            role='button'
            tabIndex={0}
            onKeyDown={e => e.key === 'Enter' && handleAvatarClick()}
            aria-label='Изменить аватар'
          >
            <img
              src={user?.avatar || '/imgs/author/avatar.jpg'}
              alt={user?.name || 'Avatar'}
              className='settings-modal__avatar'
            />
            <div className='settings-modal__avatar-overlay'>
              {uploading ? (
                <LuLoader className='settings-modal__avatar-overlay-icon spin' />
              ) : (
                <LuCamera className='settings-modal__avatar-overlay-icon' />
              )}
            </div>
          </div>
          <input
            ref={fileInputRef}
            type='file'
            accept='image/jpeg,image/png,image/gif,image/webp'
            className='settings-modal__avatar-upload-input'
            onChange={handleFileChange}
          />
          <div className='settings-modal__avatar-actions'>
            <Button
              variant='outline'
              size='sm'
              onClick={handleAvatarClick}
              disabled={uploading}
            >
              Изменить аватар
            </Button>
            {user?.avatar && (
              <Button
                variant='outline'
                mode='secondary'
                size='sm'
                onClick={handleDeleteAvatar}
                disabled={uploading}
              >
                Удалить
              </Button>
            )}
          </div>
        </div>

        <div className='settings-modal__form-group'>
          <Input
            label='Имя'
            placeholder='Введите имя'
            value={name}
            onChange={e => setName(e.target.value)}
            fullWidth
          />
        </div>

        <div className='settings-modal__form-group'>
          <Input
            label='Email'
            type='email'
            placeholder='your@email.com'
            value={email}
            onChange={e => {
              setEmail(e.target.value);
              setEmailVerificationSent(false);
            }}
            fullWidth
          />
          {emailChanged && (
            <div className='settings-modal__email-verify'>
              {emailVerificationSent ? (
                <span className='settings-modal__email-verify-sent'>
                  <LuCheck /> Письмо отправлено на {email}
                </span>
              ) : (
                <>
                  <span className='settings-modal__email-verify-hint'>
                    Для смены email отправим письмо с подтверждением.{' '}
                    <a
                      href='#'
                      className='settings-modal__email-verify-link'
                      onClick={e => {
                        e.preventDefault();
                        handleEmailChange();
                      }}
                    >
                      Отправить
                    </a>
                  </span>
                </>
              )}
            </div>
          )}
        </div>

        <div className='settings-modal__form-group'>
          <label className='input__label'>О себе</label>
          <textarea
            className='settings-modal__bio-textarea'
            placeholder='Расскажите немного о себе...'
            value={bio}
            onChange={e => setBio(e.target.value)}
            maxLength={300}
            rows={3}
          />
          <span className='settings-modal__bio-counter'>{bio.length}/300</span>
        </div>

        <div className='settings-modal__form-group'>
          <label className='input__label'>Ссылки</label>
          <div className='settings-modal__links-list'>
            {links.map((link, index) => (
              <div key={index} className='settings-modal__link-row'>
                <Input
                  placeholder='https://...'
                  value={link}
                  onChange={e => {
                    const updated = [...links];
                    updated[index] = e.target.value;
                    setLinks(updated);
                  }}
                  fullWidth
                />
                <button
                  type='button'
                  className='settings-modal__link-remove'
                  onClick={() => setLinks(links.filter((_, i) => i !== index))}
                  aria-label='Удалить ссылку'
                >
                  <LuTrash2 />
                </button>
              </div>
            ))}
            {links.length < MAX_LINKS && (
              <Button
                variant='outline'
                size='sm'
                onClick={() => setLinks([...links, ''])}
              >
                <LuPlus /> Добавить ссылку
              </Button>
            )}
          </div>
        </div>

        {hasProfileChanges && (
          <div className='settings-modal__profile-actions'>
            <FancyButton
              variant='solid'
              size='sm'
              onClick={handleSaveProfile}
              disabled={saving}
              enableHoverElevation
            >
              {saving ? 'Сохранение...' : 'Сохранить'}
            </FancyButton>
            <Button
              variant='outline'
              size='sm'
              onClick={() => {
                setName(user?.name || '');
                setEmail(user?.email || '');
                setEmailVerificationSent(false);
                setBio(user?.bio || '');
                setLinks(user?.links || []);
              }}
              disabled={saving}
            >
              Отмена
            </Button>
          </div>
        )}
      </div>
    );
  };

  // -------------------------------------------------------------------------
  // Password input с toggle видимости
  // -------------------------------------------------------------------------
  const PasswordInput = (props: React.ComponentProps<typeof Input>) => {
    const [visible, setVisible] = useState(false);
    return (
      <div className='settings-modal__password-input-wrapper'>
        <Input {...props} type={visible ? 'text' : 'password'} />
        <button
          type='button'
          className='settings-modal__password-toggle'
          onClick={() => setVisible(v => !v)}
          aria-label={visible ? 'Скрыть пароль' : 'Показать пароль'}
          tabIndex={-1}
        >
          {visible ? <LuEyeOff /> : <LuEye />}
        </button>
      </div>
    );
  };

  // -------------------------------------------------------------------------
  // Секция безопасности
  // -------------------------------------------------------------------------
  const OAUTH_PROVIDERS = [
    { id: 'google', label: 'Google' },
    { id: 'yandex', label: 'Яндекс' },
    { id: 'telegram', label: 'Telegram' },
  ] as const;

  const SecuritySection = () => {
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);

    // Форма установки пароля
    const [newPass, setNewPass] = useState('');
    const [confirmPass, setConfirmPass] = useState('');

    // Форма смены пароля
    const [oldPass, setOldPass] = useState('');
    const [newPassChange, setNewPassChange] = useState('');
    const [confirmPassChange, setConfirmPassChange] = useState('');

    const [saving, setSaving] = useState(false);
    const [linkingProvider, setLinkingProvider] = useState<string | null>(null);
    const [unlinkingProvider, setUnlinkingProvider] = useState<string | null>(
      null
    );

    useEffect(() => {
      getProfile()
        .then(p => setProfile(p))
        .finally(() => setLoading(false));
    }, []);

    const handleSetPassword = async () => {
      if (newPass !== confirmPass) {
        toast.error('Пароли не совпадают');
        return;
      }
      if (newPass.length < 8) {
        toast.error('Пароль должен содержать минимум 8 символов');
        return;
      }
      setSaving(true);
      try {
        const result = await setPassword(newPass);
        setProfile(result);
        setNewPass('');
        setConfirmPass('');
        toast.success('Пароль установлен');
      } catch (error) {
        toast.error(
          error instanceof Error ? error.message : 'Ошибка установки пароля'
        );
      } finally {
        setSaving(false);
      }
    };

    const handleChangePassword = async () => {
      if (newPassChange !== confirmPassChange) {
        toast.error('Пароли не совпадают');
        return;
      }
      if (newPassChange.length < 8) {
        toast.error('Пароль должен содержать минимум 8 символов');
        return;
      }
      setSaving(true);
      try {
        const result = await changePassword(oldPass, newPassChange);
        setProfile(result);
        setOldPass('');
        setNewPassChange('');
        setConfirmPassChange('');
        toast.success('Пароль изменён');
      } catch (error) {
        toast.error(
          error instanceof Error ? error.message : 'Ошибка смены пароля'
        );
      } finally {
        setSaving(false);
      }
    };

    const handleLinkProvider = async (provider: string) => {
      setLinkingProvider(provider);
      try {
        const url = await getOAuthLinkUrl(provider);
        window.location.href = url;
      } catch (error) {
        toast.error(
          error instanceof Error
            ? error.message
            : 'Ошибка подключения провайдера'
        );
        setLinkingProvider(null);
      }
    };

    const handleUnlinkProvider = async (provider: string) => {
      setUnlinkingProvider(provider);
      try {
        const result = await unlinkOAuth(provider);
        setProfile(result);
        toast.success('Провайдер отвязан');
      } catch (error) {
        toast.error(
          error instanceof Error ? error.message : 'Ошибка отвязки провайдера'
        );
      } finally {
        setUnlinkingProvider(null);
      }
    };

    if (loading) {
      return (
        <div className='settings-modal__section settings-modal__section--security'>
          <div className='settings-modal__loading'>Загрузка...</div>
        </div>
      );
    }

    const linkedProviders = profile?.oauthProviders ?? [];

    return (
      <div className='settings-modal__section settings-modal__section--security'>
        {/* OAuth провайдеры */}
        <div className='settings-modal__oauth-section'>
          <label className='settings-modal__label'>Привязанные аккаунты</label>
          <div className='settings-modal__oauth-providers'>
            {OAUTH_PROVIDERS.map(p => {
              const isLinked = linkedProviders.includes(p.id);
              const isLinking = linkingProvider === p.id;
              const isUnlinking = unlinkingProvider === p.id;
              return (
                <div
                  key={p.id}
                  className={`settings-modal__oauth-provider-row ${isLinked ? 'linked' : ''}`}
                >
                  <span className='settings-modal__oauth-provider-label'>
                    {p.label}
                  </span>
                  {isLinked ? (
                    <div className='settings-modal__oauth-provider-actions'>
                      <span className='settings-modal__oauth-badge'>
                        Подключён
                      </span>
                      <Button
                        variant='ghost'
                        size='sm'
                        onClick={() => handleUnlinkProvider(p.id)}
                        disabled={isUnlinking}
                      >
                        {isUnlinking ? (
                          <LuLoader className='spin' />
                        ) : (
                          <LuUnlink />
                        )}{' '}
                        Отвязать
                      </Button>
                    </div>
                  ) : (
                    <Button
                      variant='outline'
                      size='sm'
                      onClick={() => handleLinkProvider(p.id)}
                      disabled={isLinking}
                    >
                      {isLinking ? <LuLoader className='spin' /> : <LuLink />}{' '}
                      Подключить
                    </Button>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Установить пароль (OAuth без пароля) */}
        {profile && !profile.hasPassword && (
          <div className='settings-modal__password-form'>
            <div className='settings-modal__password-info'>
              Установите пароль, чтобы входить по email и паролю.
            </div>
            <PasswordInput
              label='Новый пароль'
              placeholder='Минимум 8 символов'
              value={newPass}
              onChange={e => setNewPass(e.target.value)}
              fullWidth
            />
            <PasswordInput
              label='Подтвердите пароль'
              placeholder='Повторите пароль'
              value={confirmPass}
              onChange={e => setConfirmPass(e.target.value)}
              fullWidth
            />
            <FancyButton
              variant='solid'
              size='sm'
              onClick={handleSetPassword}
              disabled={saving || !newPass || !confirmPass}
              enableHoverElevation
            >
              {saving ? 'Сохранение...' : 'Установить пароль'}
            </FancyButton>
          </div>
        )}

        {/* Сменить пароль */}
        {profile && profile.hasPassword && (
          <div className='settings-modal__password-form'>
            <PasswordInput
              label='Текущий пароль'
              placeholder='Введите текущий пароль'
              value={oldPass}
              onChange={e => setOldPass(e.target.value)}
              fullWidth
            />
            <PasswordInput
              label='Новый пароль'
              placeholder='Минимум 8 символов'
              value={newPassChange}
              onChange={e => setNewPassChange(e.target.value)}
              fullWidth
            />
            <PasswordInput
              label='Подтвердите новый пароль'
              placeholder='Повторите новый пароль'
              value={confirmPassChange}
              onChange={e => setConfirmPassChange(e.target.value)}
              fullWidth
            />
            <FancyButton
              variant='solid'
              size='sm'
              onClick={handleChangePassword}
              disabled={
                saving || !oldPass || !newPassChange || !confirmPassChange
              }
              enableHoverElevation
            >
              {saving ? 'Сохранение...' : 'Сменить пароль'}
            </FancyButton>
          </div>
        )}
      </div>
    );
  };

  // -------------------------------------------------------------------------
  // Секция уведомлений
  // -------------------------------------------------------------------------
  const NotificationsSection = () => (
    <div className='settings-modal__section settings-modal__section--notifications'>
      <div className='settings-modal__setting-item'>
        <div className='settings-modal__setting-info'>
          <span className='settings-modal__setting-title'>
            Email уведомления
          </span>
          <span className='settings-modal__setting-description'>
            Получать уведомления на email
          </span>
        </div>
        <button
          className={`settings-modal__toggle ${
            settings.notifications.emailNotifications ? 'active' : ''
          }`}
          onClick={() =>
            updateSettings('notifications', {
              emailNotifications: !settings.notifications.emailNotifications,
            })
          }
          aria-label={
            settings.notifications.emailNotifications
              ? 'Отключить email уведомления'
              : 'Включить email уведомления'
          }
        >
          <div className='settings-modal__toggle-slider'>
            {settings.notifications.emailNotifications ? (
              <LuCheck strokeWidth={4} strokeLinecap='round' />
            ) : (
              <LuX strokeWidth={4} strokeLinecap='round' />
            )}
          </div>
        </button>
      </div>

      <div className='settings-modal__setting-item'>
        <div className='settings-modal__setting-info'>
          <span className='settings-modal__setting-title'>
            Браузерные уведомления
          </span>
          <span className='settings-modal__setting-description'>
            Уведомления в браузере
          </span>
        </div>
        <button
          className={`settings-modal__toggle ${
            settings.notifications.browserNotifications ? 'active' : ''
          }`}
          onClick={() =>
            updateSettings('notifications', {
              browserNotifications:
                !settings.notifications.browserNotifications,
            })
          }
          aria-label={
            settings.notifications.browserNotifications
              ? 'Отключить браузерные уведомления'
              : 'Включить браузерные уведомления'
          }
        >
          <div className='settings-modal__toggle-slider'>
            {settings.notifications.browserNotifications ? (
              <LuCheck strokeWidth={4} strokeLinecap='round' />
            ) : (
              <LuX strokeWidth={4} strokeLinecap='round' />
            )}
          </div>
        </button>
      </div>

      <div className='settings-modal__setting-item'>
        <div className='settings-modal__setting-info'>
          <span className='settings-modal__setting-title'>
            Еженедельный дайджест
          </span>
          <span className='settings-modal__setting-description'>
            Сводка лучших статей за неделю
          </span>
        </div>
        <button
          className={`settings-modal__toggle ${
            settings.notifications.weeklyDigest ? 'active' : ''
          }`}
          onClick={() =>
            updateSettings('notifications', {
              weeklyDigest: !settings.notifications.weeklyDigest,
            })
          }
          aria-label={
            settings.notifications.weeklyDigest
              ? 'Отключить еженедельный дайджест'
              : 'Включить еженедельный дайджест'
          }
        >
          <div className='settings-modal__toggle-slider'>
            {settings.notifications.weeklyDigest ? (
              <LuCheck strokeWidth={4} strokeLinecap='round' />
            ) : (
              <LuX strokeWidth={4} strokeLinecap='round' />
            )}
          </div>
        </button>
      </div>

      <div className='settings-modal__setting-item'>
        <div className='settings-modal__setting-info'>
          <span className='settings-modal__setting-title'>Новые статьи</span>
          <span className='settings-modal__setting-description'>
            Уведомления о новых публикациях
          </span>
        </div>
        <button
          className={`settings-modal__toggle ${
            settings.notifications.newArticleAlerts ? 'active' : ''
          }`}
          onClick={() =>
            updateSettings('notifications', {
              newArticleAlerts: !settings.notifications.newArticleAlerts,
            })
          }
          aria-label={
            settings.notifications.newArticleAlerts
              ? 'Отключить уведомления о новых статьях'
              : 'Включить уведомления о новых статьях'
          }
        >
          <div className='settings-modal__toggle-slider'>
            {settings.notifications.newArticleAlerts ? (
              <LuCheck strokeWidth={4} strokeLinecap='round' />
            ) : (
              <LuX strokeWidth={4} strokeLinecap='round' />
            )}
          </div>
        </button>
      </div>

      <div className='settings-modal__setting-item'>
        <div className='settings-modal__setting-info'>
          <span className='settings-modal__setting-title'>
            Ответы на комментарии
          </span>
          <span className='settings-modal__setting-description'>
            Уведомления об ответах на ваши комментарии
          </span>
        </div>
        <button
          className={`settings-modal__toggle ${
            settings.notifications.commentReplies ? 'active' : ''
          }`}
          onClick={() =>
            updateSettings('notifications', {
              commentReplies: !settings.notifications.commentReplies,
            })
          }
          aria-label={
            settings.notifications.commentReplies
              ? 'Отключить уведомления об ответах'
              : 'Включить уведомления об ответах'
          }
        >
          <div className='settings-modal__toggle-slider'>
            {settings.notifications.commentReplies ? (
              <LuCheck strokeWidth={4} strokeLinecap='round' />
            ) : (
              <LuX strokeWidth={4} strokeLinecap='round' />
            )}
          </div>
        </button>
      </div>
    </div>
  );

  // -------------------------------------------------------------------------
  // Секция email подписки
  // -------------------------------------------------------------------------
  const EmailSection = () => (
    <div className='settings-modal__section settings-modal__section--email'>
      <div className='settings-modal__subscription-status'>
        <span className='settings-modal__subscription-label'>
          {settings.emailSubscription.subscribed ? 'Подписан' : 'Не подписан'}
        </span>
        <button
          className={`settings-modal__toggle ${
            settings.emailSubscription.subscribed ? 'active' : ''
          }`}
          onClick={() =>
            updateSettings('emailSubscription', {
              subscribed: !settings.emailSubscription.subscribed,
            })
          }
          aria-label={
            settings.emailSubscription.subscribed
              ? 'Отписаться от рассылки'
              : 'Подписаться на рассылку'
          }
        >
          <div className='settings-modal__toggle-slider'>
            {settings.emailSubscription.subscribed ? (
              <LuCheck strokeWidth={4} strokeLinecap='round' />
            ) : (
              <LuX strokeWidth={4} strokeLinecap='round' />
            )}
          </div>
        </button>
      </div>

      {settings.emailSubscription.subscribed && (
        <>
          <div className='settings-modal__form-group'>
            <Input
              label='Email для подписки'
              type='email'
              placeholder='your@email.com'
              value={
                settings.emailSubscription.email || settings.profile.email || ''
              }
              onChange={e =>
                updateSettings('emailSubscription', { email: e.target.value })
              }
              fullWidth
            />
          </div>

          <div className='settings-modal__form-group'>
            <label className='settings-modal__label'>Частота рассылки</label>
            <div className='settings-modal__radio-group'>
              {['daily', 'weekly', 'monthly'].map(freq => (
                <label
                  key={freq}
                  className={`settings-modal__radio-item ${
                    settings.emailSubscription.frequency === freq
                      ? 'active'
                      : ''
                  }`}
                >
                  <input
                    type='radio'
                    name='frequency'
                    value={freq}
                    checked={settings.emailSubscription.frequency === freq}
                    onChange={() =>
                      updateSettings('emailSubscription', {
                        frequency: freq as 'daily' | 'weekly' | 'monthly',
                      })
                    }
                  />
                  <span className='settings-modal__radio-label'>
                    {freq === 'daily'
                      ? 'Ежедневно'
                      : freq === 'weekly'
                        ? 'Еженедельно'
                        : 'Ежемесячно'}
                  </span>
                </label>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title='Настройки'
      size='large'
      contentPadding={{ top: '0', right: '0', bottom: '0', left: '0' }}
      showDivider
    >
      <div className='settings-modal'>
        <div className='settings-modal__sidebar'>
          <nav className='settings-modal__nav' role='tablist'>
            {TABS.map(tab => (
              <button
                key={tab.id}
                className={`settings-modal__nav-item ${
                  activeTab === tab.id ? 'active' : ''
                }`}
                onClick={() => setActiveTab(tab.id)}
                role='tab'
                aria-selected={activeTab === tab.id}
                aria-controls={`panel-${tab.id}`}
              >
                <tab.icon className='settings-modal__nav-icon' />
                <span className='settings-modal__nav-label'>{tab.label}</span>
              </button>
            ))}
          </nav>

          {hasChanges && (
            <div className='settings-modal__actions'>
              <Button
                variant='outline'
                size='sm'
                onClick={handleCancel}
                disabled={isSaving}
                fullWidth
              >
                Отмена
              </Button>
              <Button
                variant='solid'
                size='sm'
                onClick={handleSave}
                disabled={isSaving}
                fullWidth
              >
                {isSaving ? 'Сохранение...' : 'Сохранить'}
              </Button>
            </div>
          )}
        </div>

        <div className='settings-modal__content'>
          <div
            className='settings-modal__scroll'
            ref={scrollAreaRef}
            onScroll={handleContentScroll}
          >
            <div
              id={`panel-${activeTab}`}
              className='settings-modal__panel'
              role='tabpanel'
              aria-labelledby={`tab-${activeTab}`}
            >
              {activeTab === 'profile' && <ProfileSection />}
              {activeTab === 'security' && <SecuritySection />}
              {activeTab === 'notifications' && <NotificationsSection />}
              {activeTab === 'email' && <EmailSection />}
            </div>
          </div>
          <div
            ref={scrollbarRef}
            className='settings-modal__scrollbar'
            onMouseDown={handleTrackClick}
          >
            <div
              ref={thumbRef}
              className='settings-modal__scrollbar-thumb'
              onMouseDown={handleThumbMouseDown}
            />
          </div>
        </div>
      </div>
    </Modal>
  );
};
