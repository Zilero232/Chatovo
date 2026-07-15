import { clsx } from 'clsx';

import s from './AvatarWithBadges.module.scss';

import type { AvatarWithBadgesProps } from './AvatarWithBadges.types';

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
