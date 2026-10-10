'use client';

import { clsx } from 'clsx';
import Image from 'next/image';

import type { AvatarFallbackProps, AvatarImageProps, AvatarProps } from './Avatar.types';

import s from './Avatar.module.scss';

const AVATAR_IMAGE_SIZE = 96;

const AVATAR_DEFAULT_SIZES = '40px';

const Avatar = ({ className, size = 'default', ...props }: AvatarProps) => (
  <span className={clsx(s.root, className)} data-size={size} data-slot='avatar' {...props} />
);

const AvatarImage = ({
  className,
  alt = '',
  sizes = AVATAR_DEFAULT_SIZES,
  ...props
}: AvatarImageProps) => (
  <Image
    alt={alt}
    className={clsx(s.image, className)}
    data-slot='avatar-image'
    height={AVATAR_IMAGE_SIZE}
    sizes={sizes}
    width={AVATAR_IMAGE_SIZE}
    {...props}
  />
);

const AvatarFallback = ({ className, ...props }: AvatarFallbackProps) => (
  <span className={clsx(s.fallback, className)} data-slot='avatar-fallback' {...props} />
);

export { Avatar, AvatarFallback, AvatarImage };
