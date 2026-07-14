import { clsx } from 'clsx';
import { cloneElement, isValidElement, type ReactElement, type ReactNode } from 'react';

export const renderAsChild = (
  asChild: boolean | undefined,
  children: ReactNode,
  props: Record<string, unknown>,
): ReactElement | ReactNode => {
  if (!asChild || !isValidElement(children)) {
    return children;
  }

  const childClassName = (children.props as { className?: string }).className;

  return cloneElement(children, {
    ...props,
    className: clsx(props.className as string | undefined, childClassName),
  } as Record<string, unknown>);
};
