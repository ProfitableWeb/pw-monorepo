import { Label } from '@/app/components/ui/label';
import { Switch } from '@/app/components/ui/switch';

// Переиспользуемый компонент строки настройки
export function SettingRow({
  icon: Icon,
  label,
  description,
  defaultChecked,
  onChange,
}: {
  icon: any;
  label: string;
  description: string;
  defaultChecked: boolean;
  onChange: () => void;
}) {
  return (
    <div className='flex items-start justify-between gap-4'>
      <div className='flex gap-3 flex-1'>
        <div className='p-2 rounded-lg bg-muted/50 h-fit'>
          <Icon className='size-4 text-muted-foreground' />
        </div>
        <div className='space-y-0.5 flex-1'>
          <Label className='text-sm font-medium cursor-pointer'>{label}</Label>
          <p className='text-sm text-muted-foreground'>{description}</p>
        </div>
      </div>
      <Switch defaultChecked={defaultChecked} onCheckedChange={onChange} />
    </div>
  );
}
