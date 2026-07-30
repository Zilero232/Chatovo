import { Hr, Text } from 'react-email';

import { BaseEmail } from './BaseEmail';
import { emailStyles } from './email-styles';

type BugReportContext = {
  appVersion?: string;
  email: string;
  platform?: string;
  reporter: string;
  userAgent?: string;
};

type BugReportProps = {
  context: BugReportContext;
  description: string;
};

const Row = ({ label, value }: { label: string; value?: string }) =>
  value && (
    <Text style={{ ...emailStyles.text, marginBottom: '8px' }}>
      <span style={emailStyles.label}>{label}: </span>
      {value}
    </Text>
  );

export const BugReport = ({ description, context }: BugReportProps) => (
  <BaseEmail heading='New bug report' preview={`New bug report from ${context.reporter}`}>
    <Text style={{ ...emailStyles.text, whiteSpace: 'pre-wrap' }}>{description}</Text>

    <Hr style={emailStyles.hr} />

    <Row label='Reporter' value={context.reporter} />
    <Row label='Email' value={context.email} />
    <Row label='Version' value={context.appVersion} />
    <Row label='Platform' value={context.platform} />
    <Row label='User agent' value={context.userAgent} />
  </BaseEmail>
);
