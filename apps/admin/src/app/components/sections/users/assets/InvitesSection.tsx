import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Badge } from '@/app/components/ui/badge';
import { Send } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/app/components/ui/avatar';
import { users, statusColors } from '../users.constants';

// Раздел приглашений
export function InvitesSection() {
  const invitedUsers = users.filter(u => u.status === 'invited');

  return (
    <div className='space-y-6'>
      <div>
        <h2 className='text-2xl font-semibold tracking-tight mb-2'>
          Приглашения
        </h2>
        <p className='text-muted-foreground'>
          Управление отпавленными приглашениями
        </p>
      </div>

      <div className='flex items-center gap-2'>
        <Button>
          <Send className='h-4 w-4 mr-2' />
          Отправить приглашение
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Ожидают активации</CardTitle>
          <CardDescription>{invitedUsers.length} приглашений</CardDescription>
        </CardHeader>
        <CardContent>
          <div className='space-y-3'>
            {invitedUsers.map(user => (
              <div
                key={user.id}
                className='flex items-center justify-between p-3 rounded-lg border'
              >
                <div className='flex items-center gap-3'>
                  <Avatar className='h-10 w-10'>
                    <AvatarFallback>{user.avatar}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className='font-medium'>{user.name}</p>
                    <p className='text-sm text-muted-foreground'>
                      {user.email}
                    </p>
                  </div>
                </div>
                <div className='flex items-center gap-2'>
                  <Badge variant='outline' className={statusColors.invited}>
                    Ожидает
                  </Badge>
                  <Button size='sm' variant='ghost'>
                    <Send className='h-4 w-4' />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
