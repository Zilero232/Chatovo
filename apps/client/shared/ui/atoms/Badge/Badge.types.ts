import type { ComponentProps } from 'react';

export type BadgeTone = 'primary' | 'muted' | 'amber' | 'danger' | 'dark' | 'outline';

export type BadgeSize = 'sm' | 'md' | 'lg';

export type BadgeProps = ComponentProps<'span'> & {
  tone?: BadgeTone;
  size?: BadgeSize;
};
