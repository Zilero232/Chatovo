import type { ComponentProps, ElementType, ReactNode } from 'react';

export type RowGap = '0' | '1' | '1.5' | '2' | '3' | '4' | '6';

export type RowAlign = 'start' | 'center' | 'end' | 'baseline' | 'stretch';

export type RowJustify = 'start' | 'center' | 'end' | 'between' | 'around';

export type RowProps<T extends ElementType = 'div'> = {
  as?: T;
  children: ReactNode;
  gap?: RowGap;
  align?: RowAlign;
  justify?: RowJustify;
  wrap?: boolean;
} & Omit<ComponentProps<T>, 'children'>;
