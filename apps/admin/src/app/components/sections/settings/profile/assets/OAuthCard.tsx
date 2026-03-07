import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Badge } from '@/app/components/ui/badge';
import { cn } from '@/app/components/ui/utils';
import { LogIn, Loader2, Link, Unlink } from 'lucide-react';
import {
  OAUTH_PROVIDERS,
  PROVIDER_LABELS,
} from '../profile-settings.constants';
import type { OAuthCardProps } from '../profile-settings.types';

export function OAuthCard({
  profile,
  linkingProvider,
  unlinkingProvider,
  onLink,
  onUnlink,
}: OAuthCardProps) {
  return (
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
                  {PROVIDER_LABELS[provider]}
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
                  onClick={() => onUnlink(provider)}
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
                  onClick={() => onLink(provider)}
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
  );
}
