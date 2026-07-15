'use client';

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
      <AvatarFallback
        className={fallbackClassName}
        style={colorize ? { backgroundColor: getAvatarColor(name), color: '#fff' } : undefined}
      >
        {getInitials(name)}
      </AvatarFallback>
    </Avatar>
  );
};
