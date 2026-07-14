import { basePrisma as prisma } from '../../core';
import { sendDmMessagePush } from '../push/push-sender';
import { emitRoomEvent, emitUserEvent } from '../realtime/emit';

import type { ChatMessage, RealtimeServerMessage } from '@chatovo/schemas';

type ChatRealtimeEvent = Extract<
  RealtimeServerMessage,
  { type: 'chat.message' } | { type: 'chat.edit' } | { type: 'chat.delete' }
>;

type ChatRealtimeEventInput =
  | { type: 'chat.message'; message: ChatMessage }
  | { type: 'chat.edit'; id: string; body: string; editedAt: string }
  | { type: 'chat.delete'; id: string; deletedAt: string };

export const emitChatEvent = async (
  roomId: string,
  event: ChatRealtimeEventInput,
): Promise<void> => {
  const room = await prisma.room.findUnique({
    where: { id: roomId },
    select: { kind: true, dmUserAId: true, dmUserBId: true },
  });

  const roomKind = room?.kind ?? 'group';
  const message = { ...event, roomId, roomKind } as ChatRealtimeEvent;

  if (room?.kind === 'dm' && room.dmUserAId && room.dmUserBId) {
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
