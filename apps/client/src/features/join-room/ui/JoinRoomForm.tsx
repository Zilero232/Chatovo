import { useState } from 'react';
import { toast } from 'sonner';
import { useEnterRoom } from '@/entities/room';
import { useCurrentUser } from '@/entities/user';
import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';
import { Label } from '@/shared/ui/label';

export const JoinRoomForm = () => {
  const [room, setRoom] = useState('');
  const enter = useEnterRoom();
  const { session } = useCurrentUser();

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!session) return;
    enter.mutate(
      { room, accessToken: session.access_token },
      { onError: (err: Error) => toast.error(err.message) },
    );
  };

  return (
    <form onSubmit={onSubmit} className="space-y-3">
      <div className="space-y-2">
        <Label htmlFor="join-room">Room name</Label>
        <Input
          id="join-room"
          value={room}
          onChange={(e) => setRoom(e.target.value)}
          placeholder="my-room"
          autoComplete="off"
        />
      </div>
      <Button type="submit" className="w-full" disabled={enter.isPending || !room.trim()}>
        {enter.isPending ? 'Joining...' : 'Join room'}
      </Button>
    </form>
  );
};
