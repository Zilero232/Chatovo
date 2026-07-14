'use client';

import { clsx } from 'clsx';
import s from './Avatar.module.scss';
import type {
  AvatarBadgeProps,
  AvatarFallbackProps,
  AvatarGroupCountProps,
  AvatarGroupProps,
  AvatarImageProps,
  AvatarProps,
} from './Avatar.types';

const Avatar = ({ className, size = 'default', ...props }: AvatarProps) => (
  <span className={clsx(s.root, className)} data-size={size} data-slot="avatar" {...props} />
);

const AvatarImage = ({ className, alt = '', ...props }: AvatarImageProps) => (
  <img alt={alt} className={clsx(s.image, className)} data-slot="avatar-image" {...props} />
);

const AvatarFallback = ({ className, ...props }: AvatarFallbackProps) => (
  <span className={clsx(s.fallback, className)} data-slot="avatar-fallback" {...props} />
);

const AvatarBadge = ({ className, ...props }: AvatarBadgeProps) => (
  <span className={clsx(s.badge, className)} data-slot="avatar-badge" {...props} />
);

const AvatarGroup = ({ className, ...props }: AvatarGroupProps) => (
  <div className={clsx(s.group, className)} data-slot="avatar-group" {...props} />
);

const AvatarGroupCount = ({ className, ...props }: AvatarGroupCountProps) => (
  <div className={clsx(s.groupCount, className)} data-slot="avatar-group-count" {...props} />
);

export { Avatar, AvatarBadge, AvatarFallback, AvatarGroup, AvatarGroupCount, AvatarImage };
