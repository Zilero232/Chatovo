'use client';

import type { FriendEntry } from '@chatovo/schemas';

import { match, P } from 'ts-pattern';

import { useRooms, useRoomsPresence } from '@/entities/room/room';
import { useFriends } from '@/entities/social/friend';

import type { ChannelsFriendsProps } from './ChannelsFriends.types';

import { groupFriendsByPresence } from '../../../lib';
import { FriendsGroup, FriendsSkeleton } from './components';

import s from './ChannelsFriends.module.scss';

const hasFriends = (friends: FriendEntry[] | undefined): friends is FriendEntry[] =>
  (friends?.length ?? 0) > 0;

export const ChannelsFriends = ({ onNavigate }: ChannelsFriendsProps = {}) => {
  const { data: friends, isPending } = useFriends();
  const { rooms } = useRooms();
  const presence = useRoomsPresence();

  const { online, offline, roomByUserId } = groupFriendsByPresence({
    friends: friends ?? [],
    presence,
    rooms
  });

  return (
    <div className={s.root}>
      {match({ isPending, friends })
        .with({ isPending: true }, () => <FriendsSkeleton />)
        .with({ friends: P.when(hasFriends) }, () => (
          <>
            <FriendsGroup
              friends={online}
              labelKey='online'
              roomByUserId={roomByUserId}
              onNavigate={onNavigate}
            />
            <FriendsGroup
              friends={offline}
              labelKey='offline'
              roomByUserId={roomByUserId}
              onNavigate={onNavigate}
            />
          </>
        ))
        .otherwise(() => null)}
    </div>
  );
};
