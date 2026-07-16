import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';

import { DomainEvent } from '../../common/events/domain-events';
import { AppBadRequestException } from '../../common/exceptions';
import { AppConfigService } from '../../config/config.module';
import { ATTACHMENT_MAX_BYTES } from '../../config/uploads';
import { getUserWithProfileOrThrow } from '../../lib';
import { BugReport, sendEmail } from '../email';
import { resolveDisplayName } from '../users/profile';

import type Mail from 'nodemailer/lib/mailer';
import type { ProblemReportedEvent } from '../../common/events/domain-events';
import type { ReportProblemArgs } from './feedback.types';

@Injectable()
export class FeedbackService {
  constructor(
    private readonly config: AppConfigService,
    private readonly events: EventEmitter2,
  ) {}

  async reportProblem(
    { description, appVersion, userAgent, platform, screenshot }: ReportProblemArgs,
    userId: string,
  ): Promise<void> {
    const user = await getUserWithProfileOrThrow(userId);

    const reporter = resolveDisplayName({
      displayName: user.profile?.displayName,
      name: user.name,
      email: user.email,
      userId,
    });

    const attachments: Mail.Attachment[] = [];

    if (screenshot) {
      if (screenshot.size > ATTACHMENT_MAX_BYTES) {
        throw new AppBadRequestException('SCREENSHOT_TOO_LARGE', 'Screenshot is too large');
      }

      attachments.push({
        filename: screenshot.name || 'screenshot',
        content: Buffer.from(await screenshot.arrayBuffer()),
        contentType: screenshot.type || undefined,
      });
    }

    await sendEmail({
      to: this.config.get('SUPPORT_EMAIL'),
      subject: `Bug report from ${reporter}`,
      react: BugReport({
        description,
        context: { reporter, email: user.email, appVersion, platform, userAgent },
      }),
      attachments: attachments.length > 0 ? attachments : undefined,
    });

    this.events.emit(DomainEvent.ProblemReported, {
      reporter,
      email: user.email,
      description,
      platform,
      appVersion,
    } satisfies ProblemReportedEvent);
  }
}
