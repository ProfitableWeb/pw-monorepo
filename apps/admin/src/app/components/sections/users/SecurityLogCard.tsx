import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import {
  Activity,
  CheckCircle,
  XCircle,
  AlertCircle,
  Ban,
  Key,
} from 'lucide-react';
import type { SecurityLogEntry, SecurityLogType } from './access-section.types';
import { SECURITY_LOG_ENTRIES } from './access-section.constants';

const LOG_STYLE: Record<
  SecurityLogType,
  {
    borderClass: string;
    bgClass: string;
    icon: typeof CheckCircle;
    iconColor: string;
  }
> = {
  success: {
    borderClass: 'border-green-500/20',
    bgClass: 'bg-green-500/5',
    icon: CheckCircle,
    iconColor: 'text-green-500',
  },
  info: {
    borderClass: 'border-blue-500/20',
    bgClass: 'bg-blue-500/5',
    icon: Key,
    iconColor: 'text-blue-500',
  },
  warning: {
    borderClass: 'border-yellow-500/20',
    bgClass: 'bg-yellow-500/5',
    icon: AlertCircle,
    iconColor: 'text-yellow-500',
  },
  error: {
    borderClass: 'border-red-500/20',
    bgClass: 'bg-red-500/5',
    icon: XCircle,
    iconColor: 'text-red-500',
  },
  blocked: {
    borderClass: 'border-red-500/20',
    bgClass: 'bg-red-500/5',
    icon: Ban,
    iconColor: 'text-red-500',
  },
};

function LogRow({ entry }: { entry: SecurityLogEntry }) {
  const style = LOG_STYLE[entry.type];
  const Icon = style.icon;

  return (
    <div
      className={`flex items-start gap-3 p-3 rounded-lg border ${style.bgClass} ${style.borderClass}`}
    >
      <Icon className={`size-4 ${style.iconColor} mt-0.5`} />
      <div className='flex-1'>
        <p className='text-sm font-medium'>{entry.title}</p>
        <p className='text-xs text-muted-foreground'>{entry.details}</p>
      </div>
    </div>
  );
}

export function SecurityLogCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className='flex items-center gap-2'>
          <Activity className='size-5' />
          Журнал безопасности
        </CardTitle>
        <CardDescription>Последние события безопасности</CardDescription>
      </CardHeader>
      <CardContent>
        <div className='space-y-3'>
          {SECURITY_LOG_ENTRIES.map((entry, index) => (
            <LogRow key={index} entry={entry} />
          ))}
        </div>
        <Button variant='outline' className='w-full mt-4'>
          Посмотреть полный журнал
        </Button>
      </CardContent>
    </Card>
  );
}
