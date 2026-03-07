import { RolesPermissionsCard } from './RolesPermissionsCard';
import { IpAccessCard } from './IpAccessCard';
import { ApiTokensCard } from './ApiTokensCard';
import { SecurityLogCard } from './SecurityLogCard';

export function AccessSection() {
  return (
    <div className='space-y-6'>
      <div>
        <h2 className='text-2xl font-semibold tracking-tight mb-2'>
          Настройка доступа
        </h2>
        <p className='text-muted-foreground'>
          Детальная настройка прав доступа к разделам
        </p>
      </div>

      <RolesPermissionsCard />
      <IpAccessCard />
      <ApiTokensCard />
      <SecurityLogCard />
    </div>
  );
}
