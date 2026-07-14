import type { ReactNode } from 'react';

export type AvatarWithBadgesProps = {
  children: ReactNode;
  topLeft?: ReactNode;
  topRight?: ReactNode;
  bottomLeft?: ReactNode;
  bottomRight?: ReactNode;
  className?: string;
};
