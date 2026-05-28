import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/shared/lib/cn';
import type { ComponentProps } from 'react';

const badgeVariants = cva(
  'inline-flex shrink-0 items-center gap-1.5 rounded-full px-2 py-0.5 font-medium text-xs leading-tight transition-colors',
  {
    variants: {
      tone: {
        primary:
          'border border-brand-violet/40 bg-brand-violet/15 text-brand-violet shadow-[0_0_12px_-4px_oklch(0.7_0.22_295/0.5)]',
        muted: 'border border-white/10 bg-white/5 text-muted-foreground',
        amber:
          'border border-amber-300/40 bg-amber-400/10 text-amber-200 shadow-[0_0_12px_-4px_oklch(0.85_0.18_85/0.5)]',
        danger:
          'border border-destructive/40 bg-destructive/15 text-destructive shadow-[0_0_12px_-4px_oklch(0.7_0.22_22/0.5)]',
        dark: 'border border-white/10 bg-black/55 text-white backdrop-blur-md',
        outline:
          'border border-white/15 bg-white/5 text-foreground/85 backdrop-blur-md hover:border-brand-violet/40 hover:text-foreground',
      },
      size: {
        sm: 'gap-1 px-1.5 py-0 text-[10px]',
        md: 'px-2 py-0.5 text-xs',
        lg: 'px-3 py-1 text-sm',
      },
    },
    defaultVariants: { tone: 'muted', size: 'md' },
  },
);

export type BadgeProps = ComponentProps<'span'> & VariantProps<typeof badgeVariants>;

export const Badge = ({ className, tone, size, ...props }: BadgeProps) => {
  return <span className={cn(badgeVariants({ tone, size }), className)} {...props} />;
};

export { badgeVariants };
