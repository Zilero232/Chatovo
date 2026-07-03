import { cva } from 'class-variance-authority';

export const channelsPanelStyles = {
  root: cva('flex h-full flex-col', {
    variants: {
      variant: {
        desktop: 'h-full w-64 shrink-0 flex-col border-white/8 border-r',
        drawer: 'w-full',
      },
    },
    defaultVariants: { variant: 'desktop' },
  }),
} as const;
