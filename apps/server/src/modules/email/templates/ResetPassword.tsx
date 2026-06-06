import { Text } from 'react-email';
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
      <Text className="m-0 mb-6 text-neutral-600 text-sm leading-6">
        Click below to choose a new password for your Chatovo account.
      </Text>
    </BaseEmail>
  );
};
