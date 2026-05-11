import { useLocalParticipant } from '@livekit/components-react';
import { Video, VideoOff } from 'lucide-react';
import { Button } from '@/shared/ui/button';

export const CameraToggle = () => {
  const { localParticipant } = useLocalParticipant();
  const enabled = localParticipant.isCameraEnabled;

  return (
    <Button
      type="button"
      variant={enabled ? 'secondary' : 'outline'}
      size="icon"
      onClick={() => localParticipant.setCameraEnabled(!enabled)}
      aria-label={enabled ? 'Stop camera' : 'Start camera'}
      title={enabled ? 'Stop camera' : 'Start camera'}
    >
      {enabled ? <Video className="size-4" /> : <VideoOff className="size-4" />}
    </Button>
  );
};
