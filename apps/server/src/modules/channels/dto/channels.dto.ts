import {
  categorySchema,
  channelOverwriteSchema,
  channelReadStateSchema,
  channelSchema,
  channelTreeSchema,
  createCategoryInputSchema,
  createChannelInputSchema,
  createThreadInputSchema,
  createThreadTagInputSchema,
  markChannelReadInputSchema,
  putOverwriteInputSchema,
  reorderCategoriesInputSchema,
  reorderChannelsInputSchema,
  threadSchema,
  threadTagSchema,
  updateCategoryInputSchema,
  updateChannelInputSchema,
  updateThreadInputSchema,
  voiceChannelRefSchema
} from '@chatovo/schemas';
import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export class ChannelDto extends createZodDto(channelSchema) {}

export class VoiceChannelRefDto extends createZodDto(voiceChannelRefSchema) {}

export class CategoryDto extends createZodDto(categorySchema) {}

export class ChannelTreeDto extends createZodDto(channelTreeSchema) {}

export class ChannelOverwriteDto extends createZodDto(channelOverwriteSchema) {}

export class ChannelReadStateDto extends createZodDto(channelReadStateSchema) {}

export class ThreadDto extends createZodDto(threadSchema) {}

export class ThreadTagDto extends createZodDto(threadTagSchema) {}

export class CreateChannelDto extends createZodDto(createChannelInputSchema) {}

export class UpdateChannelDto extends createZodDto(updateChannelInputSchema) {}

export class ReorderChannelsDto extends createZodDto(reorderChannelsInputSchema) {}

export class CreateCategoryDto extends createZodDto(createCategoryInputSchema) {}

export class UpdateCategoryDto extends createZodDto(updateCategoryInputSchema) {}

export class ReorderCategoriesDto extends createZodDto(reorderCategoriesInputSchema) {}

export class PutOverwriteDto extends createZodDto(putOverwriteInputSchema) {}

export class CreateThreadDto extends createZodDto(createThreadInputSchema) {}

export class UpdateThreadDto extends createZodDto(updateThreadInputSchema) {}

export class CreateThreadTagDto extends createZodDto(createThreadTagInputSchema) {}

export class MarkChannelReadDto extends createZodDto(markChannelReadInputSchema) {}

export class MuteChannelDto extends createZodDto(
  z.object({ mutedUntil: z.iso.datetime().nullable() })
) {}

export class ReorderResultDto extends createZodDto(
  channelTreeSchema.pick({ categories: true, channels: true })
) {}
