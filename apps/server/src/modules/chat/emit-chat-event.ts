import { RoomKind } from '../../../generated';
import { getRoomDmRouting } from '../../lib';
import { sendDmMessagePush } from '../push/push-sender';
import { emitRoomEvent, emitUserEvent } from '../realtime/emit';

import type { ChatRealtimeEvent, ChatRealtimeEventInput } from './chat.types';

export const emitChatEvent = async (
  roomId: string,
  event: ChatRealtimeEventInput,
): Promise<void> => {
  const room = await getRoomDmRouting(roomId);

  const roomKind = room?.kind ?? RoomKind.group;
  const message = { ...event, roomId, roomKind } as ChatRealtimeEvent;

  if (room?.kind === RoomKind.dm && room.dmUserAId && room.dmUserBId) {
    emitUserEvent(room.dmUserAId, message);
    emitUserEvent(room.dmUserBId, message);

    if (event.type === 'chat.message' && event.message.senderId) {
      const recipientId =
        event.message.senderId === room.dmUserAId ? room.dmUserBId : room.dmUserAId;

      void sendDmMessagePush({ recipientId, message: event.message });
    }

    return;
  }

  emitRoomEvent(roomId, message);
};
