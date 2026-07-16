import { AppProviders } from '../providers/index';

import type { ReactNode } from 'react';

const PrivacyLayout = ({ children }: { children: ReactNode }) => (
  <AppProviders>{children}</AppProviders>
);

export default PrivacyLayout;
