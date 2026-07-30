import type { ReactNode } from 'react';

import { AppProviders } from '../providers/index';

const TermsLayout = ({ children }: { children: ReactNode }) => (
  <AppProviders>{children}</AppProviders>
);

export default TermsLayout;
