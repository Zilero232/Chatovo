'use client';

import { NavLink, ScrollArea, Stack, Text } from '@mantine/core';
import { Hash } from 'lucide-react';

import { ChannelsRoomItem } from './ChannelsRoomItem';

type Props = {
  activeRoom: string | null;
  rooms: string[];
  displayName: string;
  initial: string;
  onSelectLobby: () => void;
  onSelectRoom: (room: string) => void;
};

export const ChannelsList = ({
  activeRoom,
  rooms,
  displayName,
  initial,
  onSelectLobby,
  onSelectRoom,
}: Props) => (
  <ScrollArea flex={1} type="hover" scrollbarSize={6}>
    <Stack gap={2} p="xs">
      <Text size="xs" c="dimmed" tt="uppercase" px="sm" py="xs">
        Channels
      </Text>
      <NavLink
        label="Lobby"
        leftSection={<Hash size={14} />}
        active={!activeRoom}
        onClick={onSelectLobby}
      />
      {rooms.length > 0 ? (
        <>
          <Text size="xs" c="dimmed" tt="uppercase" px="sm" py="xs" mt="sm">
            Recent voice
          </Text>
          {rooms.map((room) => (
            <ChannelsRoomItem
              key={room}
              room={room}
              isActive={activeRoom === room}
              displayName={displayName}
              initial={initial}
              onClick={() => onSelectRoom(room)}
            />
          ))}
        </>
      ) : null}
    </Stack>
  </ScrollArea>
);
