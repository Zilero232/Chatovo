import '@mantine/core/styles.css';
import '@mantine/notifications/styles.css';
import './globals.css';
import '@livekit/components-styles';

import { ColorSchemeScript, MantineProvider, mantineHtmlProps } from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import type { Metadata } from 'next';
import type { ReactNode } from 'react';

import { theme } from '@/shared/ui/theme';

import { Providers } from './providers';

export const metadata: Metadata = {
  title: 'Solvex',
  description: 'Voice rooms',
};

const RootLayout = ({ children }: { children: ReactNode }) => (
  <html lang="en" {...mantineHtmlProps}>
    <head>
      <ColorSchemeScript defaultColorScheme="dark" />
    </head>
    <body>
      <MantineProvider theme={theme} defaultColorScheme="dark">
        <Notifications position="top-right" />
        <Providers>{children}</Providers>
      </MantineProvider>
    </body>
  </html>
);

export default RootLayout;
