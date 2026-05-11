'use client';

import { ControlBar } from '@livekit/components-react';
import { ActionIcon, Group, Tooltip } from '@mantine/core';
import { MessageSquare } from 'lucide-react';

type Props = {
  onToggleChat: () => void;
  chatOpened: boolean;
};

export const RoomControls = ({ onToggleChat, chatOpened }: Props) => (
  <Group justify="center" gap="xs" p="xs" data-lk-theme="default">
    <ControlBar controls={{ chat: false, settings: false }} variation="minimal" />
    <Tooltip label={chatOpened ? 'Hide chat' : 'Show chat'}>
      <ActionIcon
        variant={chatOpened ? 'filled' : 'subtle'}
        color="indigo"
        size="lg"
        onClick={onToggleChat}
        aria-label="Toggle chat"
      >
        <MessageSquare size={18} />
      </ActionIcon>
    </Tooltip>
  </Group>
);
