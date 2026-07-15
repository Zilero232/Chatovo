import { Button as RACButton } from 'react-aria-components';

import { buttonVariants } from './Button.variants';

import type { PressEvent } from 'react-aria-components';
import type { ButtonProps } from './Button.types';

const Button = ({
  className,
  variant = 'default',
  size = 'default',
  disabled,
  isDisabled,
  onClick,
  onPress,
  children,
  ...props
}: ButtonProps) => {
  const hasPressHandler = Boolean(onClick || onPress);

  const handlePress = (event: PressEvent) => {
    onPress?.(event);
    onClick?.();
  };

  return (
    <RACButton
      data-size={size}
      data-slot="button"
      data-variant={variant}
      {...props}
      className={buttonVariants({ variant, size, className })}
      isDisabled={isDisabled ?? disabled}
      {...(hasPressHandler && { onPress: handlePress })}
    >
      {children}
    </RACButton>
  );
};

export { Button };
