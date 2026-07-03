import { cva } from 'class-variance-authority';

export const controlButton = cva(
  'flex size-9 shrink-0 items-center justify-center rounded-full border pt-0.5 outline-hidden transition-all duration-150 focus-visible:ring-2 active:scale-95 disabled:pointer-events-none disabled:opacity-40 sm:size-11 sm:pt-0 [&_svg]:size-4 [&_svg]:shrink-0 sm:[&_svg]:size-5',
  {
    variants: {
      tone: {
        on: 'border-white/10 bg-white/8 text-foreground hover:bg-white/14 focus-visible:ring-brand-cyan',
        off: 'border-white/10 bg-white/5 text-muted-foreground hover:bg-white/10 focus-visible:ring-brand-cyan',
        active:
          'border-white/10 bg-brand-cyan/20 text-brand-cyan shadow-[0_0_18px_-4px_oklch(0.82_0.16_200/0.7)] hover:bg-brand-cyan/30 focus-visible:ring-brand-cyan',
        danger:
          'border-white/10 bg-destructive/15 text-destructive hover:bg-destructive/25 focus-visible:ring-brand-cyan',
        leave:
          'border-transparent bg-destructive text-white shadow-[0_4px_14px_-2px_oklch(0.7_0.22_22/0.5)] hover:bg-[oklch(0.66_0.22_22)] hover:shadow-[0_6px_18px_-2px_oklch(0.7_0.22_22/0.7)] focus-visible:ring-destructive active:scale-95',
      },
    },
    defaultVariants: {
      tone: 'off',
    },
  },
);

export const controlShell = cva(
  'flex size-9 shrink-0 flex-col overflow-hidden rounded-full border transition-all duration-150 sm:size-11',
  {
    variants: {
      tone: {
        on: 'border-white/10 bg-white/8',
        off: 'border-white/10 bg-white/5',
        active: 'border-white/10 bg-brand-cyan/20 shadow-[0_0_18px_-4px_oklch(0.82_0.16_200/0.7)]',
        danger: 'border-white/10 bg-destructive/15',
        leave: 'border-transparent bg-destructive',
      },
    },
    defaultVariants: {
      tone: 'off',
    },
  },
);

export const controlMain = cva(
  'flex min-h-0 w-full flex-1 items-end justify-center pb-0.5 outline-hidden transition-colors focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-brand-cyan active:scale-[0.98] disabled:pointer-events-none disabled:opacity-40 sm:items-center sm:pb-0 [&_svg]:size-4 [&_svg]:shrink-0 sm:[&_svg]:size-5',
  {
    variants: {
      tone: {
        on: 'text-foreground hover:bg-white/8',
        off: 'text-muted-foreground hover:bg-white/6',
        active: 'text-brand-cyan hover:bg-brand-cyan/12',
        danger: 'text-destructive hover:bg-destructive/12',
        leave: 'text-white',
      },
    },
    defaultVariants: {
      tone: 'off',
    },
  },
);
