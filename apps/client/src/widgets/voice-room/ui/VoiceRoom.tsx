import { LiveKitRoom, RoomAudioRenderer } from '@livekit/components-react';
import '@livekit/components-styles';
import { ControlBar } from './ControlBar';
import { ParticipantsGrid } from './ParticipantsGrid';

interface Props {
  token: string;
  serverUrl: string;
  roomName: string;
}

export const VoiceRoom = ({ token, serverUrl, roomName }: Props) => (
  <LiveKitRoom
    token={token}
    serverUrl={serverUrl}
    connect
    audio
    video={false}
    data-lk-theme="default"
    className="flex h-full flex-col"
  >
    <div className="border-b bg-card px-6 py-2 font-medium text-sm">{roomName}</div>
    <div className="flex-1 overflow-auto">
      <ParticipantsGrid />
    </div>
    <ControlBar />
    <RoomAudioRenderer />
  </LiveKitRoom>
);
