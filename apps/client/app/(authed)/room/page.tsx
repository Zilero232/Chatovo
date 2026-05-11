'use client';

import type { LocalUserChoices } from '@livekit/components-core';
import { PreJoin } from '@livekit/components-react';
import { Box, Center, Container, Loader, Paper, Stack, Text } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

import { useRoomToken } from '@/entities/room';
import { useCurrentUser } from '@/entities/user';
import { VoiceRoom } from '@/widgets/voice-room';

const RoomRoute = () => {
  const router = useRouter();
  const params = useSearchParams();
  const name = params.get('name');
  const { session } = useCurrentUser();
  const query = useRoomToken({ roomName: name, accessToken: session?.access_token ?? null });
  const [choices, setChoices] = useState<LocalUserChoices | null>(null);

  useEffect(() => {
    if (!name) {
      router.replace('/lobby');
      return;
    }
    if (query.error) {
      notifications.show({
        color: 'red',
        title: 'Room error',
        message: query.error.message,
      });
      router.replace('/lobby');
    }
  }, [name, query.error, router]);

  if (!name) return null;

  if (query.isLoading || !query.data) {
    return (
      <Center h="100%">
        <Stack align="center" gap="sm">
          <Loader size="sm" />
          <Text c="dimmed" size="sm">
            Connecting to "{name}"...
          </Text>
        </Stack>
      </Center>
    );
  }

  if (!choices) {
    return (
      <Box p="md" h="100%">
        <Container size="md" h="100%" p={0}>
          <Paper
            withBorder
            radius="md"
            h="100%"
            style={{ overflow: 'hidden' }}
            data-lk-theme="default"
          >
            <PreJoin
              defaults={{
                username: session?.user.email ?? 'guest',
                audioEnabled: true,
                videoEnabled: false,
              }}
              onSubmit={setChoices}
              persistUserChoices
            />
          </Paper>
        </Container>
      </Box>
    );
  }

  return (
    <Box p="md" h="100%">
      <Container size="full" h="100%" p={0}>
        <Paper
          withBorder
          radius="md"
          h="100%"
          style={{ overflow: 'hidden', display: 'flex', flexDirection: 'column' }}
        >
          <VoiceRoom
            token={query.data.token}
            serverUrl={query.data.url}
            roomName={name}
            userChoices={choices}
            onLeave={() => router.replace('/lobby')}
          />
        </Paper>
      </Container>
    </Box>
  );
};

export default RoomRoute;
