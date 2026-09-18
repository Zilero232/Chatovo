import type { FriendEntry, RoomsParticipantsSnapshot, VoiceChannelRef } from '@chatovo/schemas';

export type ActivityFriend = {
  friendshipId: string;
  isLive: boolean;
  user: FriendEntry['user'];
};

export type ActivityRoomGroup = {
  friends: ActivityFriend[];
  roomId: string;
  roomName: string;
  serverId: string;
  serverName: string;
  totalInRoom: number;
};

export type FriendActivity = {
  inRooms: ActivityRoomGroup[];
  online: FriendEntry[];
};

export type BuildFriendActivityInput = {
  channels: VoiceChannelRef[];
  friends: FriendEntry[];
  presence: RoomsParticipantsSnapshot['rooms'];
};
