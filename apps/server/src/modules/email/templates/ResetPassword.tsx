import { Text } from 'react-email';

import { BaseEmail } from './BaseEmail';
import { emailStyles } from './email-styles';

type ResetPasswordProps = {
  url: string;
};

export const ResetPassword = ({ url }: ResetPasswordProps) => (
  <BaseEmail
    action={{ url, label: 'Reset password' }}
    heading='Reset your password'
    preview='Reset your Chatovo password'
  >
    <Text style={emailStyles.text}>
      Click below to choose a new password for your Chatovo account.
    </Text>
  </BaseEmail>
);
