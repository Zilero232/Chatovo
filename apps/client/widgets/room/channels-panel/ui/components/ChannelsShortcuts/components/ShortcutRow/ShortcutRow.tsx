'use client';

import { clsx } from 'clsx';

import type { ShortcutRowProps } from './ShortcutRow.types';

import s from './ShortcutRow.module.scss';

export const ShortcutRow = ({
  icon,
  label,
  href,
  isActive = false,
  isDisabled = false,
  isHighlighted = false,
  onSelect
}: ShortcutRowProps) => {
  const className = clsx(s.root, { [s.active]: isActive, [s.highlighted]: isHighlighted });

  const content = (
    <>
      <span aria-hidden className={s.icon}>
        {icon}
      </span>
      <span className={s.label}>{label}</span>
    </>
  );

  if (href) {
    return (
      <a className={className} href={href} rel='noopener noreferrer' target='_blank'>
        {content}
      </a>
    );
  }

  return (
    <button
      aria-current={isActive ? 'page' : undefined}
      className={className}
      disabled={isDisabled}
      type='button'
      onClick={onSelect}
    >
      {content}
    </button>
  );
};
