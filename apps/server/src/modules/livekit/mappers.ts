import { isMicMuted, parseParticipantMeta } from './presence';

import type { RoomParticipant } from '@chatovo/schemas';
import type { ParticipantInfo } from 'livekit-server-sdk';

export const toRoomParticipant = (p: ParticipantInfo): RoomParticipant => {
  return {
    identity: p.identity,
    name: p.name || p.identity,
    micMuted: isMicMuted(p.tracks),
    deafened: p.attributes?.deafened === 'true',
    ...parseParticipantMeta(p.metadata),
  };
};
