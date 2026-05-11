import { useState } from 'react';
import { toast } from 'sonner';

import { useEnterRoom } from '@/entities/room';
import { useCurrentUser } from '@/entities/user';
import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';
import { Label } from '@/shared/ui/label';

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
        onSuccess: () => toast.success(`Room "${room}" created`),
        onError: (err: Error) => toast.error(err.message),
      },
    );
  };

  return (
    <form className="space-y-3" onSubmit={onSubmit}>
      <div className="space-y-2">
        <Label htmlFor="create-room">New room name</Label>
        <Input
          id="create-room"
          value={room}
          onChange={(e) => setRoom(e.target.value)}
          placeholder="team-standup"
          autoComplete="off"
        />
      </div>
      <Button
        className="w-full"
        type="submit"
        variant="secondary"
        disabled={enter.isPending || !room.trim()}
      >
        {enter.isPending ? 'Creating...' : 'Create room'}
      </Button>
    </form>
  );
};
