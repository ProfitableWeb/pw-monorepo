import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Send } from 'lucide-react';

export function InvitesSection() {
  return (
    <div className='space-y-6'>
      <div>
        <h2 className='text-2xl font-semibold tracking-tight mb-2'>
          Приглашения
        </h2>
        <p className='text-muted-foreground'>
          Управление отправленными приглашениями
        </p>
      </div>

      <div className='flex items-center gap-2'>
        <Button disabled>
          <Send className='h-4 w-4 mr-2' />
          Отправить приглашение
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Ожидают активации</CardTitle>
          <CardDescription>Функционал в разработке</CardDescription>
        </CardHeader>
        <CardContent>
          <p className='text-muted-foreground'>
            Система приглашений будет доступна в следующей версии
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
