import type { AssertRoomAccessInput } from './assert-room-access.types';

import { RoomKind } from '../../../../../generated';
import {
  AppForbiddenException,
  AppInternalException,
  AppUnauthorizedException
} from '../../../../common/exceptions';

export const assertRoomAccess = ({ room, password }: AssertRoomAccessInput): void => {
  if (room.kind === RoomKind.dm) {
    return;
  }

  if (!room.isPrivate) {
    return;
  }

  if (!password) {
    throw new AppUnauthorizedException('ROOM_PASSWORD_REQUIRED', 'Password required');
  }

  if (!room.password) {
    throw new AppInternalException('INTERNAL_ERROR', 'Room misconfigured');
  }

  if (password !== room.password) {
    throw new AppForbiddenException('ROOM_PASSWORD_INVALID', 'Invalid password');
  }
};
