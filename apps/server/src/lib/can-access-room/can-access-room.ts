import { match } from 'ts-pattern';

import type { CanAccessRoomInput } from './can-access-room.types';

import { RoomKind } from '../../../generated';

/**
 * The room-access rule for rooms outside a server: a DM is members-only,
 * anything else is open. Channels never reach here — `assertRoomTier` routes
 * them through the permission resolver first.
 */
export const canAccessRoom = ({ room, userId }: CanAccessRoomInput): boolean =>
  match(room)
    .with(
      { kind: RoomKind.dm },
      ({ dmUserAId, dmUserBId }) => dmUserAId === userId || dmUserBId === userId
    )
    .otherwise(() => true);
