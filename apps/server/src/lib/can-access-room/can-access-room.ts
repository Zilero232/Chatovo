import { match } from 'ts-pattern';

import type { CanAccessRoomInput } from './can-access-room.types';

import { RoomKind } from '../../../generated';
import { hasRoomGrant } from '../../modules/livekit';

/**
 * The single room-access rule, in two tiers.
 * `view` guards metadata (name, isPrivate): DM membership only, so a private group room
 * stays readable and the client can render its password prompt.
 * `access` guards contents: DM membership plus ownership or a live LiveKit grant.
 */
export const canAccessRoom = ({ room, userId, tier }: CanAccessRoomInput): boolean =>
  match(room)
    .with(
      { kind: RoomKind.dm },
      ({ dmUserAId, dmUserBId }) => dmUserAId === userId || dmUserBId === userId
    )
    .with({ isPrivate: true }, ({ id, ownerId }) => {
      if (tier === 'view') {
        return true;
      }

      return ownerId === userId || hasRoomGrant(id, userId);
    })
    .otherwise(() => true);
