import { cn } from '@/shared/lib/cn';
import type { ComponentProps } from 'react';

export const Skeleton = ({ className, ...props }: ComponentProps<'div'>) => (
  <div className={cn('shimmer rounded-md', className)} data-slot="skeleton" {...props} />
);
