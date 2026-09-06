import { z } from 'zod';

export const SOUNDBOARD_SOUNDS = [
  'siren',
  'airhorn',
  'drumroll',
  'sadTrombone',
  'applause'
] as const;

export const soundboardSoundSchema = z.enum(SOUNDBOARD_SOUNDS);
