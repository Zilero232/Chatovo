'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';
import { toast } from 'sonner';

import { useRoomToken } from '@/entities/room';
import { useCurrentUser } from '@/entities/user';
import { VoiceRoom } from '@/widgets/voice-room';

const RoomRoute = () => {
  const router = useRouter();
  const params = useSearchParams();
  const name = params.get('name');
  const { session } = useCurrentUser();
  const query = useRoomToken({ roomName: name, accessToken: session?.access_token ?? null });

  useEffect(() => {
    if (!name) {
      router.replace('/lobby');
      return;
    }
    if (query.error) {
      toast.error(query.error.message);
      router.replace('/lobby');
    }
  }, [name, query.error, router]);

  if (!name) return null;

  if (query.isLoading || !query.data) {
    return (
      <div className="flex h-full items-center justify-center text-muted-foreground text-sm">
        Connecting to "{name}"...
      </div>
    );
  }

  return (
    <VoiceRoom
      token={query.data.token}
      serverUrl={query.data.url}
      roomName={name}
      onLeave={() => router.replace('/lobby')}
    />
  );
};

export default RoomRoute;
