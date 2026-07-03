import { participantMetadataSchema, safeJsonParse } from '@chatovo/schemas';
import { RoomServiceClient, TrackSource } from 'livekit-server-sdk';
import { env } from '../../core';
import { replaceRoom } from './presence-store';
import type { RoomParticipant } from '@chatovo/schemas';
import type { ParticipantInfo, TrackInfo } from 'livekit-server-sdk';

export {
  addLobbyConnection,
  addParticipant,
  clearRoom,
  getSnapshot,
  patchParticipant,
  removeLobbyConnection,
  removeParticipant,
} from './presence-store';

const roomService = new RoomServiceClient(
  env.LIVEKIT_URL,
  env.LIVEKIT_API_KEY,
  env.LIVEKIT_API_SECRET,
);

export const parseParticipantMeta = (
  metadata: string | undefined,
): Pick<RoomParticipant, 'verified' | 'profileUrl' | 'avatarUrl' | 'bannerColor'> => {
  const { verified, profileUrl, avatarUrl, bannerColor } = participantMetadataSchema.parse(
    safeJsonParse(metadata),
  );

  return { verified, profileUrl, avatarUrl, bannerColor };
};

// Mic counts as live only if an unmuted microphone track is published.
// No track published yet → effectively silent for the room.
export const isMicMuted = (tracks: TrackInfo[] | undefined): boolean => {
  const mic = tracks?.find((track) => track.source === TrackSource.MICROPHONE);

  return !mic || mic.muted;
};

const toRoomParticipant = (p: ParticipantInfo): RoomParticipant => {
  return {
    identity: p.identity,
    name: p.name || p.identity,
    micMuted: isMicMuted(p.tracks),
    deafened: p.attributes?.deafened === 'true',
    ...parseParticipantMeta(p.metadata),
  };
};

// Reconciles the in-memory store with LiveKit's actual state — webhooks can be
// missed (server restart, network blip). Called lazily and on server boot.
export const syncRoom = async (roomId: string) => {
  try {
    const live = await roomService.listParticipants(roomId);
    const participants = new Map<string, RoomParticipant>(
      live.map((p) => [p.identity, toRoomParticipant(p)]),
    );

    replaceRoom(roomId, participants);
  } catch {
    replaceRoom(roomId, new Map());
  }
};
