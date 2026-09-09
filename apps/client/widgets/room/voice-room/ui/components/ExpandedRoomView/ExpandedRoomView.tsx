'use client';

import { ReactionsOverlay } from '@/features/room/room-control';
import { ChatPanel } from '@/widgets/chat/chat-panel';

import type { ExpandedRoomViewProps } from './ExpandedRoomView.types';

import { ConnectingOverlay } from '../ConnectingOverlay/ConnectingOverlay';
import { ParticipantsView } from '../ParticipantsView/ParticipantsView';
import { RoomAmbience } from '../RoomAmbience/RoomAmbience';
import { RoomControlsBar } from '../RoomControlsBar/RoomControlsBar';
import { RoomHeader } from '../RoomHeader/RoomHeader';

import s from '../../VoiceRoom.module.scss';

export const ExpandedRoomView = ({
  isChatOpen,
  isDm,
  roomId,
  roomName,
  onToggleChat
}: ExpandedRoomViewProps) => (
  <>
    <RoomHeader isDm={isDm} name={roomName} />

    <div className={s.body}>
      <RoomAmbience />
      <ParticipantsView isDm={isDm} />
      <ReactionsOverlay />
      <ConnectingOverlay roomName={roomName} />
    </div>

    <RoomControlsBar isChatOpen={isChatOpen} isDm={isDm} onToggleChat={() => onToggleChat()} />

    <ChatPanel isOpen={isChatOpen} roomId={roomId} onClose={() => onToggleChat(false)} />
  </>
);
