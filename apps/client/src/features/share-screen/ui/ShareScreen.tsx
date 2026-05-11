import { useLocalParticipant } from '@livekit/components-react';
import { ScreenShare, ScreenShareOff } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/shared/ui/button';

export const ShareScreen = () => {
  const { localParticipant } = useLocalParticipant();
  const enabled = localParticipant.isScreenShareEnabled;

  const handleClick = async () => {
    try {
      await localParticipant.setScreenShareEnabled(!enabled, { audio: true });
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      toast.error(`Screen share failed: ${message}`);
    }
  };

  return (
    <Button
      type="button"
      variant={enabled ? 'default' : 'outline'}
      size="icon"
      onClick={handleClick}
      aria-label={enabled ? 'Stop sharing' : 'Share screen/window'}
      title={enabled ? 'Stop sharing' : 'Share screen/window'}
    >
      {enabled ? <ScreenShareOff className="size-4" /> : <ScreenShare className="size-4" />}
    </Button>
  );
};
