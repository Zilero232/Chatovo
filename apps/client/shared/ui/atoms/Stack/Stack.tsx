import { clsx } from 'clsx';
import s from './Stack.module.scss';
import type { ComponentProps, ElementType } from 'react';
import type { StackAlign, StackGap, StackJustify, StackProps } from './Stack.types';

const gapClass: Record<StackGap, string> = {
  '0': s.gap0,
  '1': s.gap1,
  '1.5': s.gap1_5,
  '2': s.gap2,
  '3': s.gap3,
  '4': s.gap4,
  '6': s.gap6,
  '8': s.gap8,
};

const alignClass: Record<StackAlign, string> = {
  start: s.alignStart,
  center: s.alignCenter,
  end: s.alignEnd,
  stretch: s.alignStretch,
};

const justifyClass: Record<StackJustify, string> = {
  start: s.justifyStart,
  center: s.justifyCenter,
  end: s.justifyEnd,
  between: s.justifyBetween,
};

export const Stack = <T extends ElementType = 'div'>({
  as,
  gap = '2',
  align,
  justify,
  className,
  children,
  ...props
}: StackProps<T>) => {
  const Component = as ?? 'div';

  return (
    <Component
      className={clsx(
        s.root,
        gapClass[gap],
        align && alignClass[align],
        justify && justifyClass[justify],
        className,
      )}
      {...(props as ComponentProps<T>)}
    >
      {children}
    </Component>
  );
};
