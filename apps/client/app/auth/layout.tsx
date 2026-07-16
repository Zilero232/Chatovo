import { AppProviders } from '../providers/index';

import type { ReactNode } from 'react';

const AuthLayout = ({ children }: { children: ReactNode }) => (
  <AppProviders>{children}</AppProviders>
);

export default AuthLayout;
