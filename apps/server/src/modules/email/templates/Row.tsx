import { Text } from 'react-email';

import { emailStyles } from './email-styles';

type RowProps = {
  label: string;
  value?: string;
};

export const Row = ({ label, value }: RowProps) =>
  value && (
    <Text style={{ ...emailStyles.text, marginBottom: '8px' }}>
      <span style={emailStyles.label}>{label}: </span>
      {value}
    </Text>
  );
