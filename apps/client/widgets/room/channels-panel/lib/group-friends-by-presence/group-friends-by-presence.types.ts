import type { FriendEntry, RoomsParticipantsSnapshot, VoiceChannelRef } from '@chatovo/schemas';

export type FriendRoomRef = {
  id: string;
  name: string;
  serverId: string;
};

export type FriendsByPresence = {
  offline: FriendEntry[];
  online: FriendEntry[];
  roomByUserId: Map<string, FriendRoomRef>;
};

export type GroupFriendsByPresenceInput = {
  channels: VoiceChannelRef[];
  friends: FriendEntry[];
  presence: RoomsParticipantsSnapshot['rooms'];
};
