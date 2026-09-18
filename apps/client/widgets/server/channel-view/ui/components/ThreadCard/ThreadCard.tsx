'use client';

import { clsx } from 'clsx';
import { formatDistanceToNow } from 'date-fns';
import { Lock, Pin } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { isEmpty, isNonNullish } from 'remeda';

import { useDateLocale } from '@/entities/app/locale';
import { ThreadTagChip } from '@/entities/server/thread';
import { ThreadMenu } from '@/features/server/threads';
import { Text } from '@/ui-kit';

import type { ThreadCardProps } from './ThreadCard.types';

import s from './ThreadCard.module.scss';

export const ThreadCard = ({ thread, tagsById, isActive, canManage, onOpen }: ThreadCardProps) => {
  const t = useTranslations('server.threads');
  const dateLocale = useDateLocale();

  const tags = thread.tagIds.map((tagId) => tagsById?.get(tagId)).filter(isNonNullish);

  return (
    <div className={clsx(s.root, { [s.active]: isActive })}>
      <button className={s.trigger} type='button' onClick={onOpen}>
        <span className={s.title}>
          {thread.pinned && <Pin aria-hidden className={s.badge} />}
          {thread.locked && <Lock aria-hidden className={s.badge} />}
          <span className={s.name}>{thread.name}</span>
        </span>

        {!isEmpty(tags) && (
          <span className={s.tags}>
            {tags.map((tag) => (
              <ThreadTagChip key={tag.id} tag={tag} />
            ))}
          </span>
        )}

        <Text size='xs' tone='muted'>
          {t('messages', { count: thread.messageCount })}
          {' · '}
          {formatDistanceToNow(new Date(thread.lastMessageAt), {
            addSuffix: true,
            locale: dateLocale
          })}
        </Text>
      </button>

      <ThreadMenu canManage={canManage} className={s.menu} thread={thread} />
    </div>
  );
};
