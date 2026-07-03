'use client';

import { AudioLines } from 'lucide-react';
import { ConnectionIndicator } from '../ConnectionIndicator';
import { RoomInviteButton } from '../RoomInviteButton';
import { roomHeaderStyles as s } from './RoomHeader.styles';
import type { RoomHeaderProps } from './RoomHeader.types';

export const RoomHeader = ({ name, roomId, isDm = false }: RoomHeaderProps) => {
  return (
    <div className={s.root}>
      <span aria-hidden className={s.icon}>
        <AudioLines className="size-4" />
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
