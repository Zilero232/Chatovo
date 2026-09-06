import type { z } from 'zod';

import type { realtimeClientMessageSchema } from './client';
import type { realtimeServerMessageSchema } from './server';
import type { soundboardSoundSchema } from './soundboard';

export type RealtimeClientMessage = z.infer<typeof realtimeClientMessageSchema>;
export type RealtimeServerMessage = z.infer<typeof realtimeServerMessageSchema>;
export type SoundboardSound = z.infer<typeof soundboardSoundSchema>;
