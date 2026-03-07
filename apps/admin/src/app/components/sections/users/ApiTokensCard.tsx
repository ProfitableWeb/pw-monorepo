import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Badge } from '@/app/components/ui/badge';
import { Trash2, Copy, Plus, Key } from 'lucide-react';
import type { ApiToken } from './access-section.types';
import { API_TOKENS } from './access-section.constants';

function TokenRow({ token }: { token: ApiToken }) {
  return (
    <div
      className={`flex items-center justify-between p-4 rounded-lg border bg-card${
        !token.active ? ' opacity-60' : ''
      }`}
    >
      <div className='flex-1'>
        <div className='flex items-center gap-2 mb-1'>
          <p className='font-medium text-sm'>{token.name}</p>
          <Badge
            variant='outline'
            className={`text-xs ${
              token.active
                ? 'bg-green-500/10 text-green-500 border-green-500/20'
                : 'bg-red-500/10 text-red-500 border-red-500/20'
            }`}
          >
            {token.active ? 'Активен' : 'Неактивен'}
          </Badge>
        </div>
        <p className='text-xs text-muted-foreground mb-2'>
          {token.description}
        </p>
        <code className='text-xs bg-muted px-2 py-1 rounded font-mono'>
          {token.maskedKey}
        </code>
      </div>
      <div className='flex gap-2'>
        {token.active && (
          <Button variant='ghost' size='icon'>
            <Copy className='size-4' />
          </Button>
        )}
        <Button variant='ghost' size='icon' disabled={!token.active}>
          <Trash2 className='size-4' />
        </Button>
      </div>
    </div>
  );
}

export function ApiTokensCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className='flex items-center gap-2'>
          <Key className='size-5' />
          API токены доступа
        </CardTitle>
        <CardDescription>Управление токенами для доступа к API</CardDescription>
      </CardHeader>
      <CardContent className='space-y-4'>
        <div className='space-y-3'>
          {API_TOKENS.map(token => (
            <TokenRow key={token.maskedKey} token={token} />
          ))}
        </div>
        <Button variant='outline' className='w-full'>
          <Plus className='size-4 mr-2' />
          Создать новый токен
        </Button>
      </CardContent>
    </Card>
  );
}
