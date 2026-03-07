import type { UserProfile } from '@/lib/api-client';

export interface AvatarCardProps {
  avatar?: string;
  userName?: string;
  uploading: boolean;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  onUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onDelete: () => void;
}

export interface PersonalDataCardProps {
  name: string;
  email: string;
  bio: string;
  links: string[];
  emailChanged: boolean;
  emailVerificationSent: boolean;
  hasProfileChanges: boolean;
  savingProfile: boolean;
  profile: UserProfile | null;
  onNameChange: (v: string) => void;
  onEmailChange: (v: string) => void;
  onBioChange: (v: string) => void;
  onLinksChange: (v: string[]) => void;
  onEmailVerificationReset: () => void;
  onSendEmailChange: () => void;
  onSave: () => void;
  onCancel: () => void;
}

export interface PasswordCardProps {
  profile: UserProfile;
  savingPassword: boolean;
  /** Установка пароля (OAuth-юзер без пароля) */
  newPass: string;
  confirmPass: string;
  onNewPassChange: (v: string) => void;
  onConfirmPassChange: (v: string) => void;
  onSetPassword: () => void;
  /** Смена пароля (юзер уже имеет пароль) */
  oldPass: string;
  newPassChange: string;
  confirmPassChange: string;
  onOldPassChange: (v: string) => void;
  onNewPassChangeChange: (v: string) => void;
  onConfirmPassChangeChange: (v: string) => void;
  onChangePassword: () => void;
}

export interface OAuthCardProps {
  profile: UserProfile | null;
  linkingProvider: string | null;
  unlinkingProvider: string | null;
  onLink: (provider: string) => void;
  onUnlink: (provider: string) => void;
}
