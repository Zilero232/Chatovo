import { useTracks } from '@livekit/components-react';
import { Track } from 'livekit-client';
import { ParticipantTile } from '@/entities/voice-participant';

export const ParticipantsGrid = () => {
  const tracks = useTracks(
    [
      { source: Track.Source.Camera, withPlaceholder: true },
      { source: Track.Source.ScreenShare, withPlaceholder: false },
    ],
    { onlySubscribed: false },
  );

  if (tracks.length === 0) {
    return (
      <div className="flex h-full items-center justify-center text-muted-foreground">
        Waiting for participants...
      </div>
    );
  }

  return (
    <div className="grid h-full grid-cols-1 gap-3 p-4 sm:grid-cols-2 lg:grid-cols-3">
      {tracks.map((trackRef) => (
        <ParticipantTile
          key={`${trackRef.participant.identity}-${trackRef.publication?.trackSid ?? trackRef.source}`}
          trackRef={trackRef}
        />
      ))}
    </div>
  );
};
