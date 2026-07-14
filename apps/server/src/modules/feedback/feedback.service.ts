import { BadRequestException, Injectable } from '@nestjs/common';

import { ATTACHMENT_MAX_BYTES } from '../../config/uploads';
import { env } from '../../core';
import { getUserWithProfileOrThrow } from '../../lib';
import { BugReport, sendEmail } from '../email';
import { notifyProblemReport } from '../telegram';
import { resolveDisplayName } from '../users/profile';

import type { ReportProblemValues } from '@chatovo/schemas';
import type Mail from 'nodemailer/lib/mailer';

type ReportProblemArgs = ReportProblemValues & {
  screenshot?: File;
};

@Injectable()
export class FeedbackService {
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
        throw new BadRequestException('Screenshot is too large');
      }

      attachments.push({
        filename: screenshot.name || 'screenshot',
        content: Buffer.from(await screenshot.arrayBuffer()),
        contentType: screenshot.type || undefined,
      });
    }

    await sendEmail({
      to: env.SUPPORT_EMAIL,
      subject: `Bug report from ${reporter}`,
      react: BugReport({
        description,
        context: { reporter, email: user.email, appVersion, platform, userAgent },
      }),
      attachments: attachments.length > 0 ? attachments : undefined,
    });

    notifyProblemReport({ reporter, email: user.email, description, platform, appVersion });
  }
}
