import type {
  IncomingFriendCall,
  IncomingFriendCallResponse,
  OutgoingFriendCallResponse,
  Room
} from '@chatovo/schemas';

import { Injectable } from '@nestjs/common';
import { isNullish } from 'remeda';

import type { RingFriendCallInput } from './friend-call.service.types';

import { AppConflictException } from '../../../../common/exceptions';
import { getUserWithProfileOrThrow } from '../../../../lib';
import {
  clearPendingCallForCaller,
  getPendingCallForCallee,
  getPendingCallForCaller,
  markCallAccepted,
  markCallDeclined,
  setPendingCall
} from '../../call-store';
import { toFriendUser } from '../../mappers';
import { DmRoomService } from '../dm-room';

@Injectable()
export class FriendCallService {
  constructor(private readonly dmRoom: DmRoomService) {}

  async ringFriendCall({ userId, otherUserId }: RingFriendCallInput): Promise<Room> {
    const ringing = getPendingCallForCallee(otherUserId);

    if (!isNullish(ringing) && ringing.caller.id !== userId) {
      throw new AppConflictException('CALL_ALREADY_RINGING', 'User is already being called');
    }

    const room = await this.dmRoom.getOrCreateDmRoom({ userId, otherUserId });
    const [caller, callee] = await Promise.all([
      getUserWithProfileOrThrow(userId),
      getUserWithProfileOrThrow(otherUserId)
    ]);

    setPendingCall({
      roomId: room.id,
      caller: toFriendUser(caller),
      callee: toFriendUser(callee),
      calleeId: otherUserId
    });

    return room;
  }

  async getIncomingFriendCall(userId: string): Promise<IncomingFriendCallResponse> {
    const pending = getPendingCallForCallee(userId);

    if (isNullish(pending)) {
      return { call: null };
    }

    return {
      call: {
        roomId: pending.roomId,
        caller: pending.caller
      }
    };
  }

  async acceptIncomingFriendCall(userId: string): Promise<IncomingFriendCall | null> {
    const pending = markCallAccepted(userId);

    if (isNullish(pending)) {
      return null;
    }

    return {
      roomId: pending.roomId,
      caller: pending.caller
    };
  }

  async declineIncomingFriendCall(userId: string): Promise<void> {
    markCallDeclined(userId);
  }

  async getOutgoingFriendCall(userId: string): Promise<OutgoingFriendCallResponse> {
    const pending = getPendingCallForCaller(userId);

    if (isNullish(pending)) {
      return { call: null };
    }

    return {
      call: {
        roomId: pending.roomId,
        callee: pending.callee,
        status: pending.status
      }
    };
  }

  async ackOutgoingFriendCall(userId: string): Promise<void> {
    clearPendingCallForCaller(userId);
  }

  async cancelOutgoingFriendCall(userId: string): Promise<void> {
    clearPendingCallForCaller(userId);
  }
}
