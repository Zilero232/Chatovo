import { entries, indexBy, isNullish, partition, sortBy } from 'remeda';

import type {
  FriendRoomRef,
  FriendsByPresence,
  GroupFriendsByPresenceInput
} from './group-friends-by-presence.types';

const buildRoomByUserId = ({
  presence,
  channels
}: Pick<GroupFriendsByPresenceInput, 'channels' | 'presence'>) => {
  const channelsById = indexBy(channels, (channel) => channel.id);
  const roomByUserId = new Map<string, FriendRoomRef>();

  entries(presence).forEach(([roomId, participants]) => {
    const channel = channelsById[roomId];

    if (isNullish(channel)) {
      return;
    }

    participants.forEach((participant) => {
      roomByUserId.set(participant.identity, {
        id: channel.id,
        name: channel.name,
        serverId: channel.serverId
      });
    });
  });

  return roomByUserId;
};

/** Splits friends into online (or in a channel) and offline, each sorted by channel, presence and name. */
export const groupFriendsByPresence = ({
  friends,
  presence,
  channels
}: GroupFriendsByPresenceInput): FriendsByPresence => {
  const roomByUserId = buildRoomByUserId({ presence, channels });

  const sorted = sortBy(
    friends,
    (entry) => (roomByUserId.has(entry.user.id) ? 0 : 1),
    (entry) => (entry.user.isOnline ? 0 : 1),
    (entry) => entry.user.name.toLowerCase()
  );

  const [online, offline] = partition(
    sorted,
    (entry) => entry.user.isOnline || roomByUserId.has(entry.user.id)
  );

  return { online, offline, roomByUserId };
};
