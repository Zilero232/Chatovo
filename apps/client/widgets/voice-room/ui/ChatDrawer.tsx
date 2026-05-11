'use client';

import { Drawer } from '@mantine/core';

import { ChatPanel } from './ChatPanel';

type Props = {
  opened: boolean;
  onClose: () => void;
};

export const ChatDrawer = ({ opened, onClose }: Props) => (
  <Drawer
    opened={opened}
    onClose={onClose}
    position="right"
    size={380}
    title="Chat"
    withCloseButton
    padding={0}
    styles={{
      body: { height: 'calc(100% - 60px)', padding: 0 },
      content: { display: 'flex', flexDirection: 'column' },
    }}
  >
    <ChatPanel />
  </Drawer>
);
