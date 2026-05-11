'use client';

import { Stack } from '@mantine/core';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

import { useCurrentUser } from '@/entities/user';

import { readRecentRooms } from '../lib/recent-rooms';
import { ChannelsFooter } from './components/ChannelsFooter';
import { ChannelsHeader } from './components/ChannelsHeader';
import { ChannelsList } from './components/ChannelsList';

type Props = {
  onOpenSettings: () => void;
};

export const ChannelsPanel = ({ onOpenSettings }: Props) => {
  const router = useRouter();
  const params = useSearchParams();
  const activeRoom = params.get('name');
  const { user, isAdmin } = useCurrentUser();
  const [rooms, setRooms] = useState<string[]>([]);
  const displayName = user?.email?.split('@')[0] ?? 'you';
  const initial = displayName.charAt(0).toUpperCase();

  useEffect(() => {
    setRooms(readRecentRooms());
  }, []);

  return (
    <Stack
      bg="dark.7"
      w={240}
      h="100%"
      gap={0}
      style={{ borderRight: '1px solid var(--mantine-color-dark-6)' }}
    >
      <ChannelsHeader isAdmin={isAdmin} />
      <ChannelsList
        activeRoom={activeRoom}
        rooms={rooms}
        displayName={displayName}
        initial={initial}
        onSelectLobby={() => router.replace('/lobby')}
        onSelectRoom={(room) => router.push(`/room?name=${encodeURIComponent(room)}`)}
      />
      <ChannelsFooter displayName={displayName} initial={initial} onOpenSettings={onOpenSettings} />
    </Stack>
  );
};
