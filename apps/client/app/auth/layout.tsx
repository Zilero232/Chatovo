import type { ReactNode } from 'react';

import { AppProviders } from '../providers/index';

const AuthLayout = ({ children }: { children: ReactNode }) => (
  <AppProviders>{children}</AppProviders>
);

export default AuthLayout;
