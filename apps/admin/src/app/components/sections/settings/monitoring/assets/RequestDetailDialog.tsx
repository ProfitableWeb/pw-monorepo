/**
 * PW-042 | Модалка с подробной информацией о запросе.
 * Показывает IP, User-Agent, пользователя, Request ID —
 * данные, полезные для идентификации атак и спамеров.
 */

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/app/components/ui/dialog';
import { Globe, Monitor, User, Hash, Clock, ArrowRight } from 'lucide-react';

/** Общие поля запроса, присутствующие и в ErrorLogEntry, и в AuditLogEntry */
export interface RequestDetail {
  timestamp: string;
  ipAddress: string | null;
  userAgent: string | null;
  requestId: string | null;
  requestMethod?: string | null;
  requestPath?: string | null;
  statusCode?: number | null;
  userId: string | null;
  userName: string | null;
  userEmail: string | null;
}

interface RequestDetailDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  detail: RequestDetail | null;
}

/** Упрощённый парсинг User-Agent для отображения */
function parseUserAgent(ua: string): { browser: string; os: string } {
  let browser = 'Неизвестно';
  let os = 'Неизвестно';

  // ОС
  if (ua.includes('Windows NT 10')) os = 'Windows 10/11';
  else if (ua.includes('Windows NT')) os = 'Windows';
  else if (ua.includes('Mac OS X')) os = 'macOS';
  else if (ua.includes('iPhone')) os = 'iOS (iPhone)';
  else if (ua.includes('iPad')) os = 'iOS (iPad)';
  else if (ua.includes('Android')) os = 'Android';
  else if (ua.includes('Linux')) os = 'Linux';

  // Браузер / клиент
  if (ua.startsWith('python-requests')) browser = 'python-requests (скрипт)';
  else if (ua.startsWith('curl')) browser = 'curl (CLI)';
  else if (ua.includes('Chrome') && !ua.includes('Edg'))
    browser = 'Chrome ' + (ua.match(/Chrome\/([\d.]+)/)?.[1] ?? '');
  else if (ua.includes('Firefox'))
    browser = 'Firefox ' + (ua.match(/Firefox\/([\d.]+)/)?.[1] ?? '');
  else if (ua.includes('Safari') && !ua.includes('Chrome'))
    browser = 'Safari ' + (ua.match(/Version\/([\d.]+)/)?.[1] ?? '');
  else if (ua.includes('Edg'))
    browser = 'Edge ' + (ua.match(/Edg\/([\d.]+)/)?.[1] ?? '');

  return { browser: browser.trim(), os };
}

function DetailRow({
  icon,
  label,
  value,
  mono = false,
  warn = false,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  mono?: boolean;
  warn?: boolean;
}) {
  return (
    <div className='flex items-start gap-3 py-2'>
      <div className='text-muted-foreground mt-0.5 shrink-0'>{icon}</div>
      <div className='min-w-0'>
        <p className='text-xs text-muted-foreground'>{label}</p>
        <p
          className={`text-sm break-all ${mono ? 'font-mono' : ''} ${warn ? 'text-amber-500 font-medium' : ''}`}
        >
          {value}
        </p>
      </div>
    </div>
  );
}

export function RequestDetailDialog({
  open,
  onOpenChange,
  detail,
}: RequestDetailDialogProps) {
  if (!detail) return null;

  const fullDate = new Date(detail.timestamp).toLocaleString('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });

  const ua = detail.userAgent ? parseUserAgent(detail.userAgent) : null;
  const isSuspicious =
    detail.userAgent &&
    (detail.userAgent.startsWith('python-requests') ||
      detail.userAgent.startsWith('curl') ||
      detail.userAgent.length < 20);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='max-w-lg dialog-slide-top'>
        <DialogHeader>
          <DialogTitle>Подробности запроса</DialogTitle>
          <DialogDescription>
            Техническая информация для идентификации источника
          </DialogDescription>
        </DialogHeader>

        <div className='divide-y divide-border'>
          {/* Время */}
          <DetailRow
            icon={<Clock className='size-4' />}
            label='Время запроса'
            value={fullDate}
          />

          {/* Пользователь */}
          <DetailRow
            icon={<User className='size-4' />}
            label='Пользователь'
            value={
              detail.userName
                ? `${detail.userName} (${detail.userEmail ?? detail.userId})`
                : 'Аноним / не авторизован'
            }
          />

          {/* IP */}
          {detail.ipAddress && (
            <DetailRow
              icon={<Globe className='size-4' />}
              label='IP-адрес'
              value={detail.ipAddress}
              mono
            />
          )}

          {/* User-Agent — полный + разобранный */}
          {detail.userAgent && (
            <div className='py-2'>
              <div className='flex items-start gap-3'>
                <div className='text-muted-foreground mt-0.5 shrink-0'>
                  <Monitor className='size-4' />
                </div>
                <div className='min-w-0 space-y-1'>
                  <p className='text-xs text-muted-foreground'>Клиент</p>
                  {ua && (
                    <div className='flex items-center gap-2 text-sm'>
                      <span
                        className={
                          isSuspicious ? 'text-amber-500 font-medium' : ''
                        }
                      >
                        {ua.browser}
                      </span>
                      <span className='text-muted-foreground'>·</span>
                      <span>{ua.os}</span>
                      {isSuspicious && (
                        <span className='text-[10px] bg-amber-500/15 text-amber-600 px-1.5 py-0.5 rounded'>
                          Подозрительный
                        </span>
                      )}
                    </div>
                  )}
                  <p className='text-[11px] font-mono text-muted-foreground break-all leading-relaxed'>
                    {detail.userAgent}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Запрос */}
          {detail.requestMethod && detail.requestPath && (
            <DetailRow
              icon={<ArrowRight className='size-4' />}
              label='Запрос'
              value={`${detail.requestMethod} ${detail.requestPath}${detail.statusCode ? ` → ${detail.statusCode}` : ''}`}
              mono
            />
          )}

          {/* Request ID */}
          {detail.requestId && (
            <DetailRow
              icon={<Hash className='size-4' />}
              label='Request ID'
              value={detail.requestId}
              mono
            />
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
