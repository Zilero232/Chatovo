import { sendIncomingCallPush } from '../push/push-sender';
import { emitFriendsSnapshot } from '../realtime/emit';

import type { FriendCallStreamSnapshot, FriendUser } from '@chatovo/schemas';

const CALL_TTL_MS = 60_000;

export type FriendCallStatus = 'ringing' | 'accepted' | 'declined';

export type PendingFriendCall = {
  roomId: string;
  caller: FriendUser;
  callee: FriendUser;
  calleeId: string;
  status: FriendCallStatus;
  expiresAt: number;
};

const byCallee = new Map<string, PendingFriendCall>();
const byCaller = new Map<string, PendingFriendCall>();
const friendsEpochByUser = new Map<string, number>();

const isExpired = (call: PendingFriendCall) => Date.now() > call.expiresAt;

const emitUser = (userId: string) => {
  emitFriendsSnapshot(userId, getUserCallSnapshot(userId));
};

const emitUsers = (userIds: Iterable<string>) => {
  for (const userId of userIds) {
    emitUser(userId);
  }
};

const pruneExpired = () => {
  const affected = new Set<string>();

  for (const [calleeId, call] of byCallee) {
    if (isExpired(call)) {
      byCallee.delete(calleeId);
      byCaller.delete(call.caller.id);
      affected.add(calleeId);
      affected.add(call.caller.id);
    }
  }

  for (const [callerId, call] of byCaller) {
    if (isExpired(call)) {
      byCaller.delete(callerId);
      byCallee.delete(call.calleeId);
      affected.add(callerId);
      affected.add(call.calleeId);
    }
  }

  emitUsers(affected);
};

export const getUserCallSnapshot = (userId: string): FriendCallStreamSnapshot => {
  pruneExpired();

  const incomingCall = byCallee.get(userId);
  const outgoingCall = byCaller.get(userId);

  return {
    incoming:
      incomingCall && !isExpired(incomingCall) && incomingCall.status === 'ringing'
        ? { roomId: incomingCall.roomId, caller: incomingCall.caller }
        : null,
    outgoing:
      outgoingCall && !isExpired(outgoingCall)
        ? {
            roomId: outgoingCall.roomId,
            callee: outgoingCall.callee,
            status: outgoingCall.status,
          }
        : null,
    friendsEpoch: friendsEpochByUser.get(userId) ?? 0,
  };
};

export const bumpFriendsEpoch = (...userIds: string[]): void => {
  const unique = new Set(userIds);

  for (const userId of unique) {
    friendsEpochByUser.set(userId, (friendsEpochByUser.get(userId) ?? 0) + 1);
    emitUser(userId);
  }
};

export const setPendingCall = (input: {
  roomId: string;
  caller: FriendUser;
  callee: FriendUser;
  calleeId: string;
}): void => {
  pruneExpired();

  const pending: PendingFriendCall = {
    ...input,
    status: 'ringing',
    expiresAt: Date.now() + CALL_TTL_MS,
  };

  byCallee.set(input.calleeId, pending);
  byCaller.set(input.caller.id, pending);

  emitUsers([input.calleeId, input.caller.id]);

  void sendIncomingCallPush({
    calleeId: input.calleeId,
    caller: input.caller,
    roomId: input.roomId,
  });
};

export const getPendingCallForCallee = (calleeId: string): PendingFriendCall | null => {
  pruneExpired();

  const call = byCallee.get(calleeId);

  if (!call || isExpired(call) || call.status !== 'ringing') {
    return null;
  }

  return call;
};

export const getPendingCallForCaller = (callerId: string): PendingFriendCall | null => {
  pruneExpired();

  const call = byCaller.get(callerId);

  if (!call || isExpired(call)) {
    byCaller.delete(callerId);

    return null;
  }

  return call;
};

export const markCallAccepted = (calleeId: string): PendingFriendCall | null => {
  pruneExpired();

  const call = byCallee.get(calleeId);

  if (!call || isExpired(call) || call.status !== 'ringing') {
    return null;
  }

  call.status = 'accepted';
  byCallee.delete(calleeId);

  emitUsers([calleeId, call.caller.id]);

  return call;
};

export const markCallDeclined = (calleeId: string): void => {
  pruneExpired();

  const call = byCallee.get(calleeId);

  if (!call || isExpired(call)) {
    byCallee.delete(calleeId);

    return;
  }

  call.status = 'declined';
  byCallee.delete(calleeId);

  emitUsers([calleeId, call.caller.id]);
};

export const clearPendingCallForCaller = (callerId: string): void => {
  const call = byCaller.get(callerId);

  if (!call) {
    byCaller.delete(callerId);

    return;
  }

  byCallee.delete(call.calleeId);
  byCaller.delete(callerId);

  emitUsers([callerId, call.calleeId]);
};
