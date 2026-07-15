import { AuthedShell } from '@/widgets/layout/authed-shell';
import { AuthedProviders } from './providers';

import type { ReactNode } from 'react';

const AuthedLayout = ({ children }: { children: ReactNode }) => (
  <AuthedProviders>
    <AuthedShell>{children}</AuthedShell>
  </AuthedProviders>
);

export default AuthedLayout;
