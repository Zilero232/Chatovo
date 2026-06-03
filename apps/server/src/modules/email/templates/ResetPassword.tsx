import { BaseEmail } from './BaseEmail';

type ResetPasswordProps = {
  url: string;
};

export const ResetPassword = ({ url }: ResetPasswordProps) => {
  return (
    <BaseEmail
      preview="Reset your Chatovo password"
      heading="Reset your password"
      action={{ url, label: 'Reset password' }}
    >
      Click below to choose a new password for your Chatovo account.
    </BaseEmail>
  );
};
