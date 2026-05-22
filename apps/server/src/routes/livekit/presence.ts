import { participantMetadataSchema, safeJsonParse } from '@chatovo/schemas';
import { RoomServiceClient } from 'livekit-server-sdk';
import { env } from '../../lib/env';
import type { RoomParticipant, RoomsParticipantsSnapshot } from '@chatovo/schemas';

type Listener = (snapshot: RoomsParticipantsSnapshot) => void;

const rooms = new Map<string, Map<string, RoomParticipant>>();
const listeners = new Set<Listener>();

const roomService = new RoomServiceClient(
  env.LIVEKIT_URL,
  env.LIVEKIT_API_KEY,
  env.LIVEKIT_API_SECRET,
);

export const parseParticipantMeta = (
  metadata: string | undefined,
): Pick<RoomParticipant, 'verified' | 'profileUrl'> => {
  const { verified, profileUrl } = participantMetadataSchema.parse(safeJsonParse(metadata));

  return { verified, profileUrl };
};

const buildSnapshot = (): RoomsParticipantsSnapshot => {
  const result: RoomsParticipantsSnapshot['rooms'] = {};

  for (const [roomId, participants] of rooms) {
    if (participants.size > 0) result[roomId] = [...participants.values()];
  }

  return { rooms: result };
};

const emit = () => {
  const snapshot = buildSnapshot();

  for (const listener of listeners) listener(snapshot);
};

export const getSnapshot = buildSnapshot;

export const subscribe = (listener: Listener): (() => void) => {
  listeners.add(listener);

  return () => listeners.delete(listener);
};

export const addParticipant = (roomId: string, participant: RoomParticipant) => {
  let participants = rooms.get(roomId);

  if (!participants) {
    participants = new Map();
    rooms.set(roomId, participants);
  }

  participants.set(participant.identity, participant);
  emit();
};

export const removeParticipant = (roomId: string, identity: string) => {
  const participants = rooms.get(roomId);

  if (!participants) return;

  participants.delete(identity);

  if (participants.size === 0) rooms.delete(roomId);

  emit();
};

export const clearRoom = (roomId: string) => {
  if (rooms.delete(roomId)) emit();
};

// Reconciles the in-memory store with LiveKit's actual state — webhooks can be
// missed (server restart, network blip). Called lazily and on server boot.
export const syncRoom = async (roomId: string) => {
  try {
    const live = await roomService.listParticipants(roomId);
    const participants = new Map<string, RoomParticipant>(
      live.map((p) => [
        p.identity,
        { identity: p.identity, name: p.name || p.identity, ...parseParticipantMeta(p.metadata) },
      ]),
    );

    if (participants.size > 0) rooms.set(roomId, participants);
    else rooms.delete(roomId);
  } catch {
    rooms.delete(roomId);
  }

  emit();
};
