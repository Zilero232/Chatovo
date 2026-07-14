'use client';

import { clsx } from 'clsx';
import { getAvatarColor, getInitials } from '@/shared/lib/initials';
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/ui';
import type { UserAvatarProps } from './UserAvatar.types';

export const UserAvatar = ({
  name,
  src,
  size,
  colorize = false,
  className,
  fallbackClassName,
}: UserAvatarProps) => {
  return (
    <Avatar className={className} size={size}>
      {src && <AvatarImage alt={name} src={src} />}
      <AvatarFallback className={clsx(colorize && getAvatarColor(name), fallbackClassName)}>
        {getInitials(name)}
      </AvatarFallback>
    </Avatar>
  );
};
