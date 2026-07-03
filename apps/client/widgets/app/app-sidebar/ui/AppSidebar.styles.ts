import { cva } from 'class-variance-authority';

export const appSidebarStyles = {
  root: cva('flex gap-2', {
    variants: {
      orientation: {
        vertical: 'h-full w-16 shrink-0 flex-col items-center border-white/8 border-r py-3',
        horizontal:
          'w-full flex-row items-center rounded-xl border border-white/8 bg-white/3 px-3 py-2',
      },
    },
    defaultVariants: { orientation: 'vertical' },
  }),
  spacer: 'flex-1',
} as const;
