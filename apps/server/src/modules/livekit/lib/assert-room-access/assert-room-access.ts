import type { AssertRoomAccessInput } from './assert-room-access.types';

import {
  AppForbiddenException,
  AppInternalException,
  AppUnauthorizedException
} from '../../../../common/exceptions';
import { canAccessRoom, verifyRoomPassword } from '../../../../lib';

export const assertRoomAccess = async ({
  room,
  userId,
  password
}: AssertRoomAccessInput): Promise<void> => {
  if (canAccessRoom({ room, userId, tier: 'access' })) {
    return;
  }

  if (!password) {
    throw new AppUnauthorizedException('ROOM_PASSWORD_REQUIRED', 'Password required');
  }

  if (!room.password) {
    throw new AppInternalException('INTERNAL_ERROR', 'Room misconfigured');
  }

  if (!(await verifyRoomPassword(password, room.password))) {
    throw new AppForbiddenException('ROOM_PASSWORD_INVALID', 'Invalid password');
  }
};
