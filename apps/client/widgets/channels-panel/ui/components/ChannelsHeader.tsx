'use client';

import { Badge, Box, Group, Text } from '@mantine/core';

type Props = {
  isAdmin: boolean;
};

export const ChannelsHeader = ({ isAdmin }: Props) => (
  <Box px="md" py="sm" style={{ borderBottom: '1px solid var(--mantine-color-dark-6)' }}>
    <Group justify="space-between" align="center">
      <Text fw={600} size="sm">
        Solvex
      </Text>
      {isAdmin ? (
        <Badge size="xs" color="indigo" variant="light">
          admin
        </Badge>
      ) : null}
    </Group>
  </Box>
);
