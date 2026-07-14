import { badgeVariants } from './Badge.variants';

import type { BadgeProps } from './Badge.types';

export const Badge = ({ className, tone = 'muted', size = 'md', ...props }: BadgeProps) => {
  return <span className={badgeVariants({ tone, size, className })} {...props} />;
};
