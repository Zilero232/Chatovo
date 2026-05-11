'use client';

import { Center, Stack, Text } from '@mantine/core';
import { MessageSquare } from 'lucide-react';
import { motion } from 'motion/react';

const BADGE_GRADIENT =
  'linear-gradient(135deg, var(--mantine-color-indigo-9), var(--mantine-color-violet-9))';

export const ChatEmpty = () => (
  <Center h="100%" mih={300} p="md">
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
    >
      <Stack align="center" gap="xs">
        <motion.div
          animate={{ y: [0, -6, 0] }}
          transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
          style={{
            width: 64,
            height: 64,
            borderRadius: 16,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: BADGE_GRADIENT,
            boxShadow: '0 8px 32px rgba(99, 102, 241, 0.3)',
          }}
        >
          <MessageSquare size={28} color="white" />
        </motion.div>
        <Text size="sm" fw={600} mt="xs">
          No messages yet
        </Text>
        <Text size="xs" c="dimmed">
          Say hi or share a file
        </Text>
      </Stack>
    </motion.div>
  </Center>
);
