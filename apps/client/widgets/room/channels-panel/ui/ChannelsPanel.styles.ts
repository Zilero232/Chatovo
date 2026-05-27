import { cva } from 'class-variance-authority';

export const channelsPanelStyles = {
  root: cva('flex h-full flex-col bg-sidebar', {
    variants: {
      variant: {
        desktop: 'w-60 border-r',
        drawer: 'w-full',
      },
    },
    defaultVariants: { variant: 'desktop' },
  }),
} as const;
