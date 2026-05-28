import { cva } from 'class-variance-authority';

export const appSidebarStyles = {
  root: cva('glass flex gap-2 rounded-2xl', {
    variants: {
      orientation: {
        vertical: 'h-full w-16 flex-col items-center py-3',
        horizontal: 'w-full flex-row items-center px-3 py-2',
      },
    },
    defaultVariants: { orientation: 'vertical' },
  }),
  spacer: 'flex-1',
} as const;
