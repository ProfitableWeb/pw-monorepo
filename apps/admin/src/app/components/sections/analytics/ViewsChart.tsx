import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/app/components/ui/card';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { viewsData } from './analytics.constants';

export function ViewsChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Просмотры и посетители</CardTitle>
        <CardDescription>Динамика за последние 2 недели</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width='100%' height={300}>
          <AreaChart data={viewsData}>
            <defs>
              <linearGradient id='colorViews' x1='0' y1='0' x2='0' y2='1'>
                <stop offset='5%' stopColor='#3b82f6' stopOpacity={0.8} />
                <stop offset='95%' stopColor='#3b82f6' stopOpacity={0} />
              </linearGradient>
              <linearGradient id='colorVisitors' x1='0' y1='0' x2='0' y2='1'>
                <stop offset='5%' stopColor='#10b981' stopOpacity={0.8} />
                <stop offset='95%' stopColor='#10b981' stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray='3 3' opacity={0.1} />
            <XAxis dataKey='date' fontSize={12} />
            <YAxis fontSize={12} />
            <Tooltip />
            <Legend />
            <Area
              type='monotone'
              dataKey='views'
              stroke='#3b82f6'
              fillOpacity={1}
              fill='url(#colorViews)'
              name='Просмотры'
            />
            <Area
              type='monotone'
              dataKey='visitors'
              stroke='#10b981'
              fillOpacity={1}
              fill='url(#colorVisitors)'
              name='Посетители'
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
