import { clsx } from 'clsx';
import s from './AvatarWithBadges.module.scss';
import type { ReactNode } from 'react';

type AvatarWithBadgesProps = {
  children: ReactNode;
  topLeft?: ReactNode;
  topRight?: ReactNode;
  bottomLeft?: ReactNode;
  bottomRight?: ReactNode;
  className?: string;
};

export const AvatarWithBadges = ({
  children,
  topLeft,
  topRight,
  bottomLeft,
  bottomRight,
  className,
}: AvatarWithBadgesProps) => {
  return (
    <div className={clsx(s.root, className)}>
      {children}
      {topLeft}
      {topRight}
      {bottomLeft}
      {bottomRight}
    </div>
  );
};
