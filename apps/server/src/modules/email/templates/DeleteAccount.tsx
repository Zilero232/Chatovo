import { Text } from 'react-email';

import { BaseEmail } from './BaseEmail';
import { emailStyles } from './email-styles';

type DeleteAccountProps = {
  url: string;
};

export const DeleteAccount = ({ url }: DeleteAccountProps) => (
  <BaseEmail
    action={{ url, label: 'Delete my account' }}
    heading='Confirm account deletion'
    preview='Confirm deleting your Chatovo account'
  >
    <Text style={emailStyles.text}>
      This permanently deletes your Chatovo account, your profile, your rooms and your friend list.
      It cannot be undone. If you did not request this, ignore this message and your account stays
      untouched.
    </Text>
  </BaseEmail>
);
