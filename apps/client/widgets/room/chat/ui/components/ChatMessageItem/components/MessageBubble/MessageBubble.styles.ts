import { cva } from 'class-variance-authority';

export const messageBubbleStyles = cva(
  'max-w-full break-words rounded-xl text-[15px] leading-relaxed',
  {
    variants: {
      own: {
        true: 'text-white',
        false: 'text-foreground',
      },
      bare: {
        true: 'overflow-hidden rounded-2xl',
        false: 'px-3.5 py-1.5 shadow-sm',
      },
      tail: {
        true: '',
        false: '',
      },
    },
    compoundVariants: [
      {
        own: true,
        bare: false,
        className:
          'bg-gradient-to-br from-brand-violet to-brand-violet/85 shadow-[0_2px_10px_-2px_oklch(0.7_0.2_270/0.5)]',
      },
      {
        own: false,
        bare: false,
        className: 'border border-white/8 bg-white/[0.06] backdrop-blur-md',
      },
      { own: true, tail: true, className: 'rounded-br-sm' },
      { own: false, tail: true, className: 'rounded-bl-sm' },
    ],
    defaultVariants: { own: false, bare: false, tail: true },
  },
);
