import { hasPermission } from '@chatovo/schemas';
import { isNullish } from 'remeda';

import { basePrisma as prisma } from '../../core';
import { resolveChannelPermissions } from '../../lib';
import { emitRoomEvent } from './emit';

const TYPING_TTL_MS = 8_000;

const lastBroadcast = new Map<string, number>();

/**
 * Fans a typing indicator out to a channel, throttled per user so a fast typist
 * does not flood every subscriber with one event per keystroke.
 */
export const broadcastTyping = async ({
  channelId,
  threadId,
  userId
}: {
  channelId: string;
  threadId: string | null;
  userId: string;
}) => {
  const key = `${channelId}:${threadId ?? ''}:${userId}`;
  const now = Date.now();
  const previous = lastBroadcast.get(key) ?? 0;

  if (now - previous < TYPING_TTL_MS / 2) {
    return;
  }

  const channel = await prisma.room.findUnique({
    where: { id: channelId },
    select: { serverId: true }
  });

  if (isNullish(channel?.serverId)) {
    return;
  }

  const permissions = await resolveChannelPermissions({
    serverId: channel.serverId,
    userId,
    channelId
  });

  if (!hasPermission(permissions, 'sendMessages')) {
    return;
  }

  lastBroadcast.set(key, now);

  emitRoomEvent(channelId, {
    type: 'channel.typing',
    channelId,
    threadId,
    userId,
    expiresAt: new Date(now + TYPING_TTL_MS).toISOString()
  });
};
