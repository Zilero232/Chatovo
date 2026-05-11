import { useRoomContext } from '@livekit/components-react';
import { useNavigate } from '@tanstack/react-router';
import { PhoneOff } from 'lucide-react';
import { Button } from '@/shared/ui/button';

export const LeaveRoom = () => {
  const room = useRoomContext();
  const navigate = useNavigate();

  const handleClick = async () => {
    await room.disconnect();
    navigate({ to: '/lobby' });
  };

  return (
    <Button
      type="button"
      variant="destructive"
      onClick={handleClick}
      aria-label="Leave room"
      title="Leave room"
    >
      <PhoneOff className="size-4" />
      <span className="ml-2 hidden sm:inline">Leave</span>
    </Button>
  );
};
