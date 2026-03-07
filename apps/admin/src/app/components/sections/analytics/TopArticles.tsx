import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/app/components/ui/card';
import { Eye, TrendingUp } from 'lucide-react';
import { topArticles } from './analytics.constants';

export function TopArticles() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Топ статей</CardTitle>
        <CardDescription>Самые популярные публикации</CardDescription>
      </CardHeader>
      <CardContent>
        <div className='space-y-4'>
          {topArticles.map((article, index) => (
            <div key={index} className='flex items-start gap-3'>
              <div className='flex items-center justify-center w-8 h-8 rounded-full bg-muted flex-shrink-0'>
                <span className='text-sm font-medium'>{index + 1}</span>
              </div>
              <div className='flex-1 min-w-0'>
                <p className='text-sm font-medium line-clamp-1'>
                  {article.title}
                </p>
                <div className='flex items-center gap-3 mt-1 text-xs text-muted-foreground'>
                  <div className='flex items-center gap-1'>
                    <Eye className='size-3' />
                    <span>{article.views.toLocaleString()}</span>
                  </div>
                  <div className='flex items-center gap-1'>
                    <TrendingUp className='size-3' />
                    <span>{article.engagement}%</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
