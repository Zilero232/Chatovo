import type { z } from 'zod';
import type { apiErrorCodeSchema, apiErrorSchema } from './codes';

export type ApiErrorCode = z.infer<typeof apiErrorCodeSchema>;
export type ApiError = z.infer<typeof apiErrorSchema>;
