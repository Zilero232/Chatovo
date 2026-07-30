import type { ReactNode } from 'react';

import { AppProviders } from '../providers/index';

const PrivacyLayout = ({ children }: { children: ReactNode }) => (
  <AppProviders>{children}</AppProviders>
);

export default PrivacyLayout;
