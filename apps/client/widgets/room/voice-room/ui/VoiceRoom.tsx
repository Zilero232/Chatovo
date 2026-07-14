'use client';

import { LiveKitRoom } from '@livekit/components-react';
import { setLogLevel } from 'livekit-client';

setLogLevel('error');

import { useBoolean } from '@siberiacancode/reactuse';
import { clsx } from 'clsx';
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
import { ChatPanel } from '@/widgets/chat/chat-panel';
import { FAILURE_REASONS } from '../config';
import { LocalSpeakingProvider } from '../model/contexts';
import {
  ConnectingOverlay,
  ParticipantsView,
  RoomHeader,
  RoomInviteButton,
  VoiceRoomChatButton,
} from './components';
import { RoomControllers } from './controllers';

import s from './VoiceRoom.module.scss';

import type { VoiceRoomProps } from './VoiceRoom.types';

export const VoiceRoom = ({
  roomId,
  roomName,
  serverUrl,
  token,
  initialChatOpen = false,
  isDm = false,
  onConnectFailure,
  onLeave,
}: VoiceRoomProps) => {
  const { settings } = useAppSettings();
  const { push: pushRecent } = useRecentRooms();

  const [isChatOpen, toggleChat] = useBoolean(initialChatOpen);

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
          <LocalSpeakingProvider>
            <DeafenProvider>
              <ReactionsProvider roomId={roomId}>
                <RoomHeader isDm={isDm} name={roomName} roomId={roomId} />

                <div className={s.body}>
                  <div aria-hidden className={clsx(s.ambience, 'lobby-ambience')}>
                    <span
                      className={clsx(s.orbViolet, 'lobby-ambience-orb lobby-ambience-orb-violet')}
                    />
                    <span
                      className={clsx(s.orbCyan, 'lobby-ambience-orb lobby-ambience-orb-cyan')}
                    />
                  </div>
                  <ParticipantsView isDm={isDm} roomId={roomId} />
                  <ReactionsOverlay />
                  <ConnectingOverlay roomName={roomName} />
                </div>

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
                    <VoiceRoomChatButton
                      isOpen={isChatOpen}
                      roomId={roomId}
                      onToggle={() => toggleChat()}
                    />
                  </div>
                </div>

                <ChatPanel roomId={roomId} isOpen={isChatOpen} onClose={() => toggleChat(false)} />

                <RoomAudio />
                <RoomControllers roomId={roomId} />
              </ReactionsProvider>
            </DeafenProvider>
          </LocalSpeakingProvider>
        </LiveKitRoom>
      </div>
    </div>
  );
};
