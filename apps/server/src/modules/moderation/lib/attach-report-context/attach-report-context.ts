import type { AbuseReport } from '../../../../../generated';
import type { AttachReportContextInput, ReportRelatedIds } from './attach-report-context.types';

import { toAbuseReport } from '../../mappers';

/** Every id a batch of reports points at, so the rows can be fetched in one round. */
export const collectReportRelatedIds = (reports: AbuseReport[]): ReportRelatedIds => {
  const userIds = new Set(reports.map((report) => report.reporterId));
  const messageIds = new Set<string>();
  const roomIds = new Set<string>();

  for (const report of reports) {
    if (report.roomId) {
      roomIds.add(report.roomId);
    }

    if (report.target === 'user') {
      userIds.add(report.targetId);
    }

    if (report.target === 'message') {
      messageIds.add(report.targetId);
    }

    if (report.target === 'room') {
      roomIds.add(report.targetId);
    }
  }

  return { userIds: [...userIds], messageIds: [...messageIds], roomIds: [...roomIds] };
};

/** Decorates raw reports with the names a moderator needs, in three queries rather than per row. */
export const attachReportContext = async ({ reports, prisma }: AttachReportContextInput) => {
  const { userIds, messageIds, roomIds } = collectReportRelatedIds(reports);

  const [users, messages, rooms] = await Promise.all([
    prisma.user.findMany({
      where: { id: { in: userIds } },
      select: { id: true, name: true, email: true }
    }),
    prisma.message.findMany({
      where: { id: { in: messageIds } },
      select: { id: true, body: true }
    }),
    prisma.room.findMany({ where: { id: { in: roomIds } }, select: { id: true, name: true } })
  ]);

  const userById = new Map(users.map((user) => [user.id, user]));
  const messageById = new Map(messages.map((message) => [message.id, message.body]));
  const roomById = new Map(rooms.map((room) => [room.id, room.name]));

  return reports.map((report) => ({
    ...toAbuseReport(report),
    reporter: userById.get(report.reporterId) ?? null,
    reportedUser: report.target === 'user' ? (userById.get(report.targetId) ?? null) : null,
    reportedMessage:
      report.target === 'message' ? (messageById.get(report.targetId) ?? null) : null,
    roomName: roomById.get(report.roomId ?? report.targetId) ?? null
  }));
};
