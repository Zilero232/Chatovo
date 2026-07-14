import { clsx } from 'clsx';
import s from './Row.module.scss';
import type { ComponentProps, ElementType } from 'react';
import type { RowAlign, RowGap, RowJustify, RowProps } from './Row.types';

const gapClass: Record<RowGap, string> = {
  '0': s.gap0,
  '1': s.gap1,
  '1.5': s.gap1_5,
  '2': s.gap2,
  '3': s.gap3,
  '4': s.gap4,
  '6': s.gap6,
};

const alignClass: Record<RowAlign, string> = {
  start: s.alignStart,
  center: s.alignCenter,
  end: s.alignEnd,
  baseline: s.alignBaseline,
  stretch: s.alignStretch,
};

const justifyClass: Record<RowJustify, string> = {
  start: s.justifyStart,
  center: s.justifyCenter,
  end: s.justifyEnd,
  between: s.justifyBetween,
  around: s.justifyAround,
};

export const Row = <T extends ElementType = 'div'>({
  as,
  gap = '2',
  align = 'center',
  justify,
  wrap,
  className,
  children,
  ...props
}: RowProps<T>) => {
  const Component = as ?? 'div';

  return (
    <Component
      className={clsx(
        s.root,
        gapClass[gap],
        alignClass[align],
        justify && justifyClass[justify],
        wrap ? s.wrap : s.nowrap,
        className,
      )}
      {...(props as ComponentProps<T>)}
    >
      {children}
    </Component>
  );
};
