import type { RoomParticipant } from '@chatovo/schemas';

import type { ToRoomParticipantInput } from './livekit.types';

import { isMicMuted, parseParticipantMeta } from './presence';

export const toRoomParticipant = ({
  participant,
  invisible
}: ToRoomParticipantInput): RoomParticipant => ({
  identity: participant.identity,
  name: participant.name || participant.identity,
  micMuted: isMicMuted(participant.tracks),
  deafened: participant.attributes?.deafened === 'true',
  invisible,
  activity: null,
  ...parseParticipantMeta(participant.metadata)
});
