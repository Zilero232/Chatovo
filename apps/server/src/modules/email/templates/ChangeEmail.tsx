import { Text } from 'react-email';

import { BaseEmail } from './BaseEmail';
import { emailStyles } from './email-styles';

type ChangeEmailProps = {
  newEmail: string;
  url: string;
};

export const ChangeEmail = ({ newEmail, url }: ChangeEmailProps) => (
  <BaseEmail
    action={{ url, label: 'Approve change' }}
    heading='Approve email change'
    preview='Approve the email change on your Chatovo account'
  >
    <Text style={emailStyles.text}>
      Confirm changing your account email to {newEmail}. If you did not request this, ignore this
      message.
    </Text>
  </BaseEmail>
);
