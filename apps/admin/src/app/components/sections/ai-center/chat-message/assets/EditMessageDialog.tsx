import { Button } from '@/app/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/app/components/ui/dialog';
import Editor from '@monaco-editor/react';
import { useTheme } from 'next-themes';

interface EditMessageDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  content: string;
  onContentChange: (value: string) => void;
  onCancel: () => void;
  onSave: () => void;
}

export function EditMessageDialog({
  open,
  onOpenChange,
  content,
  onContentChange,
  onCancel,
  onSave,
}: EditMessageDialogProps) {
  const { resolvedTheme } = useTheme();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className='max-w-4xl max-h-[85vh] flex flex-col'
        onEscapeKeyDown={e => e.preventDefault()}
        onInteractOutside={e => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle>Редактировать сообщение</DialogTitle>
          <DialogDescription>
            После сохранения создастся новая ветка диалога с этого момента.
            <br />
            Исходная ветка сохранится — переключайтесь между вариантами
            стрелками.
          </DialogDescription>
        </DialogHeader>
        <div className='h-[500px] border rounded-md overflow-hidden'>
          <Editor
            height='500px'
            defaultLanguage='markdown'
            value={content}
            onChange={value => onContentChange(value || '')}
            theme={resolvedTheme === 'dark' ? 'vs-dark' : 'light'}
            options={{
              minimap: { enabled: false },
              fontSize: 14,
              lineNumbers: 'on',
              scrollBeyondLastLine: false,
              wordWrap: 'on',
              wrappingStrategy: 'advanced',
              padding: { top: 10, bottom: 10 },
              suggestOnTriggerCharacters: true,
              quickSuggestions: {
                other: true,
                comments: false,
                strings: false,
              },
              tabSize: 2,
              insertSpaces: true,
            }}
          />
        </div>
        <DialogFooter>
          <Button variant='outline' onClick={onCancel}>
            Отмена
          </Button>
          <Button onClick={onSave}>Сохранить и отправить</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
