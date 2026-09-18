'use client';

import { clsx } from 'clsx';
import { AtSign } from 'lucide-react';

import { UserAvatar } from '@/entities/auth/user';

import type { ComposerMentionPopupProps } from './ComposerMentionPopup.types';

import s from './ComposerMentionPopup.module.scss';

export const ComposerMentionPopup = ({
  candidates,
  activeIndex,
  onPick
}: ComposerMentionPopupProps) => (
  <ul className={clsx('glass-overlay', s.root)} role='listbox'>
    {candidates.map((candidate, index) => (
      <li key={candidate.id}>
        <button
          aria-selected={index === activeIndex}
          className={clsx(s.item, { [s.active]: index === activeIndex })}
          role='option'
          type='button'
          onClick={() => onPick(candidate)}
        >
          {candidate.kind === 'role' ? (
            <AtSign
              aria-hidden
              className={s.roleIcon}
              style={{ color: candidate.color ?? undefined }}
            />
          ) : (
            <UserAvatar
              className={s.avatar}
              name={candidate.label}
              size='sm'
              src={candidate.avatarUrl}
            />
          )}
          <span
            className={s.label}
            style={candidate.color ? { color: candidate.color } : undefined}
          >
            {candidate.label}
          </span>
        </button>
      </li>
    ))}
  </ul>
);
