'use client';

import { isValidElement } from 'react';
import { Focusable, Pressable, Button as RACButton } from 'react-aria-components';

import { Button } from '../../Button';

import type { ReactElement, ReactNode } from 'react';

const isPressableTrigger = (child: ReactElement<{ role?: string }>) => {
  const { type } = child;

  if (type === Pressable || type === Focusable || type === Button || type === RACButton) {
    return true;
  }

  if (typeof type === 'function' && 'displayName' in type && type.displayName === 'Button') {
    return true;
  }

  return type === 'button' || type === 'a';
};

export const wrapTooltipTrigger = (child: ReactNode) => {
  if (!isValidElement<{ role?: string }>(child)) {
    return child;
  }

  if (isPressableTrigger(child)) {
    return child;
  }

  const needsFocusable =
    child.type === 'span' || child.props.role === 'img' || child.props.role === 'presentation';

  if (needsFocusable) {
    return <Focusable>{child as never}</Focusable>;
  }

  return <Pressable>{child as never}</Pressable>;
};
