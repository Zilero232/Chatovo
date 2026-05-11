'use client';

import { Avatar, Group, Stack, Text } from '@mantine/core';
import { motion } from 'motion/react';

import { formatTime } from '../../lib/format';
import { gradientForIdentity } from '../../lib/palette';
import { parseMessage } from '../../lib/parse';
import type { MessageGroup, RawMessage } from '../../model/types';
import { ChatMessageBody } from './ChatMessageBody';

type Props = {
  group: MessageGroup;
  isMe: boolean;
};

export const ChatMessageGroup = ({ group, isMe }: Props) => {
  const grad = gradientForIdentity(group.sender);
  const displayName = group.sender.includes('@') ? group.sender.split('@')[0] : group.sender;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.18 }}
      whileHover={{ backgroundColor: 'rgba(255,255,255,0.025)' }}
      style={{ borderRadius: 8, padding: '6px 8px' }}
    >
      <Group align="flex-start" gap="sm" wrap="nowrap">
        <Avatar
          variant="gradient"
          gradient={{ from: grad.from, to: grad.to, deg: 135 }}
          radius="xl"
          size="md"
          style={{ boxShadow: `0 4px 12px var(--mantine-color-${grad.from}-9)40` }}
        >
          {displayName.charAt(0).toUpperCase()}
        </Avatar>
        <Stack gap={2} flex={1} style={{ minWidth: 0 }}>
          <Group gap="xs" align="baseline">
            <Text
              size="sm"
              fw={700}
              variant="gradient"
              gradient={{ from: grad.from, to: grad.to, deg: 90 }}
            >
              {displayName}
            </Text>
            {isMe ? (
              <Text component="span" size="10px" c="dimmed">
                you
              </Text>
            ) : null}
            <Text size="10px" c="dimmed">
              {formatTime(group.first)}
            </Text>
          </Group>
          <Stack gap={4}>
            {group.messages.map((m: RawMessage) => (
              <ChatMessageBody
                key={`${m.timestamp}-${m.message.slice(0, 16)}`}
                msg={parseMessage(m.message)}
              />
            ))}
          </Stack>
        </Stack>
      </Group>
    </motion.div>
  );
};
