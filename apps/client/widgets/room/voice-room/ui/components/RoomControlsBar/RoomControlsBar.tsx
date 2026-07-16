'use client';

import { clsx } from 'clsx';

import { RoomControlBar } from '@/features/room/room-control';
import { RoomInviteButton } from '../RoomInviteButton';
import { VoiceRoomChatButton } from '../VoiceRoomChatButton';

import s from '../../VoiceRoom.module.scss';

import type { RoomControlsBarProps } from './RoomControlsBar.types';

export const RoomControlsBar = ({
  roomId,
  isDm,
  isChatOpen,
  onToggleChat,
}: RoomControlsBarProps) => (
  <div className={clsx(s.controls, 'surface-bar')}>
    <span aria-hidden className="accent-top-line" />
    <div className={s.controlBarWrap}>
      <RoomControlBar />
    </div>

    <div className={s.sideActions}>
      {!isDm && (
        <div className={s.desktopInvite}>
          <RoomInviteButton roomId={roomId} />
        </div>
      )}
      <VoiceRoomChatButton isOpen={isChatOpen} roomId={roomId} onToggle={onToggleChat} />
    </div>
  </div>
);
