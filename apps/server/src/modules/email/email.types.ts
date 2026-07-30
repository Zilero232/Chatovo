import type Mail from 'nodemailer/lib/mailer';
import type { ReactElement } from 'react';

export type SendEmailParams = {
  attachments?: Mail.Attachment[];
  react: ReactElement;
  subject: string;
  to: string;
};
