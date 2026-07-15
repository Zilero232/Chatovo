import { basePrisma as prisma } from '../../core';
import { hasUserConnection } from '../realtime/connection-store';
import { sendPushToTokens } from './firebase-client';

import type { ChatMessage, FriendUser } from '@chatovo/schemas';
import type { SendPushToUserInput } from './types';

const PREVIEW_MAX = 120;

const truncate = (value: string, max: number): string => {
  if (value.length <= max) {
    return value;
  }

  return `${value.slice(0, max - 1)}…`;
};

const pruneInvalidTokens = async (tokens: string[]): Promise<void> => {
  if (tokens.length === 0) {
    return;
  }

  await prisma.pushDevice.deleteMany({ where: { token: { in: tokens } } });
};

const sendToUser = async ({
  userId,
  notification,
  data,
  channelId,
}: SendPushToUserInput): Promise<void> => {
  if (hasUserConnection(userId)) {
    return;
  }

  const devices = await prisma.pushDevice.findMany({
    where: { userId },
    select: { token: true },
  });

  if (devices.length === 0) {
    return;
  }

  const tokens = devices.map((device) => device.token);
  const invalidTokens = await sendPushToTokens({ tokens, notification, data, channelId });

  await pruneInvalidTokens(invalidTokens);
};

export const sendDmMessagePush = async (input: {
  recipientId: string;
  message: ChatMessage;
}): Promise<void> => {
  const { recipientId, message } = input;

  if (!message.senderId || message.senderId === recipientId) {
    return;
  }

  const preview = message.body.trim() || 'New message';

  await sendToUser({
    userId: recipientId,
    notification: { title: message.senderName, body: truncate(preview, PREVIEW_MAX) },
    data: {
      type: 'dm_message',
      roomId: message.roomId,
      senderId: message.senderId,
      messageId: message.id,
    },
    channelId: 'messages',
  });
};

export const sendIncomingCallPush = async (input: {
  calleeId: string;
  caller: FriendUser;
  roomId: string;
}): Promise<void> => {
  const { calleeId, caller, roomId } = input;

  await sendToUser({
    userId: calleeId,
    notification: { title: caller.name, body: 'Incoming call' },
    data: {
      type: 'incoming_call',
      roomId,
      callerId: caller.id,
    },
    channelId: 'calls',
  });
};
