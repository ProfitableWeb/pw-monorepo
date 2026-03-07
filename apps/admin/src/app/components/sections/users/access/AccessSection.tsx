import { RolesPermissionsCard } from './assets/RolesPermissionsCard';
import { IpAccessCard } from './assets/IpAccessCard';
import { ApiTokensCard } from './assets/ApiTokensCard';
import { SecurityLogCard } from './assets/SecurityLogCard';

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
