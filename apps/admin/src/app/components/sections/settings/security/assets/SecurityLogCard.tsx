import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Activity } from 'lucide-react';
import { SECURITY_LOG_ENTRIES } from '../security-settings.constants';

export function SecurityLogCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className='text-lg flex items-center gap-2'>
          <Activity className='size-4' />
          Журнал безопасности
        </CardTitle>
        <CardDescription>Последние события безопасности</CardDescription>
      </CardHeader>
      <CardContent>
        <div className='space-y-3'>
          {SECURITY_LOG_ENTRIES.map(entry => {
            const Icon = entry.icon;
            return (
              <div
                key={entry.title + entry.details}
                className={`flex items-start gap-3 p-3 rounded-lg border ${entry.bgClass} ${entry.borderClass}`}
              >
                <Icon className={`size-4 ${entry.colorClass} mt-0.5`} />
                <div className='flex-1'>
                  <p className='text-sm font-medium'>{entry.title}</p>
                  <p className='text-xs text-muted-foreground'>
                    {entry.details}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        <Button variant='outline' className='w-full mt-4'>
          Посмотреть полный журнал
        </Button>
      </CardContent>
    </Card>
  );
}
