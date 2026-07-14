import { clsx } from 'clsx';
import s from './Badge.module.scss';
import type { BadgeProps, BadgeSize, BadgeTone } from './Badge.types';

const toneClass: Record<BadgeTone, string> = {
  primary: s.tonePrimary,
  muted: s.toneMuted,
  amber: s.toneAmber,
  danger: s.toneDanger,
  dark: s.toneDark,
  outline: s.toneOutline,
};

const sizeClass: Record<BadgeSize, string> = {
  sm: s.sizeSm,
  md: s.sizeMd,
  lg: s.sizeLg,
};

export const Badge = ({ className, tone = 'muted', size = 'md', ...props }: BadgeProps) => (
  <span className={clsx(s.root, toneClass[tone], sizeClass[size], className)} {...props} />
);
