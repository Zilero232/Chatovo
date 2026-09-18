'use client';

import { Pin } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { isEmpty } from 'remeda';

import { formatDateTime } from '@/shared/lib';
import { Popover, PopoverContent, PopoverTrigger, ScrollArea, Text } from '@/ui-kit';

import type { PinnedMessagesPopoverProps } from './PinnedMessagesPopover.types';

import { usePinnedMessages } from '../../../model/hooks';

import s from './PinnedMessagesPopover.module.scss';

export const PinnedMessagesPopover = ({ roomId }: PinnedMessagesPopoverProps) => {
  const t = useTranslations('chat');

  const [open, setOpen] = useState(false);

  const { pinned } = usePinnedMessages(roomId, open);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger aria-label={t('pinned')} size='icon' variant='ghost'>
        <Pin />
      </PopoverTrigger>
      <PopoverContent align='end' className={s.content}>
        <Text className={s.title} weight='semibold'>
          {t('pinned')}
        </Text>

        <ScrollArea className={s.scroll}>
          {isEmpty(pinned) ? (
            <Text size='sm' tone='muted'>
              {t('noPinned')}
            </Text>
          ) : (
            pinned.map((message) => (
              <div key={message.id} className={s.item}>
                <Text size='xs' tone='muted'>
                  {message.senderName} · {formatDateTime(new Date(message.createdAt))}
                </Text>
                <Text className={s.body} size='sm'>
                  {message.body}
                </Text>
              </div>
            ))
          )}
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
};
