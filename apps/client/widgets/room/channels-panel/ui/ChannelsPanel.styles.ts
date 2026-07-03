import { cva } from 'class-variance-authority';

export const channelsPanelStyles = {
  root: cva('flex h-full flex-col', {
    variants: {
      variant: {
        desktop:
          'surface-bar h-full w-64 shrink-0 flex-col border-white/10 border-r shadow-[inset_-1px_0_0_oklch(1_0_0/0.04)]',
        drawer: 'w-full',
      },
    },
    defaultVariants: { variant: 'desktop' },
  }),
} as const;
