/**
 * Кнопка AI-действия с анимацией загрузки.
 * Пока заглушка: имитирует 2-секундную задержку. В будущем — вызов ИИ-эндпоинта.
 */
import { useCallback, useState } from 'react';
import { Button } from '@/app/components/ui/button';
import { Sparkles, Loader2 } from 'lucide-react';

interface AiButtonProps {
  label: string;
  onClick?: () => void;
}

export function AiButton({ label, onClick }: AiButtonProps) {
  const [loading, setLoading] = useState(false);

  const handleClick = useCallback(() => {
    setLoading(true);
    setTimeout(() => setLoading(false), 2000);
    onClick?.();
  }, [onClick]);

  return (
    <Button
      type='button'
      variant='outline'
      size='sm'
      className='gap-1.5 text-xs'
      onClick={handleClick}
      disabled={loading}
    >
      {loading ? (
        <Loader2 className='size-3.5 animate-spin' />
      ) : (
        <Sparkles className='size-3.5' />
      )}
      {label}
    </Button>
  );
}
