/**
 * User settings types for the application
 */

export type SettingsTab = 'profile' | 'notifications' | 'email';

export interface UserProfileSettings {
  name: string;
  email: string;
  avatar?: string;
}

export interface NotificationSettings {
  emailNotifications: boolean;
  browserNotifications: boolean;
  weeklyDigest: boolean;
  newArticleAlerts: boolean;
  commentReplies: boolean;
}

export interface EmailSubscriptionSettings {
  subscribed: boolean;
  email: string;
  frequency: 'daily' | 'weekly' | 'monthly';
  categories: string[];
}

export interface UserSettings {
  profile: UserProfileSettings;
  notifications: NotificationSettings;
  emailSubscription: EmailSubscriptionSettings;
}

export const DEFAULT_USER_SETTINGS: UserSettings = {
  profile: {
    name: '',
    email: '',
  },
  notifications: {
    emailNotifications: true,
    browserNotifications: false,
    weeklyDigest: true,
    newArticleAlerts: true,
    commentReplies: true,
  },
  emailSubscription: {
    subscribed: false,
    email: '',
    frequency: 'weekly',
    categories: [],
  },
};
