import { Text } from 'react-email';
import { BaseEmail } from './BaseEmail';
import { emailStyles } from './email-styles';

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
      <Text style={emailStyles.text}>
        Confirm your email address to finish setting up your Chatovo account.
      </Text>
    </BaseEmail>
  );
};
