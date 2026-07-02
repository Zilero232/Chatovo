import { cn } from '@/shared/lib/cn';
import type { ComponentProps } from 'react';

export const Skeleton = ({ className, ...props }: ComponentProps<'div'>) => (
  <div
    className={cn('animate-pulse rounded-md bg-white/8', className)}
    data-slot="skeleton"
    {...props}
  />
);
