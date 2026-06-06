import { Text } from 'react-email';
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
      <Text className="m-0 mb-6 text-neutral-600 text-sm leading-6">
        Confirm your email address to finish setting up your Chatovo account.
      </Text>
    </BaseEmail>
  );
};
