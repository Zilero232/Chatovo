'use client';

import { Button, Stack, TextInput } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { useState } from 'react';

import { useEnterRoom } from '@/entities/room';
import { useCurrentUser } from '@/entities/user';

export const JoinRoomForm = () => {
  const [room, setRoom] = useState('');
  const enter = useEnterRoom();
  const { session } = useCurrentUser();

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!session) return;
    enter.mutate(
      { room, accessToken: session.access_token },
      {
        onError: (err: Error) =>
          notifications.show({ color: 'red', title: 'Error', message: err.message }),
      },
    );
  };

  return (
    <form onSubmit={onSubmit}>
      <Stack gap="sm">
        <TextInput
          label="Room name"
          placeholder="my-room"
          autoComplete="off"
          value={room}
          onChange={(e) => setRoom(e.currentTarget.value)}
        />
        <Button type="submit" loading={enter.isPending} disabled={!room.trim()} fullWidth>
          Join room
        </Button>
      </Stack>
    </form>
  );
};
