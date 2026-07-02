import { Hr, Text } from 'react-email';
import { BaseEmail } from './BaseEmail';
import { emailStyles } from './email-styles';

type BugReportContext = {
  reporter: string;
  email: string;
  appVersion?: string;
  platform?: string;
  userAgent?: string;
};

type BugReportProps = {
  description: string;
  context: BugReportContext;
};

const Row = ({ label, value }: { label: string; value?: string }) =>
  value && (
    <Text style={{ ...emailStyles.text, marginBottom: '8px' }}>
      <span style={emailStyles.label}>{label}: </span>
      {value}
    </Text>
  );

export const BugReport = ({ description, context }: BugReportProps) => {
  return (
    <BaseEmail preview={`New bug report from ${context.reporter}`} heading="New bug report">
      <Text style={{ ...emailStyles.text, whiteSpace: 'pre-wrap' }}>{description}</Text>

      <Hr style={emailStyles.hr} />

      <Row label="Reporter" value={context.reporter} />
      <Row label="Email" value={context.email} />
      <Row label="Version" value={context.appVersion} />
      <Row label="Platform" value={context.platform} />
      <Row label="User agent" value={context.userAgent} />
    </BaseEmail>
  );
};
