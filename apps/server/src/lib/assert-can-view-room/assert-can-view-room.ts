import type { AssertCanViewRoomInput } from './assert-can-view-room.types';

import { assertRoomTier } from '../assert-room-tier';

/**
 * Guards room metadata (name, kind, isPrivate) rather than its contents.
 * A private group room stays visible so the client can render its password prompt —
 * joining it still requires the password via assertCanAccessRoom. DM rooms stay members-only.
 */
export const assertCanViewRoom = async ({
  roomId,
  userId
}: AssertCanViewRoomInput): Promise<void> => assertRoomTier({ roomId, userId, tier: 'view' });
