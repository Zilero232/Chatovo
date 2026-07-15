import type { ReactNode } from 'react';

export type SettingRowProps = {
  label: string;
  hint?: string;
  control: ReactNode;
  stacked?: boolean;
};
