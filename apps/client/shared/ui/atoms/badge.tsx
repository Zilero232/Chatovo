import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/shared/lib/cn';
import type { ComponentProps } from 'react';

const badgeVariants = cva(
  'inline-flex shrink-0 items-center gap-1.5 rounded-full px-2 py-0.5 font-medium text-xs leading-tight transition-colors',
  {
    variants: {
      tone: {
        // Brand-tinted live-status pill (rooms list, online dots).
        primary: 'bg-primary/10 text-primary',
        // Neutral chip used for "empty"/"offline" states.
        muted: 'bg-muted text-muted-foreground',
        // Ownership / accent — amber crown badge.
        amber: 'border border-amber-400/40 bg-amber-400/10 text-amber-300',
        // Destructive — mic-off, errors.
        danger: 'bg-destructive/10 text-destructive',
        // Translucent dark overlay (used on top of video / cards).
        dark: 'bg-black/50 text-white backdrop-blur-sm',
        // Outline / chrome — version pill, secondary metadata.
        outline:
          'border border-border/60 bg-gradient-to-r from-primary/10 via-card to-card text-foreground/90 shadow-sm hover:border-primary/40',
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
