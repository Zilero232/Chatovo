import { clsx } from 'clsx';
import { cloneElement, isValidElement } from 'react';
import { Button as RACButton } from 'react-aria-components';
import s from './Button.module.scss';
import type { ButtonProps } from './Button.types';

const sizeClass = {
  default: s.sizeDefault,
  xs: s.sizeXs,
  sm: s.sizeSm,
  lg: s.sizeLg,
  icon: s.sizeIcon,
  'icon-xs': s.sizeIconXs,
  'icon-sm': s.sizeIconSm,
  'icon-lg': s.sizeIconLg,
} as const;

const variantClass = {
  default: s.default,
  destructive: s.destructive,
  outline: s.outline,
  secondary: s.secondary,
  ghost: s.ghost,
  link: s.link,
} as const;

const Button = ({
  className,
  variant = 'default',
  size = 'default',
  asChild = false,
  disabled,
  isDisabled,
  children,
  ...props
}: ButtonProps) => {
  const classes = clsx(s.root, variantClass[variant], sizeClass[size], className);

  if (asChild && isValidElement(children)) {
    const childClassName = (children.props as { className?: string }).className;

    return cloneElement(children, {
      ...props,
      className: clsx(classes, childClassName),
      'data-size': size,
      'data-slot': 'button',
      'data-variant': variant,
      disabled: disabled ?? isDisabled,
    } as Record<string, unknown>);
  }

  return (
    <RACButton
      className={classes}
      data-size={size}
      data-slot="button"
      data-variant={variant}
      isDisabled={isDisabled ?? disabled}
      {...props}
    >
      {children}
    </RACButton>
  );
};

export { Button };
