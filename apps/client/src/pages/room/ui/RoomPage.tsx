import { useNavigate, useParams } from '@tanstack/react-router';
import { useEffect } from 'react';
import { toast } from 'sonner';
import { VoiceRoom } from '@/widgets/voice-room';
import { useRoomToken } from '../model/use-room-token';

export const RoomPage = () => {
  const { name } = useParams({ from: '/_authed/room/$name' });
  const navigate = useNavigate();
  const query = useRoomToken(name);

  useEffect(() => {
    if (query.error) {
      toast.error(query.error.message);
      navigate({ to: '/lobby' });
    }
  }, [query.error, navigate]);

  if (query.isLoading || !query.data) {
    return (
      <div className="flex h-full items-center justify-center text-muted-foreground text-sm">
        Connecting to "{name}"...
      </div>
    );
  }

  return <VoiceRoom token={query.data.token} serverUrl={query.data.url} roomName={name} />;
};
