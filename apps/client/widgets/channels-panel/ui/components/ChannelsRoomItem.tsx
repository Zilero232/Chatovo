'use client';

import { Avatar, Badge, Box, Group, NavLink, Text } from '@mantine/core';
import { Volume2 } from 'lucide-react';

type Props = {
  room: string;
  isActive: boolean;
  displayName: string;
  initial: string;
  onClick: () => void;
};

export const ChannelsRoomItem = ({ room, isActive, displayName, initial, onClick }: Props) => (
  <Box>
    <NavLink
      label={room}
      leftSection={
        <Volume2 size={14} color={isActive ? 'var(--mantine-color-green-5)' : undefined} />
      }
      rightSection={
        isActive ? (
          <Badge size="xs" color="green" variant="dot">
            joined
          </Badge>
        ) : null
      }
      active={isActive}
      onClick={onClick}
    />
    {isActive ? (
      <Group gap="xs" pl="xl" py={4} pr="sm">
        <Avatar size="xs" color="indigo" radius="xl">
          {initial}
        </Avatar>
        <Text size="xs" c="dimmed" truncate>
          {displayName}
        </Text>
      </Group>
    ) : null}
  </Box>
);
