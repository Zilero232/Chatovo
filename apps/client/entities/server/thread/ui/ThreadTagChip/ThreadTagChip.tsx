'use client';

import { clsx } from 'clsx';

import type { ThreadTagChipProps } from './ThreadTagChip.types';

import s from './ThreadTagChip.module.scss';

export const ThreadTagChip = ({ tag, isActive = false, onToggle }: ThreadTagChipProps) => {
  if (!onToggle) {
    return (
      <span className={clsx(s.root, { [s.active]: isActive })}>
        {tag.emoji && <span aria-hidden>{tag.emoji}</span>}
        {tag.name}
      </span>
    );
  }

  return (
    <button
      aria-pressed={isActive}
      className={clsx(s.root, s.interactive, { [s.active]: isActive })}
      type='button'
      onClick={() => onToggle(tag.id)}
    >
      {tag.emoji && <span aria-hidden>{tag.emoji}</span>}
      {tag.name}
    </button>
  );
};
