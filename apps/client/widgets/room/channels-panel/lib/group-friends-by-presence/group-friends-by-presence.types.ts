import type { FriendEntry, Room, RoomsParticipantsSnapshot } from '@chatovo/schemas';

export type FriendRoomRef = {
  id: string;
  name: string;
};

export type GroupFriendsByPresenceInput = {
  friends: FriendEntry[];
  presence: RoomsParticipantsSnapshot['rooms'];
  rooms: Room[];
};

export type FriendsByPresence = {
  offline: FriendEntry[];
  online: FriendEntry[];
  roomByUserId: Map<string, FriendRoomRef>;
};
