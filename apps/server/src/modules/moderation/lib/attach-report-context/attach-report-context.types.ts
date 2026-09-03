import type { AbuseReport } from '../../../../../generated';
import type { PrismaService } from '../../../../core';

export type AttachReportContextInput = {
  reports: AbuseReport[];
  prisma: PrismaService;
};

export type ReportRelatedIds = {
  userIds: string[];
  messageIds: string[];
  roomIds: string[];
};
