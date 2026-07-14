import type { Placement } from 'react-aria';

export type OverlaySide = 'top' | 'right' | 'bottom' | 'left';
export type OverlayAlign = 'start' | 'center' | 'end';

export const placementFromSideAlign = (
  side: OverlaySide = 'bottom',
  align: OverlayAlign = 'center',
): Placement => {
  if (align === 'center') {
    return side;
  }

  return `${side} ${align}` as Placement;
};
