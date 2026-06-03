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
      Confirm changing your account email to {newEmail}. If you did not request this, ignore this
      message.
    </BaseEmail>
  );
};
