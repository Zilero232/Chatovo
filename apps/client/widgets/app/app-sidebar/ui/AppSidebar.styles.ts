import { cva } from 'class-variance-authority';

export const appSidebarStyles = {
  root: cva('flex gap-2', {
    variants: {
      orientation: {
        vertical:
          'h-full w-16 shrink-0 flex-col items-center border-white/10 border-r bg-shell-surface/40 py-3 backdrop-blur-md',
        horizontal:
          'w-full flex-row items-center rounded-xl border border-white/10 bg-white/4 px-3 py-2 shadow-[inset_0_1px_0_oklch(1_0_0/0.05)] backdrop-blur-md',
      },
    },
    defaultVariants: { orientation: 'vertical' },
  }),
  spacer: 'flex-1',
} as const;
