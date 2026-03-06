import { Switch } from '@/app/components/ui/switch';
import { Label } from '@/app/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/app/components/ui/select';

const MOCK_WORKSPACES = [
  { id: 'ws-1', name: 'AI и автоматизация труда — исследование' },
  { id: 'ws-2', name: 'Рынок труда: статистика 2023–2026' },
  { id: 'ws-3', name: 'Интервью с HR-директорами' },
];

interface ProvenanceModuleProps {
  workspaceId: string;
  showLink: boolean;
  onWorkspaceChange: (v: string) => void;
  onShowLinkChange: (v: boolean) => void;
}

export function ProvenanceModule({
  workspaceId,
  showLink,
  onWorkspaceChange,
  onShowLinkChange,
}: ProvenanceModuleProps) {
  return (
    <div className='space-y-4'>
      <div className='space-y-1.5'>
        <Label className='text-xs'>Research Workspace</Label>
        <Select value={workspaceId} onValueChange={onWorkspaceChange}>
          <SelectTrigger>
            <SelectValue placeholder='Выберите рабочее пространство...' />
          </SelectTrigger>
          <SelectContent>
            {MOCK_WORKSPACES.map(ws => (
              <SelectItem key={ws.id} value={ws.id}>
                {ws.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className='flex items-center justify-between'>
        <Label htmlFor='provenance-link' className='text-xs'>
          Показывать ссылку на материалы
        </Label>
        <Switch
          id='provenance-link'
          checked={showLink}
          onCheckedChange={onShowLinkChange}
        />
      </div>
    </div>
  );
}
