import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/shared/lib/cn';
import type { ComponentProps, ElementType, ReactNode } from 'react';

const stackVariants = cva('flex flex-col', {
  variants: {
    gap: {
      '0': 'gap-0',
      '1': 'gap-1',
      '1.5': 'gap-1.5',
      '2': 'gap-2',
      '3': 'gap-3',
      '4': 'gap-4',
      '6': 'gap-6',
      '8': 'gap-8',
    },
    align: {
      start: 'items-start',
      center: 'items-center',
      end: 'items-end',
      stretch: 'items-stretch',
    },
    justify: {
      start: 'justify-start',
      center: 'justify-center',
      end: 'justify-end',
      between: 'justify-between',
    },
  },
  defaultVariants: { gap: '2' },
});

type StackProps<T extends ElementType = 'div'> = {
  as?: T;
  children: ReactNode;
} & VariantProps<typeof stackVariants> &
  Omit<ComponentProps<T>, 'children'>;

// Vertical flex primitive — collapses the `flex flex-col gap-X` pattern repeated
// across forms, lists, and content containers. Pass `as="form"` / `as="ul"` etc.
// when the wrapper must be a specific element.
export const Stack = <T extends ElementType = 'div'>({
  as,
  gap,
  align,
  justify,
  className,
  children,
  ...props
}: StackProps<T>) => {
  const Component = as ?? 'div';

  return (
    <Component
      className={cn(stackVariants({ gap, align, justify }), className)}
      {...(props as ComponentProps<T>)}
    >
      {children}
    </Component>
  );
};

export { stackVariants };
