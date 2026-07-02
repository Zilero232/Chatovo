import { cva } from 'class-variance-authority';

export const platformCardStyles = {
  root: cva(
    'flex min-h-[7.5rem] flex-col items-center justify-center gap-2.5 rounded-xl border border-white/10 bg-white/5 p-4 text-center backdrop-blur-md transition-all',
    {
      variants: {
        state: {
          available: 'hover:border-brand-violet/40 hover:bg-white/8 hover:shadow-glow-violet',
          unavailable: 'opacity-50',
        },
      },
      defaultVariants: { state: 'available' },
    },
  ),
  icon: 'size-10 text-brand-cyan drop-shadow-[0_0_10px_oklch(0.82_0.16_200/0.5)]',
  name: 'font-semibold text-sm',
  size: 'text-muted-foreground text-xs',
  unavailable: 'text-muted-foreground text-xs italic',
} as const;
