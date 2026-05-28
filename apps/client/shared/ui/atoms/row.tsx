import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/shared/lib/cn';
import type { ComponentProps, ElementType, ReactNode } from 'react';

const rowVariants = cva('flex', {
  variants: {
    gap: {
      '0': 'gap-0',
      '1': 'gap-1',
      '1.5': 'gap-1.5',
      '2': 'gap-2',
      '3': 'gap-3',
      '4': 'gap-4',
      '6': 'gap-6',
    },
    align: {
      start: 'items-start',
      center: 'items-center',
      end: 'items-end',
      baseline: 'items-baseline',
      stretch: 'items-stretch',
    },
    justify: {
      start: 'justify-start',
      center: 'justify-center',
      end: 'justify-end',
      between: 'justify-between',
      around: 'justify-around',
    },
    wrap: {
      true: 'flex-wrap',
      false: 'flex-nowrap',
    },
  },
  defaultVariants: { gap: '2', align: 'center' },
});

type RowProps<T extends ElementType = 'div'> = {
  as?: T;
  children: ReactNode;
} & VariantProps<typeof rowVariants> &
  Omit<ComponentProps<T>, 'children'>;

// Horizontal flex primitive — collapses the `flex items-center gap-X` pattern
// (with optional `justify-between`) repeated across headers, badge rows, and
// control rows. Always `items-center` unless overridden.
export const Row = <T extends ElementType = 'div'>({
  as,
  gap,
  align,
  justify,
  wrap,
  className,
  children,
  ...props
}: RowProps<T>) => {
  const Component = as ?? 'div';

  return (
    <Component
      className={cn(rowVariants({ gap, align, justify, wrap }), className)}
      {...(props as ComponentProps<T>)}
    >
      {children}
    </Component>
  );
};

export { rowVariants };
