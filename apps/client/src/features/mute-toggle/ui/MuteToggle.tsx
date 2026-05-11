import { useLocalParticipant } from '@livekit/components-react';
import { Track } from 'livekit-client';
import { Mic, MicOff } from 'lucide-react';
import { Button } from '@/shared/ui/button';

export const MuteToggle = () => {
  const { localParticipant } = useLocalParticipant();
  const enabled = localParticipant.isMicrophoneEnabled;

  return (
    <Button
      type="button"
      variant={enabled ? 'secondary' : 'destructive'}
      size="icon"
      onClick={() => localParticipant.setMicrophoneEnabled(!enabled)}
      aria-label={enabled ? 'Mute mic' : 'Unmute mic'}
      title={enabled ? 'Mute mic' : 'Unmute mic'}
      data-source={Track.Source.Microphone}
    >
      {enabled ? <Mic className="size-4" /> : <MicOff className="size-4" />}
    </Button>
  );
};
