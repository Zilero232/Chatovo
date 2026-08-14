'use client';

import { getAvatarColor, getDefaultAvatar, getInitials } from '@/shared/lib';
import { Avatar, AvatarFallback, AvatarImage } from '@/ui-kit';

import type { UserAvatarProps } from './UserAvatar.types';

export const UserAvatar = ({
  name,
  src,
  size,
  colorize = false,
  className,
  fallbackClassName
}: UserAvatarProps) => (
  <Avatar className={className} size={size}>
    <AvatarImage alt={name} src={src || getDefaultAvatar(name)} />
    <AvatarFallback
      className={fallbackClassName}
      style={colorize ? { backgroundColor: getAvatarColor(name), color: '#fff' } : undefined}
    >
      {getInitials(name)}
    </AvatarFallback>
  </Avatar>
);
