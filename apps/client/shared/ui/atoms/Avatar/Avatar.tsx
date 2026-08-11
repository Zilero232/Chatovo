'use client';

import { clsx } from 'clsx';

import type { AvatarFallbackProps, AvatarImageProps, AvatarProps } from './Avatar.types';

import s from './Avatar.module.scss';

const Avatar = ({ className, size = 'default', ...props }: AvatarProps) => (
  <span className={clsx(s.root, className)} data-size={size} data-slot='avatar' {...props} />
);

const AvatarImage = ({ className, alt = '', ...props }: AvatarImageProps) => (
  <img alt={alt} className={clsx(s.image, className)} data-slot='avatar-image' {...props} />
);

const AvatarFallback = ({ className, ...props }: AvatarFallbackProps) => (
  <span className={clsx(s.fallback, className)} data-slot='avatar-fallback' {...props} />
);

export { Avatar, AvatarFallback, AvatarImage };
