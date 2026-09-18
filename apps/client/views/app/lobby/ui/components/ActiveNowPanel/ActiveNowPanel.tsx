'use client';

import { useTranslations } from 'next-intl';
import { isEmpty } from 'remeda';

import { useRoomsPresence } from '@/entities/room/room';
import { useVoiceChannels } from '@/entities/server/channel';
import { useFriends } from '@/entities/social/friend';
import { ScrollArea, Text } from '@/ui-kit';
import { buildFriendActivity } from '@/widgets/room/channels-panel';

import { ActiveNowCard } from './components';

import s from './ActiveNowPanel.module.scss';

export const ActiveNowPanel = () => {
  const t = useTranslations('lobby.activeNow');

  const { data: friends } = useFriends();
  const { channels } = useVoiceChannels();
  const presence = useRoomsPresence();

  const { inRooms } = buildFriendActivity({ friends: friends ?? [], presence, channels });

  return (
    <aside className={s.root}>
      <Text className={s.heading} weight='semibold'>
        {t('title')}
      </Text>

      <ScrollArea className={s.scroll}>
        {isEmpty(inRooms) ? (
          <div className={s.empty}>
            <Text align='center' weight='semibold'>
              {t('emptyTitle')}
            </Text>
            <Text align='center' size='xs' tone='muted'>
              {t('emptyHint')}
            </Text>
          </div>
        ) : (
          <div className={s.list}>
            {inRooms.map((group) => (
              <ActiveNowCard key={group.roomId} group={group} />
            ))}
          </div>
        )}
      </ScrollArea>
    </aside>
  );
};
