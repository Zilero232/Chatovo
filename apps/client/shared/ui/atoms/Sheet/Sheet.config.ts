import s from './Sheet.module.scss';

import type { SheetSide } from './Sheet.types';

export const sideClass: Record<SheetSide, string> = {
  right: s.sideRight,
  left: s.sideLeft,
  top: s.sideTop,
  bottom: s.sideBottom,
};
