import { z } from 'zod';

export const pushPlatformSchema = z.enum(['android', 'ios']);

export const registerPushDeviceInputSchema = z.object({
  token: z.string().min(1).max(4096),
  platform: pushPlatformSchema,
});

export const unregisterPushDeviceInputSchema = z.object({
  token: z.string().min(1).max(4096),
});
