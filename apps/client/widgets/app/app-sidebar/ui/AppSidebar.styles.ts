import { cva } from 'class-variance-authority';

export const appSidebarStyles = {
  root: cva('flex gap-2 bg-sidebar', {
    variants: {
      orientation: {
        vertical: 'h-full w-18 flex-col items-center border-r py-3',
        horizontal: 'w-full flex-row items-center border-b px-3 py-2',
      },
    },
    defaultVariants: { orientation: 'vertical' },
  }),
  spacer: 'flex-1',
} as const;
