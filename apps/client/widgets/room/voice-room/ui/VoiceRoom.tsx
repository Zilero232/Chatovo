'use client';

import { LiveKitRoom } from '@livekit/components-react';
import { clsx } from 'clsx';
import { setLogLevel } from 'livekit-client';

import { useMiniRoomSlot } from '@/entities/room/session';
import { DeafenProvider, ReactionsProvider, RoomAudio } from '@/features/room/room-control';

import type { VoiceRoomProps } from './VoiceRoom.types';

import { LocalSpeakingProvider } from '../model/contexts';
import { useChatToggle, useRoomConnection } from '../model/hooks';
import { ExpandedRoomView, MiniRoomHost } from './components';
import { RoomControllers } from './controllers';

import s from './VoiceRoom.module.scss';

setLogLevel('error');

export const VoiceRoom = ({
  roomId,
  roomName,
  serverUrl,
  token,
  initialChatOpen = false,
  isDm = false,
  isMinimized = false,
  onConnectFailure,
  onExpand,
  onLeave
}: VoiceRoomProps) => {
  const { slot, variant: miniVariant } = useMiniRoomSlot();

  const { isChatOpen, toggleChat } = useChatToggle(initialChatOpen);

  const { audioCapture, publishDefaults, handleConnected, handleDisconnected } = useRoomConnection({
    roomId,
    onConnectFailure,
    onLeave
  });

  return (
    <div className={clsx(s.root, isMinimized && s.rootMinimized)}>
      <div className={clsx(s.frame, isMinimized && s.frameMinimized)}>
        <LiveKitRoom
          connect
          audio={audioCapture}
          className={clsx(s.room, isMinimized && s.roomMinimized)}
          options={{ webAudioMix: true, publishDefaults }}
          serverUrl={serverUrl}
          token={token}
          video={false}
          onConnected={handleConnected}
          onDisconnected={handleDisconnected}
        >
          <LocalSpeakingProvider>
            <DeafenProvider>
              <ReactionsProvider roomId={roomId}>
                {isMinimized ? (
                  <MiniRoomHost
                    isDm={isDm}
                    roomName={roomName}
                    slot={slot}
                    variant={miniVariant}
                    onExpand={onExpand}
                  />
                ) : (
                  <ExpandedRoomView
                    isChatOpen={isChatOpen}
                    isDm={isDm}
                    roomId={roomId}
                    roomName={roomName}
                    onToggleChat={toggleChat}
                  />
                )}

                <RoomAudio />
                <RoomControllers />
              </ReactionsProvider>
            </DeafenProvider>
          </LocalSpeakingProvider>
        </LiveKitRoom>
      </div>
    </div>
  );
};
