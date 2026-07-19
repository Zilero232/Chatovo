import { realtimeClientMessageSchema, safeJsonParse } from '@chatovo/schemas';
import { match } from 'ts-pattern';

import { filterExistingRooms } from '../../../lib';
import { patchParticipant } from '../../livekit/presence';
import { setConnectionRooms } from '../connection-store';
import { emitRoomEvent } from '../emit';

import type { RealtimeConnection } from '../realtime.types';

export const handleClientMessage = async (
  connection: RealtimeConnection,
  raw: string | Buffer | ArrayBuffer | SharedArrayBuffer | Blob,
): Promise<void> => {
  const text =
    typeof raw === 'string'
      ? raw
      : raw instanceof Blob
        ? await raw.text()
        : new TextDecoder().decode(raw instanceof SharedArrayBuffer ? new Uint8Array(raw) : raw);
  const parsed = realtimeClientMessageSchema.safeParse(safeJsonParse(text));

  if (!parsed.success) {
    return;
  }

  await match(parsed.data)
    .with({ op: 'subscribe' }, async ({ rooms }) => {
      const existing = await filterExistingRooms(rooms);

      setConnectionRooms(connection.id, existing);
    })
    .with({ op: 'presence.patch' }, ({ roomId, micMuted, deafened }) => {
      patchParticipant(roomId, connection.userId, { micMuted, deafened });
    })
    .with({ op: 'room.reaction' }, ({ roomId, emoji }) => {
      emitRoomEvent(roomId, {
        type: 'room.reaction',
        roomId,
        emoji,
        senderId: connection.userId,
      });
    })
    .exhaustive();
};
