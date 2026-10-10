import { describe, expect, it } from 'vitest';

import { LINK_PREVIEW } from '../../../config';
import { describeRoomPreview } from '../describe-room-preview';

const { openRoom, privateRoom } = LINK_PREVIEW.room.copy;

describe('describeRoomPreview', () => {
  it('hides the live count of a private room', () => {
    expect(describeRoomPreview({ isPrivate: true, participantCount: 4 })).toBe(privateRoom);
  });

  it('leads with the live count when someone is in the room', () => {
    expect(describeRoomPreview({ isPrivate: false, participantCount: 3 })).toBe(
      `Сейчас в голосе: 3. ${openRoom}`
    );
  });

  it('falls back to the plain invite for an empty room', () => {
    expect(describeRoomPreview({ isPrivate: false, participantCount: 0 })).toBe(openRoom);
  });
});
