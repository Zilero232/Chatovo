'use client';

import { useQuery } from '@tanstack/react-query';
import { useSearchParams } from 'next/navigation';

import { useFriends } from '@/entities/social/friend';
import { getOrCreateFriendDmRoom } from '@/shared/api';
import { QUERY_KEYS } from '@/shared/constants';

export const useDmPage = () => {
  const searchParams = useSearchParams();

  const peerId = searchParams.get('user');

  const { data: friends } = useFriends(Boolean(peerId));
  const { data: room, isPending } = useQuery({
    queryKey: QUERY_KEYS.friendDmRoom(peerId ?? ''),
    enabled: Boolean(peerId),
    queryFn: () => getOrCreateFriendDmRoom(peerId ?? '')
  });

  const peer = friends?.find((entry) => entry.user.id === peerId)?.user ?? null;

  return { peerId, peer, roomId: room?.id ?? null, isPending };
};
