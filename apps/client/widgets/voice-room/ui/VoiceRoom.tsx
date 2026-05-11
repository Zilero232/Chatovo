import { LiveKitRoom, RoomAudioRenderer } from '@livekit/components-react';

import { RoomControls } from './RoomControls';
import { RoomHeader } from './RoomHeader';
import { RoomStage } from './RoomStage';

type Props = {
  token: string;
  serverUrl: string;
  roomName: string;
  onLeave: () => void;
};

export const VoiceRoom = ({ token, serverUrl, roomName, onLeave }: Props) => (
  <LiveKitRoom
    className="flex h-full flex-col"
    token={token}
    serverUrl={serverUrl}
    connect
    audio
    video={false}
    data-lk-theme="default"
    onDisconnected={onLeave}
  >
    <RoomHeader name={roomName} />
    <RoomStage />
    <RoomControls />
    <RoomAudioRenderer />
  </LiveKitRoom>
);
