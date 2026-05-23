import { z } from 'zod';

export const tokenResponseSchema = z.object({
  token: z.string(),
});

// Shape of the JSON string carried in LiveKit participant.metadata. Set when
// the access token is issued and broadcast to every other participant by
// LiveKit — the only channel for per-user data like the verified mark.
export const participantMetadataSchema = z.object({
  email: z.string().nullable().default(null),
  verified: z.boolean().default(false),
  profileUrl: z.string().nullable().default(null),
  avatarUrl: z.string().nullable().default(null),
});

export const roomParticipantSchema = z.object({
  identity: z.string(),
  name: z.string(),
  verified: z.boolean().default(false),
  profileUrl: z.string().nullable().default(null),
  avatarUrl: z.string().nullable().default(null),
});

// SSE payload pushed to clients: the full participant list of every active
// room, keyed by roomId. The client replaces its cache wholesale on each event.
export const roomsParticipantsSnapshotSchema = z.object({
  rooms: z.record(z.string(), z.array(roomParticipantSchema)),
});
