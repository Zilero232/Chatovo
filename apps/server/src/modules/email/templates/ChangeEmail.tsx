import { Text } from 'react-email';
import { BaseEmail } from './BaseEmail';

type ChangeEmailProps = {
  newEmail: string;
  url: string;
};

export const ChangeEmail = ({ newEmail, url }: ChangeEmailProps) => {
  return (
    <BaseEmail
      preview="Approve the email change on your Chatovo account"
      heading="Approve email change"
      action={{ url, label: 'Approve change' }}
    >
      <Text className="m-0 mb-6 text-neutral-600 text-sm leading-6">
        Confirm changing your account email to {newEmail}. If you did not request this, ignore this
        message.
      </Text>
    </BaseEmail>
  );
};
