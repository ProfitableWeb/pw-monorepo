import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/app/components/ui/card';
import { Badge } from '@/app/components/ui/badge';
import { Button } from '@/app/components/ui/button';
import { Key, Copy, Trash2, Plus } from 'lucide-react';
import { API_TOKENS } from '../security-settings.constants';

export function ApiTokenList() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className='text-lg flex items-center gap-2'>
          <Key className='size-4' />
          API токены доступа
        </CardTitle>
        <CardDescription>Управление токенами для доступа к API</CardDescription>
      </CardHeader>
      <CardContent className='space-y-4'>
        <div className='space-y-3'>
          {API_TOKENS.map(token => (
            <div
              key={token.maskedKey}
              className={`flex items-center justify-between p-4 rounded-lg border bg-card${
                token.revoked ? ' opacity-60' : ''
              }`}
            >
              <div className='flex-1'>
                <div className='flex items-center gap-2 mb-1'>
                  <p className='font-medium text-sm'>{token.name}</p>
                  <Badge
                    variant='outline'
                    className={
                      token.active
                        ? 'text-xs bg-green-500/10 text-green-500 border-green-500/20'
                        : 'text-xs bg-red-500/10 text-red-500 border-red-500/20'
                    }
                  >
                    {token.active ? 'Активен' : 'Неактивен'}
                  </Badge>
                </div>
                <p className='text-xs text-muted-foreground mb-2'>
                  {token.createdAt} • {token.description}
                </p>
                <code className='text-xs bg-muted px-2 py-1 rounded font-mono'>
                  {token.maskedKey}
                </code>
              </div>
              <div className='flex gap-2'>
                {!token.revoked && (
                  <Button variant='ghost' size='icon'>
                    <Copy className='size-4' />
                  </Button>
                )}
                <Button variant='ghost' size='icon' disabled={token.revoked}>
                  <Trash2 className='size-4' />
                </Button>
              </div>
            </div>
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
