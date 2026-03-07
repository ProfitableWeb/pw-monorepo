import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Label } from '@/app/components/ui/label';
import { Lock, Loader2 } from 'lucide-react';
import { PasswordInput } from './PasswordInput';
import type { PasswordCardProps } from '../profile-settings.types';

export function PasswordCard({
  profile,
  savingPassword,
  newPass,
  confirmPass,
  onNewPassChange,
  onConfirmPassChange,
  onSetPassword,
  oldPass,
  newPassChange,
  confirmPassChange,
  onOldPassChange,
  onNewPassChangeChange,
  onConfirmPassChangeChange,
  onChangePassword,
}: PasswordCardProps) {
  if (!profile.hasPassword) {
    return (
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
              onChange={e => onNewPassChange(e.target.value)}
            />
          </div>
          <div className='space-y-2'>
            <Label htmlFor='confirm-password'>Подтвердите пароль</Label>
            <PasswordInput
              id='confirm-password'
              placeholder='Повторите пароль'
              value={confirmPass}
              onChange={e => onConfirmPassChange(e.target.value)}
            />
          </div>
          {newPass && confirmPass && newPass !== confirmPass && (
            <p className='text-sm text-destructive'>Пароли не совпадают</p>
          )}
          <Button
            size='sm'
            onClick={onSetPassword}
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
                <Loader2 className='size-4 mr-2 animate-spin' /> Сохранение...
              </>
            ) : (
              'Установить пароль'
            )}
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
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
            onChange={e => onOldPassChange(e.target.value)}
          />
        </div>
        <div className='space-y-2'>
          <Label htmlFor='new-password-change'>Новый пароль</Label>
          <PasswordInput
            id='new-password-change'
            placeholder='Минимум 8 символов'
            value={newPassChange}
            onChange={e => onNewPassChangeChange(e.target.value)}
          />
        </div>
        <div className='space-y-2'>
          <Label htmlFor='confirm-password-change'>
            Подтвердите новый пароль
          </Label>
          <PasswordInput
            id='confirm-password-change'
            value={confirmPassChange}
            onChange={e => onConfirmPassChangeChange(e.target.value)}
          />
        </div>
        {newPassChange &&
          confirmPassChange &&
          newPassChange !== confirmPassChange && (
            <p className='text-sm text-destructive'>Пароли не совпадают</p>
          )}
        <Button
          size='sm'
          onClick={onChangePassword}
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
              <Loader2 className='size-4 mr-2 animate-spin' /> Сохранение...
            </>
          ) : (
            'Сменить пароль'
          )}
        </Button>
      </CardContent>
    </Card>
  );
}
