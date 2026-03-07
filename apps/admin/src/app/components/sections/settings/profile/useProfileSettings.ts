import { useEffect, useState, useRef } from 'react';
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

/** Вся логика профиля: загрузка, сохранение, аватар, пароль, OAuth */
export function useProfileSettings() {
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

  const handleCancel = () => {
    setName(profile?.name || '');
    setEmail(profile?.email || '');
    setEmailVerificationSent(false);
    setBio(profile?.bio || '');
    setLinks(profile?.links || []);
  };

  return {
    user,
    profile,
    loading,

    // Данные профиля
    name,
    setName,
    email,
    setEmail,
    bio,
    setBio,
    links,
    setLinks,
    savingProfile,
    uploading,
    emailVerificationSent,
    setEmailVerificationSent,
    fileInputRef,
    emailChanged,
    hasProfileChanges,
    handleSaveProfile,
    handleEmailChange,
    handleAvatarUpload,
    handleDeleteAvatar,
    handleCancel,

    // Пароль
    newPass,
    setNewPass,
    confirmPass,
    setConfirmPass,
    oldPass,
    setOldPass,
    newPassChange,
    setNewPassChange,
    confirmPassChange,
    setConfirmPassChange,
    savingPassword,
    handleSetPassword,
    handleChangePassword,

    // OAuth
    linkingProvider,
    unlinkingProvider,
    handleLinkProvider,
    handleUnlinkProvider,
  };
}
