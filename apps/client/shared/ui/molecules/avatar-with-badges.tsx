import { cn } from '@/shared/lib/cn';
import type { ReactNode } from 'react';

type AvatarWithBadgesProps = {
  // The avatar element (UserAvatar or any other circular image).
  children: ReactNode;
  // Overlay badges keyed by anchor; each value is the badge JSX.
  topLeft?: ReactNode;
  topRight?: ReactNode;
  bottomLeft?: ReactNode;
  bottomRight?: ReactNode;
  className?: string;
};

// Wraps an avatar in a `relative` host so overlay badges can be positioned
// at any of the four corners without each consumer re-declaring the absolute
// offsets. Use the floating Badge / OwnerCrown / MicMutedBadge components
// directly as the slot values.
export const AvatarWithBadges = ({
  children,
  topLeft,
  topRight,
  bottomLeft,
  bottomRight,
  className,
}: AvatarWithBadgesProps) => {
  return (
    <div className={cn('relative shrink-0', className)}>
      {children}
      {topLeft}
      {topRight}
      {bottomLeft}
      {bottomRight}
    </div>
  );
};
