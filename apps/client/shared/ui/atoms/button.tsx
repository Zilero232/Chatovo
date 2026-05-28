import { cva } from 'class-variance-authority';
import { Slot } from 'radix-ui';
import { cn } from '@/shared/lib/cn';
import type { VariantProps } from 'class-variance-authority';
import type * as React from 'react';

const buttonVariants = cva(
  "inline-flex shrink-0 items-center justify-center gap-2 rounded-lg text-sm font-medium whitespace-nowrap outline-none transition-colors duration-150 ease-out focus-visible:ring-2 focus-visible:ring-brand-violet/50 focus-visible:ring-offset-1 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-40 aria-invalid:ring-2 aria-invalid:ring-destructive/40 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default:
          'bg-foreground text-background shadow-[0_1px_0_oklch(1_0_0/0.7)_inset,0_-1px_0_oklch(0_0_0/0.15)_inset,0_8px_20px_-4px_oklch(0_0_0/0.6),0_4px_8px_-2px_oklch(0_0_0/0.45),0_0_0_1px_oklch(0_0_0/0.3)] hover:bg-foreground/95 hover:shadow-[0_1px_0_oklch(1_0_0/0.8)_inset,0_-1px_0_oklch(0_0_0/0.18)_inset,0_12px_28px_-4px_oklch(0_0_0/0.7),0_6px_12px_-2px_oklch(0_0_0/0.5),0_0_0_1px_oklch(0_0_0/0.35)] active:translate-y-px active:shadow-[0_1px_0_oklch(1_0_0/0.5)_inset,0_4px_8px_-2px_oklch(0_0_0/0.4),0_0_0_1px_oklch(0_0_0/0.25)]',
        destructive:
          'bg-destructive text-white shadow-[0_1px_0_oklch(1_0_0/0.18)_inset,0_4px_14px_-2px_oklch(0.7_0.22_22/0.5),0_2px_4px_-1px_oklch(0_0_0/0.35)] hover:bg-[oklch(0.66_0.22_22)] hover:shadow-[0_1px_0_oklch(1_0_0/0.22)_inset,0_6px_18px_-2px_oklch(0.7_0.22_22/0.65)] active:translate-y-px',
        outline:
          'border border-white/12 bg-white/3 text-foreground shadow-[0_1px_2px_oklch(0_0_0/0.25)] hover:border-white/25 hover:bg-white/8 hover:shadow-[0_2px_6px_oklch(0_0_0/0.35)]',
        secondary:
          'border border-white/10 bg-white/5 text-foreground shadow-[0_1px_2px_oklch(0_0_0/0.25)] hover:bg-white/10 hover:shadow-[0_2px_6px_oklch(0_0_0/0.35)]',
        ghost: 'text-foreground/80 hover:bg-white/8 hover:text-foreground',
        link: 'text-brand-cyan underline-offset-4 hover:underline',
      },
      size: {
        default: 'h-9 px-4 has-[>svg]:px-3',
        xs: "h-6 gap-1 rounded-md px-2 text-xs has-[>svg]:px-1.5 [&_svg:not([class*='size-'])]:size-3",
        sm: 'h-8 gap-1.5 rounded-md px-3 has-[>svg]:px-2.5',
        lg: 'h-10 rounded-lg px-5 has-[>svg]:px-4',
        icon: 'size-9',
        'icon-xs': "size-6 rounded-md [&_svg:not([class*='size-'])]:size-3",
        'icon-sm': 'size-8',
        'icon-lg': 'size-10',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
);

const Button = ({
  className,
  variant = 'default',
  size = 'default',
  asChild = false,
  ...props
}: React.ComponentProps<'button'> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  }) => {
  const Comp = asChild ? Slot.Root : 'button';

  return (
    <Comp
      className={cn(buttonVariants({ variant, size, className }))}
      data-size={size}
      data-slot="button"
      data-variant={variant}
      {...props}
    />
  );
};

export { Button, buttonVariants };
