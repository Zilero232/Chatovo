import { render } from '@react-email/render';
import nodemailer from 'nodemailer';
import { env } from '../../core';
import type Mail from 'nodemailer/lib/mailer';
import type { ReactElement } from 'react';

const transporter = nodemailer.createTransport({
  host: env.SMTP_HOST,
  port: env.SMTP_PORT,
  secure: env.SMTP_SECURE,
  auth: {
    user: env.SMTP_USER,
    pass: env.SMTP_PASSWORD,
  },
});

type SendEmailParams = {
  to: string;
  subject: string;
  react: ReactElement;
  attachments?: Mail.Attachment[];
};

export const sendEmail = async ({
  to,
  subject,
  react,
  attachments,
}: SendEmailParams): Promise<void> => {
  const recipient =
    env.NODE_ENV !== 'production' && env.DEV_EMAIL_OVERRIDE ? env.DEV_EMAIL_OVERRIDE : to;

  const [html, text] = await Promise.all([render(react), render(react, { plainText: true })]);

  try {
    await transporter.sendMail({
      from: env.EMAIL_FROM,
      to: recipient,
      subject,
      html,
      text,
      attachments,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'unknown error';

    throw new Error(`Failed to send email: ${message}`);
  }
};
