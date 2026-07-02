import { Text } from 'react-email';
import { BaseEmail } from './BaseEmail';
import { emailStyles } from './email-styles';

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
      <Text style={emailStyles.text}>
        Click below to choose a new password for your Chatovo account.
      </Text>
    </BaseEmail>
  );
};
