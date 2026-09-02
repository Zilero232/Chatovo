import { safeJsonParse } from '@chatovo/schemas';

/**
 * Reads the `invisible` flag out of a participant's raw LiveKit metadata JSON.
 * Kept separate from `participantMetadataSchema` on purpose: that schema feeds
 * presence, and the invisible flag must never travel to other clients.
 */
export const isInvisibleParticipant = (metadata: string | undefined): boolean => {
  const parsed = safeJsonParse(metadata);

  return 'invisible' in parsed && parsed.invisible === true;
};
