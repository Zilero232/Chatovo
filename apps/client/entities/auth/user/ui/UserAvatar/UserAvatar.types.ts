import type { ComponentProps } from 'react';

import type { Avatar } from '@/ui-kit';

export type UserAvatarProps = {
  className?: string;
  colorize?: boolean;
  fallbackClassName?: string;
  name: string;
  size?: ComponentProps<typeof Avatar>['size'];
  src?: string | null;
};
