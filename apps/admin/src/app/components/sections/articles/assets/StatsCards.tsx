import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/app/components/ui/card';

interface StatsCardsProps {
  total: number;
  publishedCount: number;
  draftCount: number;
  totalViews: number;
}

export function StatsCards({
  total,
  publishedCount,
  draftCount,
  totalViews,
}: StatsCardsProps) {
  return (
    <div className='grid gap-4 md:grid-cols-4'>
      <Card>
        <CardHeader className='pb-3'>
          <CardDescription>Всего статей</CardDescription>
          <CardTitle className='text-3xl'>{total}</CardTitle>
        </CardHeader>
      </Card>
      <Card>
        <CardHeader className='pb-3'>
          <CardDescription>Опубликовано</CardDescription>
          <CardTitle className='text-3xl'>{publishedCount}</CardTitle>
        </CardHeader>
      </Card>
      <Card>
        <CardHeader className='pb-3'>
          <CardDescription>Черновиков</CardDescription>
          <CardTitle className='text-3xl'>{draftCount}</CardTitle>
        </CardHeader>
      </Card>
      <Card>
        <CardHeader className='pb-3'>
          <CardDescription>Всего просмотров</CardDescription>
          <CardTitle className='text-3xl'>
            {totalViews.toLocaleString()}
          </CardTitle>
        </CardHeader>
      </Card>
    </div>
  );
}
