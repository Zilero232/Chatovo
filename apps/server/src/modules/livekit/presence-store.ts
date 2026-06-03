import type { RoomParticipant, RoomsParticipantsSnapshot } from '@chatovo/schemas';

type Listener = (snapshot: RoomsParticipantsSnapshot) => void;

const rooms = new Map<string, Map<string, RoomParticipant>>();
const listeners = new Set<Listener>();

// Lobby presence: per-user connection counter. A user opens N tabs → counter
// goes to N; closing N-1 keeps them online; closing the last evicts them.
const lobbyConnections = new Map<string, number>();

const buildSnapshot = (): RoomsParticipantsSnapshot => {
  const result: RoomsParticipantsSnapshot['rooms'] = {};

  for (const [roomId, participants] of rooms) {
    if (participants.size > 0) {
      result[roomId] = [...participants.values()];
    }
  }

  return { rooms: result, lobbyOnline: lobbyConnections.size };
};

const emit = () => {
  const snapshot = buildSnapshot();

  for (const listener of listeners) {
    listener(snapshot);
  }
};

export const getSnapshot = buildSnapshot;

export const subscribe = (listener: Listener): (() => void) => {
  listeners.add(listener);

  return () => {
    return listeners.delete(listener);
  };
};

export const addLobbyConnection = (userId: string) => {
  const current = lobbyConnections.get(userId) ?? 0;
  const isNewUser = current === 0;

  lobbyConnections.set(userId, current + 1);

  if (isNewUser) {
    emit();
  }
};

export const removeLobbyConnection = (userId: string) => {
  const current = lobbyConnections.get(userId);

  if (!current) {
    return;
  }

  if (current <= 1) {
    lobbyConnections.delete(userId);
    emit();

    return;
  }

  lobbyConnections.set(userId, current - 1);
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

// Partial presence update (mic, deafen, ...) — both webhooks and client
// reports flow through here. Only emits when a field actually changes.
type ParticipantPatch = Partial<Pick<RoomParticipant, 'micMuted' | 'deafened'>>;

export const patchParticipant = (roomId: string, identity: string, patch: ParticipantPatch) => {
  const participants = rooms.get(roomId);
  const current = participants?.get(identity);

  if (!participants || !current) {
    return;
  }

  const next = { ...current, ...patch };

  if (next.micMuted === current.micMuted && next.deafened === current.deafened) {
    return;
  }

  participants.set(identity, next);

  emit();
};

export const removeParticipant = (roomId: string, identity: string) => {
  const participants = rooms.get(roomId);

  if (!participants) {
    return;
  }

  participants.delete(identity);

  if (participants.size === 0) {
    rooms.delete(roomId);
  }

  emit();
};

export const clearRoom = (roomId: string) => {
  if (rooms.delete(roomId)) {
    emit();
  }
};

// Replaces a room's participants wholesale — used by the LiveKit reconcile path.
export const replaceRoom = (roomId: string, participants: Map<string, RoomParticipant>) => {
  if (participants.size > 0) {
    rooms.set(roomId, participants);
  } else {
    rooms.delete(roomId);
  }

  emit();
};
