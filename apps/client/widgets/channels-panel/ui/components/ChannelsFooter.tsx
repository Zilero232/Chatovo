'use client';

import { ActionIcon, Avatar, Box, Group, Text, Tooltip } from '@mantine/core';
import { Settings } from 'lucide-react';

type Props = {
  displayName: string;
  initial: string;
  onOpenSettings: () => void;
};

export const ChannelsFooter = ({ displayName, initial, onOpenSettings }: Props) => (
  <Group
    px="sm"
    py="xs"
    justify="space-between"
    bg="dark.8"
    style={{ borderTop: '1px solid var(--mantine-color-dark-6)' }}
  >
    <Group gap="xs" style={{ overflow: 'hidden' }}>
      <Avatar size="sm" color="indigo" radius="xl">
        {initial}
      </Avatar>
      <Box style={{ overflow: 'hidden' }}>
        <Text size="xs" fw={600} truncate>
          {displayName}
        </Text>
        <Text size="10px" c="dimmed">
          online
        </Text>
      </Box>
    </Group>
    <Tooltip label="Settings">
      <ActionIcon variant="subtle" size="md" onClick={onOpenSettings} aria-label="Settings">
        <Settings size={16} />
      </ActionIcon>
    </Tooltip>
  </Group>
);
