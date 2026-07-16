import { isNullish } from 'remeda';

import { buttonVariants } from './Button.variants';

import type { ComponentProps } from 'react';
import type { ButtonProps } from './Button.types';

const Button = ({
  className,
  variant = 'default',
  size = 'default',
  isDisabled,
  disabled,
  onClick,
  href,
  target,
  rel,
  download,
  type = 'button',
  children,
  ...props
}: ButtonProps) => {
  const resolvedClassName = buttonVariants({ variant, size, className });

  if (!isNullish(href)) {
    return (
      <a
        data-size={size}
        data-slot="button"
        data-variant={variant}
        download={download}
        href={href}
        rel={rel}
        target={target}
        onClick={onClick}
        {...(props as ComponentProps<'a'>)}
        className={resolvedClassName}
      >
        {children}
      </a>
    );
  }

  return (
    <button
      data-size={size}
      data-slot="button"
      data-variant={variant}
      disabled={isDisabled ?? disabled}
      type={type}
      onClick={onClick}
      {...props}
      className={resolvedClassName}
    >
      {children}
    </button>
  );
};

export { Button };
