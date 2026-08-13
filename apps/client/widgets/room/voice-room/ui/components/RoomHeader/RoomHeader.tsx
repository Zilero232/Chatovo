'use client';

import { clsx } from 'clsx';
import { AudioLines } from 'lucide-react';

import type { RoomHeaderProps } from './RoomHeader.types';

import { ConnectionIndicator } from '../ConnectionIndicator/ConnectionIndicator';
import { RoomInviteButton } from '../RoomInviteButton/RoomInviteButton';

import s from './RoomHeader.module.scss';

export const RoomHeader = ({ name, isDm = false }: RoomHeaderProps) => (
  <div className={clsx(s.root, 'surface-bar')}>
    <span aria-hidden className='accent-top-line' />
    <span aria-hidden className={s.icon}>
      <AudioLines className={s.iconGlyph} />
    </span>

    <div className={s.info}>
      <div className={s.titleRow}>
        <span className={s.title}>{name}</span>
        {!isDm && (
          <div className={s.mobileInvite}>
            <RoomInviteButton size='sm' />
          </div>
        )}
      </div>
    </div>

    <ConnectionIndicator />
  </div>
);
