import { Hr, Text } from 'react-email';
import { BaseEmail } from './BaseEmail';

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
    <Text className="m-0 text-neutral-600 text-sm leading-6">
      <span className="font-medium text-neutral-900">{label}: </span>
      {value}
    </Text>
  );

export const BugReport = ({ description, context }: BugReportProps) => {
  return (
    <BaseEmail preview={`New bug report from ${context.reporter}`} heading="New bug report">
      <Text className="m-0 mb-6 whitespace-pre-wrap text-neutral-700 text-sm leading-6">
        {description}
      </Text>

      <Hr className="my-6 border-neutral-200" />

      <Row label="Reporter" value={context.reporter} />
      <Row label="Email" value={context.email} />
      <Row label="Version" value={context.appVersion} />
      <Row label="Platform" value={context.platform} />
      <Row label="User agent" value={context.userAgent} />
    </BaseEmail>
  );
};
