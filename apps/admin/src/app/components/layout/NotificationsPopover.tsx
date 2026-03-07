import { useState } from 'react';
import { Bell, Bot, Calendar, CheckCircle2, Settings } from 'lucide-react';
import { Badge } from '@/app/components/ui/badge';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/app/components/ui/popover';
import { ScrollArea } from '@/app/components/ui/scroll-area';
import { Separator } from '@/app/components/ui/separator';
import { Button } from '@/app/components/ui/button';
import {
  agentNotifications,
  publicationNotifications,
} from './header.constants';

export function NotificationsPopover() {
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  const handleConfigureNotifications = () => {
    setNotificationsOpen(false);
    console.log('Configure notifications clicked');
  };

  return (
    <Popover open={notificationsOpen} onOpenChange={setNotificationsOpen}>
      <PopoverTrigger asChild>
        <button className='relative inline-flex items-center justify-center rounded-md transition-colors hover:bg-accent hover:text-accent-foreground h-10 w-10 [&_svg]:opacity-40 [&_svg]:hover:opacity-100 [&_svg]:transition-opacity'>
          <Bell className='h-5 w-5' />
          <Badge className='absolute right-[1px] top-[2px] h-3.5 w-3.5 rounded-full p-0 flex items-center justify-center text-[9px] bg-green-500 text-white hover:bg-green-600 pointer-events-none'>
            {agentNotifications.length + publicationNotifications.length}
          </Badge>
        </button>
      </PopoverTrigger>
      <PopoverContent className='w-[400px] p-0' align='end' sideOffset={8}>
        <div className='flex flex-col'>
          <div className='px-4 py-3 border-b'>
            <h3 className='font-semibold text-sm'>Уведомления</h3>
          </div>

          <ScrollArea className='max-h-[500px]'>
            <div className='p-2'>
              {agentNotifications.length > 0 && (
                <div className='mb-2'>
                  <div className='px-2 py-1.5 text-xs font-medium text-muted-foreground'>
                    От AI-агентов
                  </div>
                  <div className='space-y-1'>
                    {agentNotifications.map(notification => (
                      <button
                        key={notification.id}
                        className='w-full text-left px-3 py-2.5 rounded-md hover:bg-muted/50 transition-colors group'
                      >
                        <div className='flex gap-3'>
                          <div className='flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center'>
                            <Bot className='h-4 w-4 text-primary' />
                          </div>
                          <div className='flex-1 min-w-0'>
                            <div className='flex items-start justify-between gap-2 mb-0.5'>
                              <p className='text-sm font-medium'>
                                {notification.title}
                              </p>
                              <CheckCircle2 className='h-4 w-4 text-green-500 flex-shrink-0' />
                            </div>
                            <p className='text-xs text-muted-foreground line-clamp-2 mb-1'>
                              {notification.description}
                            </p>
                            <p className='text-xs text-muted-foreground/70'>
                              {notification.time}
                            </p>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {agentNotifications.length > 0 &&
                publicationNotifications.length > 0 && (
                  <Separator className='my-2' />
                )}

              {publicationNotifications.length > 0 && (
                <div>
                  <div className='px-2 py-1.5 text-xs font-medium text-muted-foreground'>
                    Грядущие публикации
                  </div>
                  <div className='space-y-1'>
                    {publicationNotifications.map(notification => (
                      <button
                        key={notification.id}
                        className='w-full text-left px-3 py-2.5 rounded-md hover:bg-muted/50 transition-colors group'
                      >
                        <div className='flex gap-3'>
                          <div className='flex-shrink-0 w-8 h-8 rounded-full bg-muted flex items-center justify-center'>
                            <Calendar className='h-4 w-4 text-muted-foreground' />
                          </div>
                          <div className='flex-1 min-w-0'>
                            <div className='flex items-start justify-between gap-2 mb-0.5'>
                              <p className='text-sm font-medium'>
                                {notification.title}
                              </p>
                            </div>
                            <p className='text-xs text-muted-foreground line-clamp-2 mb-1'>
                              {notification.description}
                            </p>
                            <p className='text-xs text-muted-foreground/70'>
                              {notification.time}
                            </p>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>

          <div className='border-t p-2'>
            <Button
              variant='ghost'
              className='w-full justify-start text-sm h-9'
              onClick={handleConfigureNotifications}
            >
              <Settings className='h-4 w-4 mr-2' />
              Настроить уведомления
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
