import type { z } from 'zod';

import type {
  createCategoryInputSchema,
  createChannelInputSchema,
  createThreadInputSchema,
  createThreadTagInputSchema,
  markChannelReadInputSchema,
  putOverwriteInputSchema,
  reorderCategoriesInputSchema,
  reorderChannelsInputSchema,
  updateCategoryInputSchema,
  updateChannelInputSchema,
  updateThreadInputSchema
} from './inputs';
import type {
  categorySchema,
  channelOverwriteSchema,
  channelReadStateSchema,
  channelSchema,
  channelTreeSchema,
  channelTypeSchema,
  overwriteTargetSchema,
  threadSchema,
  threadTagSchema
} from './outputs';

export type Channel = z.infer<typeof channelSchema>;
export type ChannelType = z.infer<typeof channelTypeSchema>;
export type Category = z.infer<typeof categorySchema>;
export type ChannelOverwrite = z.infer<typeof channelOverwriteSchema>;
export type OverwriteTarget = z.infer<typeof overwriteTargetSchema>;
export type ChannelTree = z.infer<typeof channelTreeSchema>;
export type ChannelReadState = z.infer<typeof channelReadStateSchema>;
export type Thread = z.infer<typeof threadSchema>;
export type ThreadTag = z.infer<typeof threadTagSchema>;

export type CreateChannelRequest = z.infer<typeof createChannelInputSchema>;
export type UpdateChannelRequest = z.infer<typeof updateChannelInputSchema>;
export type CreateCategoryRequest = z.infer<typeof createCategoryInputSchema>;
export type UpdateCategoryRequest = z.infer<typeof updateCategoryInputSchema>;
export type ReorderChannelsRequest = z.infer<typeof reorderChannelsInputSchema>;
export type ReorderCategoriesRequest = z.infer<typeof reorderCategoriesInputSchema>;
export type PutOverwriteRequest = z.infer<typeof putOverwriteInputSchema>;
export type CreateThreadRequest = z.infer<typeof createThreadInputSchema>;
export type UpdateThreadRequest = z.infer<typeof updateThreadInputSchema>;
export type CreateThreadTagRequest = z.infer<typeof createThreadTagInputSchema>;
export type MarkChannelReadRequest = z.infer<typeof markChannelReadInputSchema>;
