'use client';

import {
  CircleCheckIcon,
  InfoIcon,
  Loader2Icon,
  OctagonXIcon,
  TriangleAlertIcon,
} from 'lucide-react';
import { Toaster as Sonner } from 'sonner';
import type { ToasterProps } from 'sonner';

const Toaster = ({ ...props }: ToasterProps) => (
  <Sonner
    icons={{
      success: <CircleCheckIcon className="size-4" />,
      info: <InfoIcon className="size-4" />,
      warning: <TriangleAlertIcon className="size-4" />,
      error: <OctagonXIcon className="size-4" />,
      loading: <Loader2Icon className="size-4 animate-spin" />,
    }}
    style={
      {
        '--normal-bg': 'var(--surface-overlay)',
        '--normal-text': 'var(--popover-foreground)',
        '--normal-border': 'var(--glass-border)',
        '--border-radius': 'var(--radius)',
      } as React.CSSProperties
    }
    toastOptions={{
      classNames: {
        toast:
          'backdrop-blur-xl shadow-[0_24px_64px_-16px_oklch(0_0_0/0.55),0_1px_0_oklch(1_0_0/8%)_inset]',
      },
    }}
    className="toaster group"
    position="top-right"
    theme="dark"
    {...props}
  />
);

export { Toaster };
