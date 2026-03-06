import { BlogStats } from './BlogStats';
import { AnalyticsChart } from './AnalyticsChart';
import { PostsTable } from './PostsTable';
import { QuickActions } from '@/app/components/common/quick-actions';

export function DashboardSection() {
  return (
    <div className='space-y-6'>
      {/* Секция статистики */}
      <BlogStats />

      {/* Графики и быстрые действия */}
      <div className='grid gap-6 lg:grid-cols-3'>
        <div className='lg:col-span-2'>
          <AnalyticsChart />
        </div>
        <div className='lg:col-span-1'>
          <QuickActions />
        </div>
      </div>

      {/* Таблица публикаций */}
      <PostsTable />
    </div>
  );
}
