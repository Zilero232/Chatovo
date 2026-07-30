import { clsx } from 'clsx';

import type { SkeletonProps } from './Skeleton.types';

import s from './Skeleton.module.scss';

export const Skeleton = ({ className, ...props }: SkeletonProps) => (
  <div className={clsx('shimmer', s.root, className)} data-slot='skeleton' {...props} />
);
