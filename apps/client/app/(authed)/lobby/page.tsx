'use client';

import { Container, Paper, ScrollArea, SimpleGrid, Stack, Text, Title } from '@mantine/core';

import { useCurrentUser } from '@/entities/user';
import { CreateRoomForm } from '@/features/create-room';
import { JoinRoomForm } from '@/features/join-room';

const LobbyRoute = () => {
  const { isAdmin } = useCurrentUser();

  return (
    <ScrollArea h="100%" type="hover">
      <Container size="md" py="xl">
        <Stack gap="lg">
          <Stack gap={4}>
            <Title order={2}>Lobby</Title>
            <Text c="dimmed" size="sm">
              Join an existing voice room or{' '}
              {isAdmin ? 'create a new one' : 'ask admin to create one'}
            </Text>
          </Stack>
          <SimpleGrid cols={{ base: 1, md: 2 }} spacing="md">
            <Paper withBorder p="lg" radius="md">
              <Stack gap="md">
                <Stack gap={2}>
                  <Title order={4}>Join a room</Title>
                  <Text c="dimmed" size="xs">
                    Enter an existing room name
                  </Text>
                </Stack>
                <JoinRoomForm />
              </Stack>
            </Paper>

            {isAdmin ? (
              <Paper withBorder p="lg" radius="md">
                <Stack gap="md">
                  <Stack gap={2}>
                    <Title order={4}>Create a room</Title>
                    <Text c="dimmed" size="xs">
                      Admin only — creates room on first connect
                    </Text>
                  </Stack>
                  <CreateRoomForm />
                </Stack>
              </Paper>
            ) : null}
          </SimpleGrid>
        </Stack>
      </Container>
    </ScrollArea>
  );
};

export default LobbyRoute;
