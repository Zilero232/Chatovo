import { Hr, Text } from 'react-email';

import { BaseEmail } from './BaseEmail';
import { emailStyles } from './email-styles';
import { Row } from './Row';

type AbuseReportContext = {
  comment?: string;
  reason: string;
  reporter: string;
  reporterEmail: string;
  roomName?: string;
  target: string;
  targetId: string;
  targetName?: string;
};

type AbuseReportProps = {
  context: AbuseReportContext;
  reportId: string;
};

export const AbuseReport = ({ reportId, context }: AbuseReportProps) => (
  <BaseEmail heading='New abuse report' preview={`${context.reason} report on a ${context.target}`}>
    <Text style={{ ...emailStyles.text, whiteSpace: 'pre-wrap' }}>
      {context.comment || 'No comment provided.'}
    </Text>

    <Hr style={emailStyles.hr} />

    <Row label='Report' value={reportId} />
    <Row label='Reason' value={context.reason} />
    <Row label='Target' value={context.target} />
    <Row label='Target id' value={context.targetId} />
    <Row label='Target name' value={context.targetName} />
    <Row label='Room' value={context.roomName} />
    <Row label='Reporter' value={context.reporter} />
    <Row label='Reporter email' value={context.reporterEmail} />
  </BaseEmail>
);
