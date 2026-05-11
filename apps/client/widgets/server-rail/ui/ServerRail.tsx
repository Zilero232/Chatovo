'use client';

import { ActionIcon, Avatar, Box, Stack, Tooltip } from '@mantine/core';
import { Home, PanelLeftClose, PanelLeftOpen, Settings } from 'lucide-react';
import { useRouter } from 'next/navigation';

type Props = {
  channelsOpened: boolean;
  onToggleChannels: () => void;
  onOpenSettings: () => void;
};

export const ServerRail = ({ channelsOpened, onToggleChannels, onOpenSettings }: Props) => {
  const router = useRouter();

  return (
    <Stack
      bg="dark.8"
      align="center"
      py="sm"
      gap="sm"
      w={72}
      h="100%"
      style={{ borderRight: '1px solid var(--mantine-color-dark-6)' }}
    >
      <Tooltip label={channelsOpened ? 'Hide channels' : 'Show channels'} position="right">
        <ActionIcon
          variant="subtle"
          color="gray"
          size="lg"
          radius="md"
          onClick={onToggleChannels}
          aria-label="Toggle channels"
        >
          {channelsOpened ? <PanelLeftClose size={18} /> : <PanelLeftOpen size={18} />}
        </ActionIcon>
      </Tooltip>

      <Tooltip label="Solvex" position="right">
        <Avatar
          radius="md"
          size="md"
          color="indigo"
          style={{ cursor: 'pointer' }}
          onClick={() => router.replace('/lobby')}
        >
          S
        </Avatar>
      </Tooltip>
      <Tooltip label="Lobby" position="right">
        <ActionIcon
          variant="subtle"
          color="gray"
          size="lg"
          radius="md"
          onClick={() => router.replace('/lobby')}
          aria-label="Lobby"
        >
          <Home size={18} />
        </ActionIcon>
      </Tooltip>

      <Box style={{ flex: 1 }} />

      <Tooltip label="Settings" position="right">
        <ActionIcon
          variant="subtle"
          color="gray"
          size="lg"
          radius="md"
          onClick={onOpenSettings}
          aria-label="Settings"
        >
          <Settings size={18} />
        </ActionIcon>
      </Tooltip>
    </Stack>
  );
};
