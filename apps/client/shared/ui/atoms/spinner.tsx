import { cva, type VariantProps } from 'class-variance-authority';
import { Loader2 } from 'lucide-react';
import { cn } from '@/shared/lib/cn';
import type { ComponentProps } from 'react';

const spinnerVariants = cva('animate-spin', {
  variants: {
    size: {
      xs: 'size-3',
      sm: 'size-4',
      md: 'size-5',
      lg: 'size-6',
      xl: 'size-8',
    },
  },
  defaultVariants: { size: 'sm' },
});

export type SpinnerProps = Omit<ComponentProps<typeof Loader2>, 'size'> &
  VariantProps<typeof spinnerVariants>;

// Lucide Loader2 wrapped with a single source of size variants so every
// pending-state spinner across the app stays visually consistent.
export const Spinner = ({ className, size, ...props }: SpinnerProps) => {
  return <Loader2 className={cn(spinnerVariants({ size }), className)} {...props} />;
};

export { spinnerVariants };
