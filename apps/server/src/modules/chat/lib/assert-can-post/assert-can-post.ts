import { hasPermission } from '@chatovo/schemas';
import { differenceInSeconds } from 'date-fns';
import { isNonNullish, isNullish } from 'remeda';

import type { AssertCanPostInput } from './assert-can-post.types';

import { ChannelType } from '../../../../../generated';
import { AppBadRequestException, AppForbiddenException } from '../../../../common/exceptions';
import { basePrisma as prisma } from '../../../../core';
import { assertCanAccessRoom, assertNotTimedOut, resolveChannelPermissions } from '../../../../lib';

const assertSlowModeElapsed = async ({
  roomId,
  userId,
  slowMode
}: {
  roomId: string;
  userId: string;
  slowMode: number;
}) => {
  const previous = await prisma.message.findFirst({
    where: { roomId, senderId: userId, deletedAt: null },
    orderBy: { createdAt: 'desc' },
    select: { createdAt: true }
  });

  if (isNullish(previous)) {
    return;
  }

  const elapsed = differenceInSeconds(new Date(), previous.createdAt);

  if (elapsed < slowMode) {
    throw new AppBadRequestException(
      'CHANNEL_SLOW_MODE',
      `Slow mode: wait ${slowMode - elapsed}s before posting again`
    );
  }
};

/**
 * Guards posting into a room. A DM keeps the membership rule; a server channel
 * additionally checks the timeout, `sendMessages`, the announcement-channel
 * restriction and the per-channel slow mode. Returns the resolved mask so the
 * caller can decide about `@everyone` without a second lookup.
 */
export const assertCanPost = async ({ roomId, threadId, userId }: AssertCanPostInput) => {
  await assertCanAccessRoom({ roomId, userId });

  const channel = await prisma.room.findUnique({
    where: { id: roomId },
    select: { serverId: true, type: true, slowMode: true, archivedAt: true }
  });

  if (isNullish(channel) || isNullish(channel.serverId)) {
    return null;
  }

  if (isNonNullish(channel.archivedAt)) {
    throw new AppBadRequestException('CHANNEL_ARCHIVED', 'This channel is archived');
  }

  if (channel.type === ChannelType.voice) {
    throw new AppBadRequestException('CHANNEL_TYPE_MISMATCH', 'This channel has no text chat');
  }

  await assertNotTimedOut({ serverId: channel.serverId, userId });

  const permissions = await resolveChannelPermissions({
    serverId: channel.serverId,
    userId,
    channelId: roomId
  });

  const required = isNonNullish(threadId) ? 'sendMessagesInThreads' : 'sendMessages';

  if (!hasPermission(permissions, required)) {
    throw new AppForbiddenException('PERMISSION_DENIED', 'Cannot post in this channel');
  }

  if (channel.type === ChannelType.announcement && !hasPermission(permissions, 'manageMessages')) {
    throw new AppForbiddenException('PERMISSION_DENIED', 'This channel is announcement-only');
  }

  if (channel.slowMode > 0 && !hasPermission(permissions, 'manageMessages')) {
    await assertSlowModeElapsed({ roomId, userId, slowMode: channel.slowMode });
  }

  return { serverId: channel.serverId, permissions };
};
