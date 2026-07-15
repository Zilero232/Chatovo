import type Mail from 'nodemailer/lib/mailer';
import type { ReactElement } from 'react';

export type SendEmailParams = {
  to: string;
  subject: string;
  react: ReactElement;
  attachments?: Mail.Attachment[];
};
