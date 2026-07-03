import type { z } from 'zod';
import type {
  pushPlatformSchema,
  registerPushDeviceInputSchema,
  unregisterPushDeviceInputSchema,
} from './inputs';

export type PushPlatform = z.infer<typeof pushPlatformSchema>;
export type RegisterPushDeviceInput = z.infer<typeof registerPushDeviceInputSchema>;
export type UnregisterPushDeviceInput = z.infer<typeof unregisterPushDeviceInputSchema>;
