import type { AdminReportQuery } from '@chatovo/schemas';

import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { isNonNullish, isNullish } from 'remeda';

import type { AbuseReportedEvent } from '../../../../common/events/domain-events';
import type {
  ReportAbuseInput,
  ReportAbuseTarget,
  ResolveReportInput
} from '../../moderation.service.types';

import { DomainEvent } from '../../../../common/events/domain-events';
import {
  AppBadRequestException,
  AppConflictException,
  AppNotFoundException
} from '../../../../common/exceptions';
import { AppConfigService } from '../../../../config/config.module';
import { PrismaService } from '../../../../core';
import { getUserWithProfileOrThrow } from '../../../../lib';
import { AbuseReport, sendEmail } from '../../../email';
import { resolveDisplayName } from '../../../users';
import { assertCanReportTarget, attachReportContext, toPageArgs } from '../../lib';
import { toAbuseReport } from '../../mappers';

@Injectable()
export class AbuseReportService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly config: AppConfigService,
    private readonly events: EventEmitter2
  ) {}

  async report({ input, reporterId }: ReportAbuseInput) {
    const { target, targetId, reason, comment } = input;

    if (target === 'user' && targetId === reporterId) {
      throw new AppBadRequestException('ABUSE_SELF_REPORT', 'Cannot report yourself');
    }

    const roomId = await assertCanReportTarget({ target, targetId, reporterId });

    await this.assertNotAlreadyReported({ target, targetId, reporterId });

    const reporter = await getUserWithProfileOrThrow(reporterId);

    const created = await this.prisma.abuseReport.create({
      data: { target, targetId, reason, comment: comment ?? null, roomId, reporterId }
    });

    const reporterName = resolveDisplayName({
      displayName: reporter.profile?.displayName,
      name: reporter.name,
      userId: reporterId
    });

    const [targetName, roomName] = await Promise.all([
      this.resolveTargetName({ target, targetId }),
      this.resolveRoomName(roomId)
    ]);

    await sendEmail({
      to: this.config.get('SUPPORT_EMAIL'),
      subject: `Abuse report: ${reason} on a ${target}`,
      react: AbuseReport({
        reportId: created.id,
        context: {
          reason,
          target,
          targetId,
          targetName,
          roomName,
          comment,
          reporter: reporterName,
          reporterEmail: reporter.email
        }
      })
    });

    this.events.emit(DomainEvent.AbuseReported, {
      reportId: created.id,
      reporter: reporterName,
      target,
      targetId,
      reason,
      comment,
      roomName
    } satisfies AbuseReportedEvent);

    return toAbuseReport(created);
  }

  async list(query: AdminReportQuery) {
    const { handled, page, perPage } = query;

    const reports = await this.prisma.abuseReport.findMany({
      where: { handled },
      orderBy: { createdAt: 'desc' },
      ...toPageArgs({ page, perPage })
    });

    return attachReportContext({ reports, prisma: this.prisma });
  }

  async resolve({ reportId, adminId }: ResolveReportInput) {
    const report = await this.prisma.abuseReport.findUnique({ where: { id: reportId } });

    if (isNullish(report)) {
      throw new AppNotFoundException('ABUSE_REPORT_NOT_FOUND', 'Report not found');
    }

    const updated = await this.prisma.abuseReport.update({
      where: { id: reportId },
      data: { handled: true, handledAt: new Date(), handledById: adminId }
    });

    return toAbuseReport(updated);
  }

  private async assertNotAlreadyReported({ target, targetId, reporterId }: ReportAbuseTarget) {
    const pending = await this.prisma.abuseReport.findFirst({
      where: { reporterId, target, targetId, handled: false },
      select: { id: true }
    });

    if (isNonNullish(pending)) {
      throw new AppConflictException('ABUSE_ALREADY_REPORTED', 'Report is already pending');
    }
  }

  private async resolveTargetName({ target, targetId }: { target: string; targetId: string }) {
    if (target !== 'user') {
      return undefined;
    }

    const user = await this.prisma.user.findUnique({
      where: { id: targetId },
      select: { name: true, email: true }
    });

    return user ? `${user.name} <${user.email}>` : undefined;
  }

  private async resolveRoomName(roomId: string | null) {
    if (!roomId) {
      return undefined;
    }

    const room = await this.prisma.room.findUnique({
      where: { id: roomId },
      select: { name: true }
    });

    return room?.name;
  }
}
