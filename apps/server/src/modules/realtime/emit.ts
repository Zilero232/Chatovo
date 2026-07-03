import type {
  FriendCallStreamSnapshot,
  RealtimeServerMessage,
  RoomsParticipantsSnapshot,
} from '@chatovo/schemas';

let broadcastPresenceMessage = (_message: RealtimeServerMessage): void => {};
let broadcastFriendsMessage = (_userId: string, _message: RealtimeServerMessage): void => {};
let broadcastRoomMessage = (_roomId: string, _message: RealtimeServerMessage): void => {};

export const bindRealtimeBroadcast = (handlers: {
  presence: (message: RealtimeServerMessage) => void;
  friends: (userId: string, message: RealtimeServerMessage) => void;
  room: (roomId: string, message: RealtimeServerMessage) => void;
}): void => {
  broadcastPresenceMessage = handlers.presence;
  broadcastFriendsMessage = handlers.friends;
  broadcastRoomMessage = handlers.room;
};

export const emitPresenceSnapshot = (snapshot: RoomsParticipantsSnapshot): void => {
  broadcastPresenceMessage({ type: 'presence.snapshot', snapshot });
};

export const emitFriendsSnapshot = (userId: string, snapshot: FriendCallStreamSnapshot): void => {
  broadcastFriendsMessage(userId, { type: 'friends.snapshot', snapshot });
};

export const emitRoomEvent = (roomId: string, message: RealtimeServerMessage): void => {
  broadcastRoomMessage(roomId, message);
};
