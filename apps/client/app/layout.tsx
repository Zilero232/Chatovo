import type { Metadata } from 'next';
import type { ReactNode } from 'react';

import { Toaster } from '@/shared/ui/sonner';

import { Providers } from './providers';
import './globals.css';
import '@livekit/components-styles';

export const metadata: Metadata = {
  title: 'Solvex',
  description: 'Voice rooms',
};

const RootLayout = ({ children }: { children: ReactNode }) => (
  <html lang="en">
    <body>
      <Providers>{children}</Providers>
      <Toaster richColors closeButton position="top-right" />
    </body>
  </html>
);

export default RootLayout;
