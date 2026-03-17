import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/app/components/ui/tabs';
import { LoadingSpinner } from '@/app/components/common';
import { useProfileSettings } from './useProfileSettings';
import { AvatarCard } from './assets/AvatarCard';
import { PersonalDataCard } from './assets/PersonalDataCard';
import { PasswordCard } from './assets/PasswordCard';
import { OAuthCard } from './assets/OAuthCard';

// Компонент настроек профиля (PW-034)
export function ProfileSettings() {
  const s = useProfileSettings();

  if (s.loading) {
    return <LoadingSpinner className='py-12' />;
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
          <AvatarCard
            avatar={s.user?.avatar}
            userName={s.user?.name}
            uploading={s.uploading}
            fileInputRef={s.fileInputRef}
            onUpload={s.handleAvatarUpload}
            onDelete={s.handleDeleteAvatar}
          />
          <PersonalDataCard
            name={s.name}
            email={s.email}
            bio={s.bio}
            links={s.links}
            emailChanged={s.emailChanged}
            emailVerificationSent={s.emailVerificationSent}
            hasProfileChanges={s.hasProfileChanges}
            savingProfile={s.savingProfile}
            profile={s.profile}
            onNameChange={s.setName}
            onEmailChange={s.setEmail}
            onBioChange={s.setBio}
            onLinksChange={s.setLinks}
            onEmailVerificationReset={() => s.setEmailVerificationSent(false)}
            onSendEmailChange={s.handleEmailChange}
            onSave={s.handleSaveProfile}
            onCancel={s.handleCancel}
          />
        </TabsContent>

        <TabsContent value='security' className='space-y-6 mt-6'>
          {s.profile && (
            <PasswordCard
              profile={s.profile}
              savingPassword={s.savingPassword}
              newPass={s.newPass}
              confirmPass={s.confirmPass}
              onNewPassChange={s.setNewPass}
              onConfirmPassChange={s.setConfirmPass}
              onSetPassword={s.handleSetPassword}
              oldPass={s.oldPass}
              newPassChange={s.newPassChange}
              confirmPassChange={s.confirmPassChange}
              onOldPassChange={s.setOldPass}
              onNewPassChangeChange={s.setNewPassChange}
              onConfirmPassChangeChange={s.setConfirmPassChange}
              onChangePassword={s.handleChangePassword}
            />
          )}
        </TabsContent>

        <TabsContent value='oauth' className='space-y-6 mt-6'>
          <OAuthCard
            profile={s.profile}
            linkingProvider={s.linkingProvider}
            unlinkingProvider={s.unlinkingProvider}
            onLink={s.handleLinkProvider}
            onUnlink={s.handleUnlinkProvider}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
