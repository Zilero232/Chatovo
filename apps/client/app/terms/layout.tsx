import { AppProviders } from '../providers/index';

import type { ReactNode } from 'react';

const TermsLayout = ({ children }: { children: ReactNode }) => (
  <AppProviders>{children}</AppProviders>
);

export default TermsLayout;
