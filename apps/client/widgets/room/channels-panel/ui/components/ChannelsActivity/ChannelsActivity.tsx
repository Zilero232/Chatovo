'use client';

import { useTranslations } from 'next-intl';
import { isEmpty } from 'remeda';
import { match } from 'ts-pattern';

import { useRooms, useRoomsPresence } from '@/entities/room/room';
import { useFriends } from '@/entities/social/friend';
import { ScrollArea, Skeleton } from '@/ui-kit';
import { buildFriendActivity } from '@/widgets/room/channels-panel/lib';

import type { ChannelsActivityProps } from './ChannelsActivity.types';

import { ChannelsCreateCta } from '../ChannelsCreateCta/ChannelsCreateCta';
import { ActivityEmpty, ActivityOnline, ActivityRooms } from './components';

import s from './ChannelsActivity.module.scss';

const ACTIVITY_SKELETON_KEYS = ['a', 'b'] as const;

export const ChannelsActivity = ({ onNavigate }: ChannelsActivityProps = {}) => {
  const t = useTranslations('channels.activity');

  const { data: friends, isPending } = useFriends();
  const { rooms } = useRooms();
  const presence = useRoomsPresence();

  const { inRooms, online } = buildFriendActivity({ friends: friends ?? [], presence, rooms });

  return (
    <div className={s.root}>
      <div className={s.headingRow}>
        <p className={s.heading}>{t('heading')}</p>
        <ChannelsCreateCta />
      </div>

      <ScrollArea className={s.scroll}>
        <div className={s.list}>
          {match({ isPending, hasActivity: !isEmpty(inRooms) || !isEmpty(online) })
            .with({ isPending: true }, () =>
              ACTIVITY_SKELETON_KEYS.map((key) => <Skeleton key={key} className={s.skeletonCard} />)
            )
            .with({ hasActivity: false }, () => <ActivityEmpty />)
            .otherwise(() => (
              <>
                {!isEmpty(inRooms) && <ActivityRooms groups={inRooms} onNavigate={onNavigate} />}
                {!isEmpty(online) && <ActivityOnline entries={online} />}
              </>
            ))}
        </div>
      </ScrollArea>
    </div>
  );
};
