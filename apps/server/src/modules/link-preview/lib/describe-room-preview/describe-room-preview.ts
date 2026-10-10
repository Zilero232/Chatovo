import type { DescribeRoomPreviewInput } from './describe-room-preview.types';

import { LINK_PREVIEW } from '../../config';

export const describeRoomPreview = ({
  isPrivate,
  participantCount
}: DescribeRoomPreviewInput): string => {
  const { openRoom, privateRoom, liveRoomPrefix } = LINK_PREVIEW.room.copy;

  if (isPrivate) {
    return privateRoom;
  }

  if (participantCount > 0) {
    return `${liveRoomPrefix}: ${participantCount}. ${openRoom}`;
  }

  return openRoom;
};
