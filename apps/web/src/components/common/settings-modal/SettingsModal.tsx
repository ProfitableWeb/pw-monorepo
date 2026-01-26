'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Modal } from '@/components/common/modal';
import { Input, Button } from '@/components/common/form-controls';
import { LuUser, LuBell, LuMail, LuCheck, LuX, LuSave } from 'react-icons/lu';
import { useAuth } from '@/contexts/auth';
import { toast } from '@/components/common/toast';
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
  { id: 'notifications' as SettingsTab, label: 'Уведомления', icon: LuBell },
  { id: 'email' as SettingsTab, label: 'Email', icon: LuMail },
];

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<SettingsTab>('profile');
  const [settings, setSettings] = useState<UserSettings>(DEFAULT_USER_SETTINGS);
  const [hasChanges, setHasChanges] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Загрузка настроек из localStorage
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

  // Обнаружение изменений
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      const currentStored = stored ? JSON.parse(stored) : DEFAULT_USER_SETTINGS;
      setHasChanges(JSON.stringify(settings) !== JSON.stringify(currentStored));
    } catch {
      setHasChanges(true);
    }
  }, [settings]);

  // Сохранение настроек
  const handleSave = useCallback(async () => {
    setIsSaving(true);
    try {
      // Имитация API запроса
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

  // Обработчик закрытия
  const handleClose = useCallback(() => {
    onClose();
  }, [onClose]);

  // Обновление настроек
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

  // Компонент секции профиля
  const ProfileSection = () => (
    <div className='settings-modal__section settings-modal__section--profile'>
      <div className='settings-modal__avatar-section'>
        <div className='settings-modal__avatar-wrapper'>
          <img
            src={user?.avatar || '/imgs/author/avatar.jpg'}
            alt={settings.profile.name || 'Avatar'}
            className='settings-modal__avatar'
          />
        </div>
        <Button variant='outline' size='sm'>
          Изменить аватар
        </Button>
      </div>

      <div className='settings-modal__form-group'>
        <Input
          label='Имя'
          placeholder='Введите имя'
          value={settings.profile.name || user?.name || ''}
          onChange={e => updateSettings('profile', { name: e.target.value })}
          fullWidth
        />
      </div>

      <div className='settings-modal__form-group'>
        <Input
          label='Email'
          type='email'
          placeholder='your@email.com'
          value={settings.profile.email}
          onChange={e => updateSettings('profile', { email: e.target.value })}
          fullWidth
        />
      </div>
    </div>
  );

  // Компонент секции уведомлений
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
            {settings.notifications.emailNotifications ? <LuCheck /> : <LuX />}
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
              <LuCheck />
            ) : (
              <LuX />
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
            {settings.notifications.weeklyDigest ? <LuCheck /> : <LuX />}
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
            {settings.notifications.newArticleAlerts ? <LuCheck /> : <LuX />}
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
            {settings.notifications.commentReplies ? <LuCheck /> : <LuX />}
          </div>
        </button>
      </div>
    </div>
  );

  // Компонент секции email подписки
  const EmailSection = () => (
    <div className='settings-modal__section settings-modal__section--email'>
      <div className='settings-modal__subscription-status'>
        <span className='settings-modal__subscription-label'>
          {settings.emailSubscription.subscribed ? 'Подписан' : 'Не подписан'}
        </span>
        <button
          className={`settings-modal__toggle settings-modal__toggle--large ${
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
            {settings.emailSubscription.subscribed ? <LuCheck /> : <LuX />}
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
                enableHoverElevation
              >
                {isSaving ? (
                  'Сохранение...'
                ) : (
                  <>
                    <LuSave /> Сохранить
                  </>
                )}
              </Button>
            </div>
          )}
        </div>

        <div className='settings-modal__content'>
          <div
            id={`panel-${activeTab}`}
            className='settings-modal__panel'
            role='tabpanel'
            aria-labelledby={`tab-${activeTab}`}
          >
            {activeTab === 'profile' && <ProfileSection />}
            {activeTab === 'notifications' && <NotificationsSection />}
            {activeTab === 'email' && <EmailSection />}
          </div>
        </div>
      </div>
    </Modal>
  );
};
