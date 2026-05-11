'use client';

import type { LocalUserChoices } from '@livekit/components-core';
import { LiveKitRoom, RoomAudioRenderer } from '@livekit/components-react';
import { Group, Text } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { Volume2 } from 'lucide-react';
import useSound from 'use-sound';

import { ChatDrawer } from './ChatDrawer';
import { RoomControls } from './RoomControls';
import { RoomSounds } from './RoomSounds';
import { RoomStage } from './RoomStage';

type Props = {
  token: string;
  serverUrl: string;
  roomName: string;
  userChoices: LocalUserChoices;
  onLeave: () => void;
};

export const VoiceRoom = ({ token, serverUrl, roomName, userChoices, onLeave }: Props) => {
  const [chatOpened, { toggle: toggleChat, close: closeChat }] = useDisclosure(false);
  const [playJoin] = useSound('/sounds/join.wav', { volume: 0.5 });
  const [playLeave] = useSound('/sounds/leave.wav', { volume: 0.5 });

  return (
    <LiveKitRoom
      className="flex h-full flex-col"
      token={token}
      serverUrl={serverUrl}
      connect
      audio={
        userChoices.audioEnabled ? { deviceId: userChoices.audioDeviceId || undefined } : false
      }
      video={
        userChoices.videoEnabled ? { deviceId: userChoices.videoDeviceId || undefined } : false
      }
      data-lk-theme="default"
      onConnected={() => playJoin()}
      onDisconnected={() => {
        playLeave();
        onLeave();
      }}
    >
      <Group
        px="md"
        py="xs"
        gap="xs"
        style={{ borderBottom: '1px solid var(--mantine-color-dark-6)' }}
      >
        <Volume2 size={16} />
        <Text size="sm" fw={600}>
          {roomName}
        </Text>
      </Group>
      <RoomStage />
      <RoomControls onToggleChat={toggleChat} chatOpened={chatOpened} />
      <RoomAudioRenderer />
      <RoomSounds />
      <ChatDrawer opened={chatOpened} onClose={closeChat} />
    </LiveKitRoom>
  );
};
