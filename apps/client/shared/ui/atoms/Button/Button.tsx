import { Button as RACButton } from 'react-aria-components';

import { buttonVariants } from './Button.variants';

import type { ButtonProps } from './Button.types';

const Button = ({
  className,
  variant = 'default',
  size = 'default',
  disabled,
  isDisabled,
  children,
  ...props
}: ButtonProps) => (
  <RACButton
    className={buttonVariants({ variant, size, className })}
    data-size={size}
    data-slot="button"
    data-variant={variant}
    isDisabled={isDisabled ?? disabled}
    {...props}
  >
    {children}
  </RACButton>
);

export { Button };
