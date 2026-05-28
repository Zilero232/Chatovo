import { cva } from 'class-variance-authority';

export const channelsPanelStyles = {
  root: cva('flex h-full flex-col', {
    variants: {
      variant: {
        desktop: 'glass w-64 rounded-2xl',
        drawer: 'w-full',
      },
    },
    defaultVariants: { variant: 'desktop' },
  }),
} as const;
