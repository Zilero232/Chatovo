'use client';

import { Stack } from '@mantine/core';
import { AnimatePresence } from 'motion/react';

import type { MessageGroup } from '../../model/types';
import { ChatMessageGroup } from './ChatMessageGroup';

type Props = {
  groups: MessageGroup[];
  selfIdentity: string | undefined;
};

export const ChatMessageList = ({ groups, selfIdentity }: Props) => (
  <Stack gap={4} p="sm">
    <AnimatePresence initial={false}>
      {groups.map((group) => (
        <ChatMessageGroup
          key={`${group.sender}-${group.first}`}
          group={group}
          isMe={group.sender === selfIdentity}
        />
      ))}
    </AnimatePresence>
  </Stack>
);
