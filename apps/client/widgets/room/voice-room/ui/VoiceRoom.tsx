'use client';

import { LiveKitRoom } from '@livekit/components-react';
import { useBoolean } from '@siberiacancode/reactuse';
import { useRef } from 'react';
import { getPublishDefaults, useAppSettings } from '@/entities/app/settings';
import { useRecentRooms } from '@/entities/room/room';
import {
  DeafenProvider,
  ReactionsOverlay,
  ReactionsProvider,
  RoomAudio,
  RoomControlBar,
} from '@/features/room/room-control';
import { appEvents } from '@/shared/lib';
import { ChatPanel, RoomChatProvider } from '@/widgets/room/chat';
import { FAILURE_REASONS } from '../config';
import {
  ConnectingOverlay,
  ParticipantsView,
  RoomHeader,
  RoomInviteButton,
  VoiceRoomChatButton,
} from './components';
import { RoomControllers } from './controllers';
import { voiceRoomStyles as s } from './VoiceRoom.styles';
import type { VoiceRoomProps } from './VoiceRoom.types';

export const VoiceRoom = ({
  roomId,
  roomName,
  serverUrl,
  token,
  onConnectFailure,
  onLeave,
}: VoiceRoomProps) => {
  const { settings } = useAppSettings();
  const { push: pushRecent } = useRecentRooms();

  const [isChatOpen, toggleChat] = useBoolean(false);

  appEvents.on.chatToggle(() => toggleChat());

  const hasConnectedRef = useRef(false);
  const audioCaptureRef = useRef(settings.audio);
  const publishDefaultsRef = useRef(
    getPublishDefaults(settings.video.cameraQuality, settings.video.screenQuality),
  );

  return (
    <div className={s.root}>
      <div className={s.frame}>
        <LiveKitRoom
          connect
          audio={audioCaptureRef.current}
          className={s.room}
          options={{ webAudioMix: true, publishDefaults: publishDefaultsRef.current }}
          serverUrl={serverUrl}
          token={token}
          video={false}
          onConnected={() => {
            hasConnectedRef.current = true;
            pushRecent(roomId);
          }}
          onDisconnected={(reason) => {
            if (!hasConnectedRef.current) {
              if (reason !== undefined && FAILURE_REASONS.has(reason)) {
                onConnectFailure(reason);
              }

              return;
            }

            onLeave();
          }}
        >
          <RoomChatProvider>
            <DeafenProvider>
              <ReactionsProvider>
                <RoomHeader name={roomName} roomId={roomId} />

                <div className={s.body}>
                  <ParticipantsView roomId={roomId} />
                  <ReactionsOverlay />
                  <ConnectingOverlay roomName={roomName} />
                </div>

                <div className={s.controls}>
                  <div className={s.controlBarWrap}>
                    <RoomControlBar />
                  </div>

                  <div className={s.sideActions}>
                    <div className={s.desktopInvite}>
                      <RoomInviteButton roomId={roomId} />
                    </div>
                    <VoiceRoomChatButton isOpen={isChatOpen} onToggle={() => toggleChat()} />
                  </div>
                </div>

                <ChatPanel roomId={roomId} isOpen={isChatOpen} onClose={() => toggleChat(false)} />

                <RoomAudio />
                <RoomControllers roomId={roomId} />
              </ReactionsProvider>
            </DeafenProvider>
          </RoomChatProvider>
        </LiveKitRoom>
      </div>
    </div>
  );
};
