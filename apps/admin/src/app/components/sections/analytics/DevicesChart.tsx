import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/app/components/ui/card';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { Monitor, Smartphone } from 'lucide-react';
import { deviceData } from './analytics.constants';

export function DevicesChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Устройства</CardTitle>
        <CardDescription>Распределение по типам устройств</CardDescription>
      </CardHeader>
      <CardContent>
        <div className='flex items-center gap-6'>
          <ResponsiveContainer width='40%' height={200}>
            <PieChart>
              <Pie
                data={deviceData}
                cx='50%'
                cy='50%'
                innerRadius={50}
                outerRadius={80}
                paddingAngle={2}
                dataKey='value'
              >
                {deviceData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className='flex-1 space-y-3'>
            <div className='flex items-center gap-3'>
              <Monitor className='size-5 text-blue-500' />
              <div className='flex-1'>
                <p className='text-sm font-medium'>Desktop</p>
                <p className='text-xs text-muted-foreground'>58% посетителей</p>
              </div>
            </div>
            <div className='flex items-center gap-3'>
              <Smartphone className='size-5 text-green-500' />
              <div className='flex-1'>
                <p className='text-sm font-medium'>Mobile</p>
                <p className='text-xs text-muted-foreground'>35% посетителей</p>
              </div>
            </div>
            <div className='flex items-center gap-3'>
              <Smartphone className='size-5 text-orange-500' />
              <div className='flex-1'>
                <p className='text-sm font-medium'>Tablet</p>
                <p className='text-xs text-muted-foreground'>7% посетителей</p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
