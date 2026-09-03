import type { FriendCallStreamSnapshot, RealtimeServerMessage } from '@chatovo/schemas';

import type { PresenceSnapshots } from './realtime.types';

let broadcastPresence = (_snapshots: PresenceSnapshots): void => {};
let broadcastFriendsMessage = (_userId: string, _message: RealtimeServerMessage): void => {};
let broadcastRoomMessage = (_roomId: string, _message: RealtimeServerMessage): void => {};

export const bindRealtimeBroadcast = (handlers: {
  presence: (snapshots: PresenceSnapshots) => void;
  friends: (userId: string, message: RealtimeServerMessage) => void;
  room: (roomId: string, message: RealtimeServerMessage) => void;
}): void => {
  broadcastPresence = handlers.presence;
  broadcastFriendsMessage = handlers.friends;
  broadcastRoomMessage = handlers.room;
};

export const emitPresenceSnapshot = (snapshots: PresenceSnapshots): void => {
  broadcastPresence(snapshots);
};

export const emitFriendsSnapshot = (userId: string, snapshot: FriendCallStreamSnapshot): void => {
  broadcastFriendsMessage(userId, { type: 'friends.snapshot', snapshot });
};

export const emitUserEvent = (userId: string, message: RealtimeServerMessage): void => {
  broadcastFriendsMessage(userId, message);
};

export const emitRoomEvent = (roomId: string, message: RealtimeServerMessage): void => {
  broadcastRoomMessage(roomId, message);
};
