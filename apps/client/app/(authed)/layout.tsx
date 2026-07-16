import { AuthedShell } from '@/widgets/layout/authed-shell';
import { AppProviders } from '../providers/index';
import { AuthedProviders } from './providers';

import type { ReactNode } from 'react';

const AuthedLayout = ({ children }: { children: ReactNode }) => (
  <AppProviders>
    <AuthedProviders>
      <AuthedShell>{children}</AuthedShell>
    </AuthedProviders>
  </AppProviders>
);

export default AuthedLayout;
