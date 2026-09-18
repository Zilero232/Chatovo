import type { Category, Channel } from '@chatovo/schemas';

export type ChannelGroup = {
  category: Category | null;
  channels: Channel[];
};
