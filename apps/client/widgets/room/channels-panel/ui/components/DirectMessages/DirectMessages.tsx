'use client';

import { Plus } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { isEmpty } from 'remeda';
import { match } from 'ts-pattern';

import { useRoomsPresence } from '@/entities/room/room';
import { useVoiceChannels } from '@/entities/server/channel';
import { useFriends } from '@/entities/social/friend';
import { IconButtonWithTooltip, ScrollArea, Text } from '@/ui-kit';
import { FriendsDialog } from '@/widgets/social/friends-dialog';

import type { DirectMessagesProps } from './DirectMessages.types';

import { groupFriendsByPresence } from '../../../lib';
import { DirectMessageItem, FriendsSkeleton } from './components';

import s from './DirectMessages.module.scss';

export const DirectMessages = ({ onNavigate }: DirectMessagesProps = {}) => {
  const t = useTranslations('channels');

  const { data: friends, isPending } = useFriends();
  const { channels } = useVoiceChannels();
  const presence = useRoomsPresence();

  const { online, offline, roomByUserId } = groupFriendsByPresence({
    friends: friends ?? [],
    presence,
    channels
  });

  const entries = [...online, ...offline];

  return (
    <div className={s.root}>
      <div className={s.header}>
        <Text className={s.heading} size='xs' tone='muted' weight='medium'>
          {t('directMessages')}
        </Text>

        <FriendsDialog
          renderTrigger={({ onOpen }) => (
            <IconButtonWithTooltip
              icon={<Plus />}
              label={t('startConversation')}
              size='icon-xs'
              tooltipSide='top'
              type='button'
              onClick={onOpen}
            />
          )}
        />
      </div>

      <ScrollArea className={s.scroll}>
        <div className={s.list}>
          {match({ isPending, isEmpty: isEmpty(entries) })
            .with({ isPending: true }, () => <FriendsSkeleton />)
            .with({ isEmpty: true }, () => (
              <Text className={s.empty} size='xs' tone='muted'>
                {t('noDirectMessages')}
              </Text>
            ))
            .otherwise(() => (
              <>
                {entries.map((entry) => (
                  <DirectMessageItem
                    key={entry.friendshipId}
                    room={roomByUserId.get(entry.user.id)}
                    user={entry.user}
                    onNavigate={onNavigate}
                  />
                ))}
              </>
            ))}
        </div>
      </ScrollArea>
    </div>
  );
};
