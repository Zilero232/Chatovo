import type { ComponentProps, ElementType, ReactNode } from 'react';

export type StackGap = '0' | '1' | '1.5' | '2' | '3' | '4' | '6' | '8';

export type StackAlign = 'start' | 'center' | 'end' | 'stretch';

export type StackJustify = 'start' | 'center' | 'end' | 'between';

export type StackProps<T extends ElementType = 'div'> = {
  as?: T;
  children: ReactNode;
  gap?: StackGap;
  align?: StackAlign;
  justify?: StackJustify;
} & Omit<ComponentProps<T>, 'children'>;
