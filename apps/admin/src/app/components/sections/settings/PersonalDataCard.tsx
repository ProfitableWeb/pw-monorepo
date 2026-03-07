import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { FormField } from '@/app/components/ui/form-field';
import { User, Save, Loader2, Trash2, Plus } from 'lucide-react';
import { MAX_LINKS } from './profile-settings.constants';
import type { PersonalDataCardProps } from './profile-settings.types';

export function PersonalDataCard({
  name,
  email,
  bio,
  links,
  emailChanged,
  emailVerificationSent,
  hasProfileChanges,
  savingProfile,
  onNameChange,
  onEmailChange,
  onBioChange,
  onLinksChange,
  onEmailVerificationReset,
  onSendEmailChange,
  onSave,
  onCancel,
}: PersonalDataCardProps) {
  return (
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
            onChange={e => onNameChange(e.target.value)}
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
              onEmailChange(e.target.value);
              onEmailVerificationReset();
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
                  onClick={onSendEmailChange}
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
            onChange={e => onBioChange(e.target.value)}
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
                    onLinksChange(updated);
                  }}
                />
                <Button
                  variant='ghost'
                  size='icon'
                  onClick={() =>
                    onLinksChange(links.filter((_, i) => i !== index))
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
                onClick={() => onLinksChange([...links, ''])}
              >
                <Plus className='size-4 mr-2' />
                Добавить ссылку
              </Button>
            )}
          </div>
        </FormField>
        {hasProfileChanges && (
          <div className='flex gap-2 pt-2'>
            <Button size='sm' onClick={onSave} disabled={savingProfile}>
              {savingProfile ? (
                <>
                  <Loader2 className='size-4 mr-2 animate-spin' /> Сохранение...
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
              onClick={onCancel}
              disabled={savingProfile}
            >
              Отмена
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
