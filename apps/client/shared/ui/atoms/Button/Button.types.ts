import type { ComponentProps } from 'react';
import type { ButtonProps as RACButtonProps } from 'react-aria-components';

export type ButtonVariant = 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';

export type ButtonSize =
  | 'default'
  | 'xs'
  | 'sm'
  | 'lg'
  | 'icon'
  | 'icon-xs'
  | 'icon-sm'
  | 'icon-lg';

export type ButtonProps = RACButtonProps &
  Pick<ComponentProps<'button'>, 'tabIndex' | 'type' | 'onClick' | 'form' | 'name'> & {
    variant?: ButtonVariant;
    size?: ButtonSize;
    asChild?: boolean;
    disabled?: boolean;
  };
