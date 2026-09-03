import { isNullish } from 'remeda';
import { match } from 'ts-pattern';

import type { AssertCanReportTargetInput } from './assert-can-report-target.types';

import { AppBadRequestException, AppNotFoundException } from '../../../../common/exceptions';
import { basePrisma as prisma } from '../../../../core';
import { assertCanAccessRoom } from '../../../../lib';

const notFound = () =>
  new AppNotFoundException('ABUSE_TARGET_NOT_FOUND', 'Reported target not found');

const reportedUser = async (targetId: string): Promise<string | null> => {
  const user = await prisma.user.findUnique({ where: { id: targetId }, select: { id: true } });

  if (isNullish(user)) {
    throw notFound();
  }

  return null;
};

const reportedMessage = async (targetId: string, reporterId: string): Promise<string> => {
  const message = await prisma.message.findUnique({
    where: { id: targetId },
    select: { roomId: true, senderId: true }
  });

  if (isNullish(message)) {
    throw notFound();
  }

  if (message.senderId === reporterId) {
    throw new AppBadRequestException('ABUSE_SELF_REPORT', 'Cannot report your own message');
  }

  await assertCanAccessRoom({ roomId: message.roomId, userId: reporterId });

  return message.roomId;
};

const reportedRoom = async (targetId: string, reporterId: string): Promise<string> => {
  const room = await prisma.room.findUnique({ where: { id: targetId }, select: { id: true } });

  if (isNullish(room)) {
    throw notFound();
  }

  await assertCanAccessRoom({ roomId: room.id, userId: reporterId });

  return room.id;
};

/**
 * Verifies the reported entity exists and that the reporter may see it, and
 * returns the room it belongs to — taken from the database rather than from the
 * request, so a caller cannot attach a report to a room they picked themselves.
 */
export const assertCanReportTarget = ({
  target,
  targetId,
  reporterId
}: AssertCanReportTargetInput): Promise<string | null> =>
  match(target)
    .with('user', () => reportedUser(targetId))
    .with('message', () => reportedMessage(targetId, reporterId))
    .with('room', () => reportedRoom(targetId, reporterId))
    .exhaustive();
