import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Badge } from '@/app/components/ui/badge';
import {
  Edit,
  CheckCircle,
  XCircle,
  ShieldCheck,
  ShieldAlert,
  UserCheck,
  Plus,
} from 'lucide-react';
import type { RoleDefinition } from './access-section.types';
import { ROLE_DEFINITIONS } from './access-section.constants';

const ICON_MAP = {
  'shield-alert': ShieldAlert,
  'shield-check': ShieldCheck,
  'user-check': UserCheck,
} as const;

function RoleCard({ role }: { role: RoleDefinition }) {
  const Icon = ICON_MAP[role.icon];

  return (
    <div className='p-4 rounded-lg border bg-card'>
      <div className='flex items-start justify-between mb-3'>
        <div className='flex items-start gap-3'>
          <div className={`p-2 rounded-lg ${role.colorClass}`}>
            <Icon className='size-4' />
          </div>
          <div>
            <p className='font-medium'>{role.name}</p>
            <p className='text-sm text-muted-foreground'>{role.description}</p>
          </div>
        </div>
        <Button variant='ghost' size='icon'>
          <Edit className='size-4' />
        </Button>
      </div>
      <div className='flex flex-wrap gap-2'>
        {role.permissions.map(perm => (
          <Badge
            key={perm.label}
            variant='outline'
            className={`text-xs ${
              perm.granted
                ? 'bg-green-500/10 text-green-500 border-green-500/20'
                : 'bg-red-500/10 text-red-500 border-red-500/20'
            }`}
          >
            {perm.granted ? (
              <CheckCircle className='size-3 mr-1' />
            ) : (
              <XCircle className='size-3 mr-1' />
            )}
            {perm.label}
          </Badge>
        ))}
      </div>
    </div>
  );
}

export function RolesPermissionsCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className='flex items-center gap-2'>
          <ShieldCheck className='size-5' />
          Роли и разрешения
        </CardTitle>
        <CardDescription>
          Управлеие ролями пользователей и их правами доступа
        </CardDescription>
      </CardHeader>
      <CardContent className='space-y-4'>
        {ROLE_DEFINITIONS.map(role => (
          <RoleCard key={role.name} role={role} />
        ))}
        <Button variant='outline' className='w-full'>
          <Plus className='size-4 mr-2' />
          Создать новую роль
        </Button>
      </CardContent>
    </Card>
  );
}
