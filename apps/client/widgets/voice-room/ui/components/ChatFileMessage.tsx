'use client';

import { Anchor, Box, Group, Paper, Stack, Text } from '@mantine/core';
import { motion } from 'motion/react';

import { formatSize, iconForMime } from '../../lib/format';

type Props = {
  url: string;
  name: string;
  size: number;
  mime: string;
};

const ICON_GRADIENT =
  'linear-gradient(135deg, var(--mantine-color-indigo-9), var(--mantine-color-violet-9))';

export const ChatFileMessage = ({ url, name, size, mime }: Props) => {
  const Icon = iconForMime(mime);

  return (
    <motion.div whileHover={{ y: -1 }} style={{ display: 'inline-block', marginTop: 4 }}>
      <Paper p="xs" radius="md" bg="dark.6" withBorder style={{ maxWidth: 280, cursor: 'pointer' }}>
        <Group gap="sm" wrap="nowrap">
          <Box
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 40,
              height: 40,
              borderRadius: 10,
              background: ICON_GRADIENT,
              flexShrink: 0,
            }}
          >
            <Icon size={20} color="white" />
          </Box>
          <Stack gap={0} style={{ overflow: 'hidden', flex: 1 }}>
            <Anchor
              href={url}
              target="_blank"
              rel="noreferrer"
              size="sm"
              fw={600}
              truncate
              c="white"
            >
              {name}
            </Anchor>
            <Text size="10px" c="dimmed">
              {formatSize(size)} · {mime.split('/')[1] ?? 'file'}
            </Text>
          </Stack>
        </Group>
      </Paper>
    </motion.div>
  );
};
