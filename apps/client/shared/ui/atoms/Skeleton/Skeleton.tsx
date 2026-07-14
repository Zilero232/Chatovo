import { clsx } from 'clsx';
import s from './Skeleton.module.scss';
import type { SkeletonProps } from './Skeleton.types';

export const Skeleton = ({ className, ...props }: SkeletonProps) => (
  <div className={clsx('shimmer', s.root, className)} data-slot="skeleton" {...props} />
);
