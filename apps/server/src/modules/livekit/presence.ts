import type { ParticipantMetadata, RoomParticipant } from '@chatovo/schemas';
import type { TrackInfo } from 'livekit-server-sdk';

import { participantMetadataSchema, safeJsonParse } from '@chatovo/schemas';
import { Logger } from '@nestjs/common';
import { RoomServiceClient, TrackSource } from 'livekit-server-sdk';

import { env } from '../../core';
import { isInvisibleParticipant } from './lib';
import { toRoomParticipant } from './mappers';
import { replaceRoom } from './presence-store';

export {
  addLobbyConnection,
  addParticipant,
  clearRoom,
  getSnapshot,
  patchParticipant,
  removeLobbyConnection,
  removeParticipant
} from './presence-store';

const roomService = new RoomServiceClient(
  env.LIVEKIT_URL,
  env.LIVEKIT_API_KEY,
  env.LIVEKIT_API_SECRET
);

const logger = new Logger('LivekitPresence');

const isRoomNotFound = (error: unknown): boolean => {
  const status = (error as { status?: number }).status;
  const code = (error as { code?: string }).code;

  return status === 404 || code === 'not_found';
};

export const parseParticipantMeta = (metadata: string | undefined): ParticipantMetadata => {
  const parsed = participantMetadataSchema.safeParse(safeJsonParse(metadata));

  return parsed.success ? parsed.data : participantMetadataSchema.parse({});
};

export const isMicMuted = (tracks: TrackInfo[] | undefined): boolean => {
  const mic = tracks?.find((track) => track.source === TrackSource.MICROPHONE);

  return !mic || mic.muted;
};

export const syncRoom = async (roomId: string) => {
  try {
    const live = await roomService.listParticipants(roomId);
    const participants = new Map<string, RoomParticipant>(
      live
        .filter((p) => !p.permission?.hidden && !isInvisibleParticipant(p.metadata))
        .map((p) => [p.identity, toRoomParticipant(p)])
    );

    replaceRoom(roomId, participants);
  } catch (error) {
    if (isRoomNotFound(error)) {
      replaceRoom(roomId, new Map());

      return;
    }

    logger.warn(`Failed to sync presence for room ${roomId}: ${String(error)}`);
  }
};
