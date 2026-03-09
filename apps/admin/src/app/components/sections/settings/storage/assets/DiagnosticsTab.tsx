/**
 * PW-041-D1 | Таб «Диагностика» — тест подключения к хранилищу.
 */

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/app/components/ui/card';
import { Badge } from '@/app/components/ui/badge';
import { Button } from '@/app/components/ui/button';
import {
  Play,
  Loader2,
  CheckCircle2,
  XCircle,
  Zap,
  PenLine,
  Eye,
  Trash2,
} from 'lucide-react';
import type {
  StorageInfo,
  StorageTestResult,
  StorageTestStep,
} from '../storage.types';

interface DiagnosticsTabProps {
  testResult: StorageTestResult | null;
  testing: boolean;
  onRunTest: () => void;
  backend: StorageInfo['backend'];
}

const STEP_META: Record<
  StorageTestStep['name'],
  { label: string; description: string; icon: typeof PenLine }
> = {
  write: {
    label: 'Запись',
    description: 'Сохранение тестового файла',
    icon: PenLine,
  },
  read: {
    label: 'Чтение',
    description: 'Проверка наличия файла',
    icon: Eye,
  },
  delete: {
    label: 'Удаление',
    description: 'Удаление тестового файла',
    icon: Trash2,
  },
};

function StepRow({ step }: { step: StorageTestStep }) {
  const meta = STEP_META[step.name];
  const Icon = meta.icon;

  return (
    <div className='flex items-center justify-between py-3'>
      <div className='flex items-center gap-3'>
        {step.success ? (
          <CheckCircle2 className='size-5 text-emerald-500' />
        ) : (
          <XCircle className='size-5 text-red-500' />
        )}
        <div className='p-1.5 rounded-md bg-muted/50'>
          <Icon className='size-3.5 text-muted-foreground' />
        </div>
        <div>
          <p className='text-sm font-medium'>{meta.label}</p>
          <p className='text-xs text-muted-foreground'>{meta.description}</p>
        </div>
      </div>
      <div className='flex items-center gap-3'>
        {step.error && (
          <span className='text-xs text-red-500 max-w-48 truncate'>
            {step.error}
          </span>
        )}
        <span className='text-sm font-mono text-muted-foreground w-16 text-right'>
          {step.latencyMs} ms
        </span>
      </div>
    </div>
  );
}

export function DiagnosticsTab({
  testResult,
  testing,
  onRunTest,
  backend,
}: DiagnosticsTabProps) {
  return (
    <div className='space-y-6'>
      {/* Описание и кнопка */}
      <Card>
        <CardHeader>
          <CardTitle className='text-lg flex items-center gap-2'>
            <Zap className='size-4' />
            Тест подключения
          </CardTitle>
          <CardDescription>
            Проверяет запись, чтение и удаление тестового файла в{' '}
            {backend === 's3' ? 'S3-бакете' : 'локальном хранилище'}. Тестовый
            файл автоматически удаляется.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={onRunTest} disabled={testing}>
            {testing ? (
              <>
                <Loader2 className='size-4 mr-2 animate-spin' />
                Тестирование...
              </>
            ) : (
              <>
                <Play className='size-4 mr-2' />
                Тестировать подключение
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Результат теста */}
      {testResult && (
        <Card>
          <CardHeader>
            <div className='flex items-center justify-between'>
              <CardTitle className='text-lg'>Результат</CardTitle>
              <div className='flex items-center gap-3'>
                <Badge
                  variant={testResult.success ? 'default' : 'destructive'}
                  className={
                    testResult.success
                      ? 'bg-emerald-500/15 text-emerald-600 border-emerald-500/25 hover:bg-emerald-500/15'
                      : ''
                  }
                >
                  {testResult.success ? (
                    <CheckCircle2 className='size-3 mr-1' />
                  ) : (
                    <XCircle className='size-3 mr-1' />
                  )}
                  {testResult.success ? 'Успешно' : 'Ошибка'}
                </Badge>
                <span className='text-sm font-mono text-muted-foreground'>
                  {testResult.totalMs} ms
                </span>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className='divide-y divide-border'>
              {testResult.steps.map(step => (
                <StepRow key={step.name} step={step} />
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Подсказки */}
      {!testResult && !testing && (
        <div className='text-center py-8'>
          <p className='text-sm text-muted-foreground'>
            Нажмите кнопку выше, чтобы проверить подключение к хранилищу
          </p>
        </div>
      )}
    </div>
  );
}
