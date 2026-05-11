import type { TrackReferenceOrPlaceholder } from '@livekit/components-core';
import {
  ParticipantName,
  TrackRefContext,
  useEnsureTrackRef,
  useIsSpeaking,
  VideoTrack,
} from '@livekit/components-react';
import { MicOff } from 'lucide-react';
import { cn } from '@/shared/lib';

interface Props {
  trackRef: TrackReferenceOrPlaceholder;
}

const TileInner = () => {
  const ref = useEnsureTrackRef();
  const isSpeaking = useIsSpeaking(ref.participant);
  const isMuted = ref.publication?.isMuted ?? false;
  const hasVideo = ref.publication && !ref.publication.isMuted;

  return (
    <div
      className={cn(
        'relative aspect-video overflow-hidden rounded-lg border bg-muted',
        isSpeaking && 'ring-2 ring-primary',
      )}
    >
      {hasVideo ? (
        <VideoTrack trackRef={ref} className="size-full object-cover" />
      ) : (
        <div className="flex h-full items-center justify-center text-muted-foreground text-sm">
          {ref.participant.identity}
        </div>
      )}
      <div className="absolute bottom-2 left-2 flex items-center gap-1 rounded-md bg-black/60 px-2 py-0.5 text-white text-xs">
        <ParticipantName participant={ref.participant} />
        {isMuted ? <MicOff className="size-3" /> : null}
      </div>
    </div>
  );
};

export const ParticipantTile = ({ trackRef }: Props) => (
  <TrackRefContext.Provider value={trackRef}>
    <TileInner />
  </TrackRefContext.Provider>
);
