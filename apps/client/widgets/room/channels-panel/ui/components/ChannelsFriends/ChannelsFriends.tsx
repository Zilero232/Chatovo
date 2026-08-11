'use client';

import type { FriendEntry } from '@chatovo/schemas';

import { AnimatePresence, motion } from 'motion/react';
import { useTranslations } from 'next-intl';
import { entries, indexBy, isEmpty, isNullish, partition, sortBy } from 'remeda';
import { match, P } from 'ts-pattern';

import { useRooms, useRoomsPresence } from '@/entities/room/room';
import { useFriends } from '@/entities/social/friend';
import {
  LIST_ITEM_ANIMATE,
  LIST_ITEM_EXIT,
  LIST_ITEM_INITIAL,
  LIST_ITEM_TRANSITION
} from '@/shared/config';
import { useLiteMotion } from '@/shared/hooks';
import { Skeleton } from '@/shared/ui';

import type { ChannelsFriendsProps } from './ChannelsFriends.types';

import { ChannelsFriendItem } from './components';

import s from './ChannelsFriends.module.scss';

const FRIENDS_SKELETON_KEYS = ['a', 'b', 'c'] as const;

const hasFriends = (friends: FriendEntry[] | undefined): friends is FriendEntry[] =>
  (friends?.length ?? 0) > 0;

export const ChannelsFriends = ({ onNavigate }: ChannelsFriendsProps = {}) => {
  const t = useTranslations('channels.friends');

  const { layout, resolveTransition } = useLiteMotion();

  const { data: friends, isPending } = useFriends();
  const { rooms } = useRooms();
  const presence = useRoomsPresence();

  const roomsById = indexBy(rooms, (room) => room.id);
  const roomByUserId = new Map<string, { id: string; name: string }>();

  entries(presence).forEach(([roomId, participants]) => {
    const room = roomsById[roomId];

    if (isNullish(room)) {
      return;
    }

    participants.forEach((participant) => {
      roomByUserId.set(participant.identity, { id: room.id, name: room.name });
    });
  });

  const sorted = sortBy(
    friends ?? [],
    (entry) => (roomByUserId.has(entry.user.id) ? 0 : 1),
    (entry) => (entry.user.isOnline ? 0 : 1),
    (entry) => entry.user.name.toLowerCase()
  );

  const [online, offline] = partition(
    sorted,
    (entry) => entry.user.isOnline || roomByUserId.has(entry.user.id)
  );

  const renderGroup = (group: FriendEntry[], labelKey: 'offline' | 'online') => {
    if (isEmpty(group)) {
      return null;
    }

    return (
      <div className={s.group}>
        <p className={s.sectionLabel}>{t(labelKey, { count: group.length })}</p>

        <AnimatePresence initial={false} mode='popLayout'>
          {group.map((entry) => (
            <motion.div
              key={entry.friendshipId}
              animate={LIST_ITEM_ANIMATE}
              exit={LIST_ITEM_EXIT}
              initial={LIST_ITEM_INITIAL}
              layout={layout}
              transition={resolveTransition(LIST_ITEM_TRANSITION)}
            >
              <ChannelsFriendItem
                room={roomByUserId.get(entry.user.id)}
                user={entry.user}
                onNavigate={onNavigate}
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    );
  };

  return (
    <div className={s.root}>
      {match({ isPending, friends })
        .with({ isPending: true }, () => (
          <div className={s.group}>
            <p className={s.sectionLabel}>{t('heading')}</p>
            {FRIENDS_SKELETON_KEYS.map((key) => (
              <Skeleton key={key} className={s.skeletonItem} />
            ))}
          </div>
        ))
        .with({ friends: P.when(hasFriends) }, () => (
          <>
            {renderGroup(online, 'online')}
            {renderGroup(offline, 'offline')}
          </>
        ))
        .otherwise(() => null)}
    </div>
  );
};
