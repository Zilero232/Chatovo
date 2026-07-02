'use client';

import { LiveKitRoom } from '@livekit/components-react';
import { useBoolean } from '@siberiacancode/reactuse';
import { MessageSquare } from 'lucide-react';
import { useTranslations } from 'next-intl';
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
import { Button } from '@/shared/ui';
import { ChatPanel, RoomChatProvider } from '@/widgets/room/chat';
import { FAILURE_REASONS } from '../config';
import { ConnectingOverlay, ParticipantsView, RoomHeader } from './components';
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
  const t = useTranslations('chat');
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
                <RoomHeader name={roomName} />

                <div className={s.body}>
                  <ParticipantsView />
                  <ReactionsOverlay />
                  <ConnectingOverlay roomName={roomName} />
                </div>

                <div className={s.controls}>
                  <div className={s.controlBarWrap}>
                    <RoomControlBar />
                  </div>

                  <Button
                    aria-label={isChatOpen ? t('hide') : t('open')}
                    aria-pressed={isChatOpen}
                    className={s.chatButton}
                    size="icon-lg"
                    type="button"
                    variant={isChatOpen ? 'secondary' : 'ghost'}
                    onClick={() => toggleChat()}
                  >
                    <MessageSquare />
                  </Button>
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
