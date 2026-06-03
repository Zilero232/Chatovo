import { Resend } from 'resend';
import { env } from '../../core';
import type { ReactElement } from 'react';

const resend = new Resend(env.RESEND_API_KEY);

type SendEmailParams = {
  to: string;
  subject: string;
  react: ReactElement;
};

export const sendEmail = async ({ to, subject, react }: SendEmailParams): Promise<void> => {
  const recipient =
    env.NODE_ENV !== 'production' && env.DEV_EMAIL_OVERRIDE ? env.DEV_EMAIL_OVERRIDE : to;

  const { error } = await resend.emails.send({
    from: env.EMAIL_FROM,
    to: recipient,
    subject,
    react,
  });

  if (error) {
    throw new Error(`Failed to send email: ${error.message}`);
  }
};
