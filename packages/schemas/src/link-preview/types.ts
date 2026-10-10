import type { z } from 'zod';

import type { linkPreviewQuerySchema, roomPreviewQuerySchema } from './inputs';
import type {
  linkPreviewImageSchema,
  linkPreviewResponseSchema,
  linkPreviewSchema
} from './outputs';

export type LinkPreviewQuery = z.infer<typeof linkPreviewQuerySchema>;
export type RoomPreviewQuery = z.infer<typeof roomPreviewQuerySchema>;
export type LinkPreviewImage = z.infer<typeof linkPreviewImageSchema>;
export type LinkPreview = z.infer<typeof linkPreviewSchema>;
export type LinkPreviewResponse = z.infer<typeof linkPreviewResponseSchema>;
