'use client';

import { LiveKitRoom } from '@livekit/components-react';
import { useBoolean } from '@siberiacancode/reactuse';
import { setLogLevel } from 'livekit-client';

import {
  DeafenProvider,
  ReactionsOverlay,
  ReactionsProvider,
  RoomAudio
} from '@/features/room/room-control';
import { appEvents } from '@/shared/lib';
import { ChatPanel } from '@/widgets/chat/chat-panel';

import type { VoiceRoomProps } from './VoiceRoom.types';

import { LocalSpeakingProvider, SessionStatsProvider } from '../model/contexts';
import { useRoomConnection } from '../model/hooks';
import {
  ConnectingOverlay,
  ParticipantsView,
  RoomAmbience,
  RoomControlsBar,
  RoomHeader
} from './components';
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
  onConnectFailure,
  onLeave
}: VoiceRoomProps) => {
  const [isChatOpen, toggleChat] = useBoolean(initialChatOpen);

  appEvents.on.chatToggle(() => toggleChat());

  const { audioCapture, publishDefaults, handleConnected, handleDisconnected } = useRoomConnection({
    roomId,
    onConnectFailure,
    onLeave
  });

  return (
    <div className={s.root}>
      <div className={s.frame}>
        <LiveKitRoom
          connect
          audio={audioCapture}
          className={s.room}
          options={{ webAudioMix: true, publishDefaults }}
          serverUrl={serverUrl}
          token={token}
          video={false}
          onConnected={handleConnected}
          onDisconnected={handleDisconnected}
        >
          <LocalSpeakingProvider>
            <SessionStatsProvider>
              <DeafenProvider>
                <ReactionsProvider roomId={roomId}>
                  <RoomHeader isDm={isDm} name={roomName} />

                  <div className={s.body}>
                    <RoomAmbience />
                    <ParticipantsView isDm={isDm} />
                    <ReactionsOverlay />
                    <ConnectingOverlay roomName={roomName} />
                  </div>

                  <RoomControlsBar
                    isChatOpen={isChatOpen}
                    isDm={isDm}
                    onToggleChat={() => toggleChat()}
                  />

                  <ChatPanel
                    isOpen={isChatOpen}
                    roomId={roomId}
                    onClose={() => toggleChat(false)}
                  />

                  <RoomAudio />
                  <RoomControllers />
                </ReactionsProvider>
              </DeafenProvider>
            </SessionStatsProvider>
          </LocalSpeakingProvider>
        </LiveKitRoom>
      </div>
    </div>
  );
};
