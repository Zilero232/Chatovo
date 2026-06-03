import { BaseEmail } from './BaseEmail';

type VerifyEmailProps = {
  url: string;
};

export const VerifyEmail = ({ url }: VerifyEmailProps) => {
  return (
    <BaseEmail
      preview="Verify your email to finish setting up Chatovo"
      heading="Verify your email"
      action={{ url, label: 'Verify email' }}
    >
      Confirm your email address to finish setting up your Chatovo account.
    </BaseEmail>
  );
};
