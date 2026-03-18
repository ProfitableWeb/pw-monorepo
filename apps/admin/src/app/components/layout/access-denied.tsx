import { ExternalLink, LogOut } from 'lucide-react';
import { PwLogo } from '@/app/components/common/pw-logo';
import { useAuthStore } from '@/app/store/auth-store';

export function AccessDenied() {
  const { logout } = useAuthStore();

  return (
    <div className='flex min-h-screen items-center justify-center bg-background p-6'>
      <div className='max-w-sm text-center space-y-6'>
        <div className='flex justify-center'>
          <PwLogo size='2xl' accentClass='fill-[#5ADC5A]' />
        </div>
        <h1 className='text-2xl font-bold text-foreground'>Доступ запрещён</h1>
        <p className='text-muted-foreground'>
          У вашей учётной записи недостаточно прав для доступа к панели
          управления.
        </p>
        <div className='flex flex-col items-center gap-5'>
          <a
            href={
              import.meta.env.VITE_WEB_URL ||
              (import.meta.env.DEV
                ? 'http://localhost:3000'
                : window.location.origin)
            }
            className='inline-flex items-center gap-2 justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90'
          >
            <ExternalLink className='h-4 w-4' />
            На главную сайта
          </a>
          <button
            onClick={() => logout()}
            className='inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground border-b border-muted-foreground/30 hover:border-foreground/50 pb-0.5 transition-colors'
          >
            <LogOut className='h-3.5 w-3.5' />
            Выйти
          </button>
        </div>
      </div>
    </div>
  );
}
