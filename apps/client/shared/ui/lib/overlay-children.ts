import { Children, isValidElement, type ReactElement, type ReactNode } from 'react';
import type { Placement } from 'react-aria';

export const findChildByType = <P>(
  children: ReactNode,
  type: (props: P) => ReactNode,
): ReactElement<P> | undefined => {
  const match = Children.toArray(children).find(
    (child) => isValidElement(child) && child.type === type,
  );

  return match && isValidElement(match) ? (match as ReactElement<P>) : undefined;
};

export const placementFromSideAlign = (
  side: 'top' | 'right' | 'bottom' | 'left' = 'bottom',
  align: 'start' | 'center' | 'end' = 'center',
): Placement => {
  if (align === 'center') {
    return side;
  }

  return `${side} ${align}` as Placement;
};
