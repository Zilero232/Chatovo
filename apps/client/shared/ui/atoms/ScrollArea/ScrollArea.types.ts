import type { ComponentProps } from 'react';

export type ScrollAreaProps = ComponentProps<'div'>;

export type ScrollBarProps = ComponentProps<'div'> & {
  orientation?: 'vertical' | 'horizontal';
};
