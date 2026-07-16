import { clsx } from 'clsx';

import { textVariants } from './Text.variants';

import type { ElementType } from 'react';
import type { TextProps } from './Text.types';

export const Text = <T extends ElementType = 'p'>({
  as,
  size,
  weight,
  tone,
  align,
  truncate,
  className,
  children,
  ...props
}: TextProps<T>) => {
  const Component = as ?? 'p';

  return (
    <Component
      className={clsx(textVariants({ size, weight, tone, align, truncate }), className)}
      data-slot="text"
      {...props}
    >
      {children}
    </Component>
  );
};
