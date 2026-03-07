import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectSeparator,
} from '@/app/components/ui/select';
import { Settings } from 'lucide-react';
import { AI_MODELS } from '../../ai-center.constants';

interface ModelSelectorProps {
  selectedModel: string;
  onModelChange: (value: string) => void;
}

export function ModelSelector({
  selectedModel,
  onModelChange,
}: ModelSelectorProps) {
  const handleChange = (value: string) => {
    if (value === '__configure__') {
      // TODO: Open models configuration dialog
      console.log('Configure models clicked');
      return;
    }
    onModelChange(value);
  };

  return (
    <div className='flex-shrink-0'>
      <Select value={selectedModel} onValueChange={handleChange}>
        <SelectTrigger className='w-[140px] h-10 text-xs'>
          {AI_MODELS.find(m => m.id === selectedModel)?.name}
        </SelectTrigger>
        <SelectContent>
          {AI_MODELS.map(model => (
            <SelectItem key={model.id} value={model.id}>
              <div>
                <div className='font-medium'>{model.name}</div>
                <div className='text-xs text-muted-foreground'>
                  {model.description}
                </div>
              </div>
            </SelectItem>
          ))}
          <SelectSeparator />
          <SelectItem
            value='__configure__'
            onSelect={e => {
              e.preventDefault();
              handleChange('__configure__');
            }}
          >
            <div className='flex items-center gap-2'>
              <Settings className='h-4 w-4' />
              <span>Настроить список моделей</span>
            </div>
          </SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
