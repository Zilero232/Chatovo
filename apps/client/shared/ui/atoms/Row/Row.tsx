import { rowVariants } from './Row.variants';

import type { ComponentProps, ElementType } from 'react';
import type { RowProps } from './Row.types';

export const Row = <T extends ElementType = 'div'>({
  as,
  gap = '2',
  align = 'center',
  justify,
  wrap = false,
  className,
  children,
  ...props
}: RowProps<T>) => {
  const Component = as ?? 'div';

  return (
    <Component
      className={rowVariants({ gap, align, justify, wrap, className })}
      {...(props as ComponentProps<T>)}
    >
      {children}
    </Component>
  );
};
