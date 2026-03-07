import { Badge } from '@/app/components/ui/badge';
import { Button } from '@/app/components/ui/button';
import { Edit, CheckCircle, XCircle } from 'lucide-react';
import type { RoleDefinition } from '../security-settings.types';

export function RoleCard({ role }: { role: RoleDefinition }) {
  const Icon = role.icon;

  return (
    <div className='p-4 rounded-lg border bg-card'>
      <div className='flex items-start justify-between mb-3'>
        <div className='flex items-start gap-3'>
          <div className={`p-2 rounded-lg ${role.iconBg}`}>
            <Icon className={`size-4 ${role.iconColor}`} />
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
            className={
              perm.granted
                ? 'text-xs bg-green-500/10 text-green-500 border-green-500/20'
                : 'text-xs bg-red-500/10 text-red-500 border-red-500/20'
            }
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
