'use client';

import { clsx } from 'clsx';
import { AudioLines } from 'lucide-react';
import { ConnectionIndicator } from '../ConnectionIndicator';
import { RoomInviteButton } from '../RoomInviteButton';
import s from './RoomHeader.module.scss';
import type { RoomHeaderProps } from './RoomHeader.types';

export const RoomHeader = ({ name, roomId, isDm = false }: RoomHeaderProps) => {
  return (
    <div className={clsx(s.root, 'surface-bar')}>
      <span aria-hidden className="accent-top-line" />
      <span aria-hidden className={s.icon}>
        <AudioLines className={s.iconGlyph} />
      </span>

      <div className={s.info}>
        <div className={s.titleRow}>
          <span className={s.title}>{name}</span>
          {!isDm && (
            <div className={s.mobileInvite}>
              <RoomInviteButton roomId={roomId} size="sm" />
            </div>
          )}
        </div>
      </div>

      <ConnectionIndicator />
    </div>
  );
};
