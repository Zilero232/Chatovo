import type { ComponentProps, MouseEvent } from 'react';
import type { ButtonVariantProps } from './Button.variants';

export type ButtonVariant = NonNullable<ButtonVariantProps['variant']>;

export type ButtonSize = NonNullable<ButtonVariantProps['size']>;

export type ButtonProps = Omit<ComponentProps<'button'>, 'onClick'> &
  Pick<ComponentProps<'a'>, 'href' | 'target' | 'rel' | 'download'> & {
    variant?: ButtonVariant;
    size?: ButtonSize;
    isDisabled?: boolean;
    onClick?: (event: MouseEvent<HTMLElement>) => void;
  };
