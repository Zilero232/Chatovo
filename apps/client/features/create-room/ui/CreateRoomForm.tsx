'use client';

import { Button, Stack, TextInput } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { useState } from 'react';

import { useEnterRoom } from '@/entities/room';
import { useCurrentUser } from '@/entities/user';

export const CreateRoomForm = () => {
  const [room, setRoom] = useState('');
  const enter = useEnterRoom();
  const { session } = useCurrentUser();

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!session) return;
    enter.mutate(
      { room, accessToken: session.access_token, asAdmin: true },
      {
        onSuccess: () =>
          notifications.show({
            color: 'green',
            title: 'Room created',
            message: `"${room}"`,
          }),
        onError: (err: Error) =>
          notifications.show({ color: 'red', title: 'Error', message: err.message }),
      },
    );
  };

  return (
    <form onSubmit={onSubmit}>
      <Stack gap="sm">
        <TextInput
          label="New room name"
          placeholder="team-standup"
          autoComplete="off"
          value={room}
          onChange={(e) => setRoom(e.currentTarget.value)}
        />
        <Button
          type="submit"
          variant="default"
          loading={enter.isPending}
          disabled={!room.trim()}
          fullWidth
        >
          Create room
        </Button>
      </Stack>
    </form>
  );
};
