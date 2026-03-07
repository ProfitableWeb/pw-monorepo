/**
 * Секция настроек форматирования — рендерится как children внутри EditorSettingsPanel.
 * Позволяет выбрать форматтер (Prettier / Monaco), ширину строки и режим пробелов HTML.
 */
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/app/components/ui/select';
import { Label } from '@/app/components/ui/label';
import { Slider } from '@/app/components/ui/slider';
import {
  FORMATTER_LABELS,
  HTML_WS_LABELS,
  type FormatterType,
  type HtmlWhitespaceSensitivity,
} from '../../editor-shared';

interface FormatterSettingsProps {
  formatter: FormatterType;
  onFormatterChange: (v: FormatterType) => void;
  prettierPrintWidth: number;
  onPrintWidthChange: (v: number) => void;
  htmlWhitespaceSensitivity: HtmlWhitespaceSensitivity;
  onHtmlWsChange: (v: HtmlWhitespaceSensitivity) => void;
}

export function FormatterSettings({
  formatter,
  onFormatterChange,
  prettierPrintWidth,
  onPrintWidthChange,
  htmlWhitespaceSensitivity,
  onHtmlWsChange,
}: FormatterSettingsProps) {
  return (
    <div className='border-t border-border/50 pt-4 space-y-4'>
      <div className='flex items-center justify-between'>
        <Label className='text-xs'>Форматтер</Label>
        <Select
          value={formatter}
          onValueChange={v => onFormatterChange(v as FormatterType)}
        >
          <SelectTrigger className='w-[150px]' size='sm'>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {(
              Object.entries(FORMATTER_LABELS) as [FormatterType, string][]
            ).map(([key, label]) => (
              <SelectItem key={key} value={key}>
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {formatter === 'prettier' && (
        <>
          <div className='space-y-3'>
            <div className='flex items-center justify-between'>
              <Label className='text-xs'>Ширина строки</Label>
              <span className='text-[10px] tabular-nums text-muted-foreground'>
                {prettierPrintWidth}
              </span>
            </div>
            <Slider
              value={[prettierPrintWidth]}
              onValueChange={([v]) => onPrintWidthChange(v ?? 80)}
              min={40}
              max={160}
              step={10}
            />
          </div>

          <div className='flex items-center justify-between'>
            <Label className='text-xs'>HTML пробелы</Label>
            <Select
              value={htmlWhitespaceSensitivity}
              onValueChange={v =>
                onHtmlWsChange(v as HtmlWhitespaceSensitivity)
              }
            >
              <SelectTrigger className='w-[150px]' size='sm'>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {(
                  Object.entries(HTML_WS_LABELS) as [
                    HtmlWhitespaceSensitivity,
                    string,
                  ][]
                ).map(([key, label]) => (
                  <SelectItem key={key} value={key}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </>
      )}
    </div>
  );
}
