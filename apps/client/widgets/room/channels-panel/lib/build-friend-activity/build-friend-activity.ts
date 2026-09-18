import { entries, indexBy, isNullish, sortBy } from 'remeda';

import type { BuildFriendActivityInput, FriendActivity } from './build-friend-activity.types';

export const buildFriendActivity = ({
  friends,
  presence,
  channels
}: BuildFriendActivityInput): FriendActivity => {
  const friendsById = indexBy(friends, (entry) => entry.user.id);
  const channelsById = indexBy(channels, (channel) => channel.id);
  const busyIds = new Set<string>();

  const groups = entries(presence).flatMap(([roomId, participants]) => {
    const channel = channelsById[roomId];

    if (isNullish(channel)) {
      return [];
    }

    const matched = participants.flatMap((participant) => {
      const entry = friendsById[participant.identity];

      if (isNullish(entry)) {
        return [];
      }

      busyIds.add(entry.user.id);

      return [
        { friendshipId: entry.friendshipId, isLive: !participant.micMuted, user: entry.user }
      ];
    });

    if (matched.length === 0) {
      return [];
    }

    return [
      {
        friends: sortBy(
          matched,
          (friend) => (friend.isLive ? 0 : 1),
          (friend) => friend.user.name.toLowerCase()
        ),
        roomId: channel.id,
        roomName: channel.name,
        serverId: channel.serverId,
        serverName: channel.serverName,
        totalInRoom: participants.length
      }
    ];
  });

  const online = friends.filter((entry) => entry.user.isOnline && !busyIds.has(entry.user.id));

  return {
    inRooms: sortBy(
      groups,
      (group) => -group.friends.length,
      (group) => group.roomName.toLowerCase()
    ),
    online: sortBy(online, (entry) => entry.user.name.toLowerCase())
  };
};
