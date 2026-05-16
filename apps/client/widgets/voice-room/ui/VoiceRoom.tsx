'use client';

import { ControlBar, LiveKitRoom, RoomAudioRenderer } from '@livekit/components-react';
import { DisconnectReason } from 'livekit-client';
import { Volume2 } from 'lucide-react';
import { useRef } from 'react';

import { Stage } from './components';
import { voiceRoomStyles as s } from './VoiceRoom.styles';
import type { VoiceRoomProps } from './VoiceRoom.types';

const FAILURE_REASONS = new Set<DisconnectReason>([
  DisconnectReason.JOIN_FAILURE,
  DisconnectReason.SIGNAL_CLOSE,
  DisconnectReason.SERVER_SHUTDOWN,
  DisconnectReason.STATE_MISMATCH,
]);

export const VoiceRoom = ({
  token,
  serverUrl,
  roomName,
  onLeave,
  onConnectFailure,
}: VoiceRoomProps) => {
  const hasConnectedRef = useRef(false);

  return (
    <div className={s.root}>
      <div className={s.frame}>
        <LiveKitRoom
          connect
          audio
          className={s.room}
          data-lk-theme="default"
          serverUrl={serverUrl}
          token={token}
          video={false}
          onConnected={() => {
            hasConnectedRef.current = true;
          }}
          onDisconnected={(reason) => {
            if (!hasConnectedRef.current) {
              if (reason !== undefined && FAILURE_REASONS.has(reason)) onConnectFailure(reason);

              return;
            }

            onLeave();
          }}
        >
          <div className={s.header}>
            <Volume2 className={s.headerIcon} />
            <span className={s.headerTitle}>{roomName}</span>
          </div>

          <Stage />

          <div className={s.controls} data-lk-theme="default">
            <ControlBar controls={{ chat: false, settings: false }} variation="minimal" />
          </div>

          <RoomAudioRenderer />
        </LiveKitRoom>
      </div>
    </div>
  );
};
