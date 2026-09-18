import type { Prisma } from '../../../../../generated';
import type {
  categorySelect,
  channelSelect,
  overwriteSelect,
  threadSelect,
  threadTagSelect
} from '../../../../lib';

export type ChannelRow = Prisma.RoomGetPayload<{ select: typeof channelSelect }>;
export type CategoryRow = Prisma.CategoryGetPayload<{ select: typeof categorySelect }>;
export type OverwriteRow = Prisma.ChannelOverwriteGetPayload<{ select: typeof overwriteSelect }>;
export type ThreadRow = Prisma.ThreadGetPayload<{ select: typeof threadSelect }>;
export type ThreadTagRow = Prisma.ThreadTagGetPayload<{ select: typeof threadTagSelect }>;
export type ChannelReadRow = Prisma.ChannelReadGetPayload<{
  select: {
    channelId: true;
    lastReadAt: true;
    mentionCount: true;
    mutedUntil: true;
  };
}>;
