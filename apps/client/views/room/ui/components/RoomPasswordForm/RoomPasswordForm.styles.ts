import { z } from 'zod';

export const passwordSchema = z.object({
  password: z.string().trim().min(1, 'Password required'),
});

export const roomPasswordFormStyles = {
  root: 'flex h-full items-center justify-center',
  box: 'flex w-full max-w-xs flex-col items-center gap-3',
  text: 'text-muted-foreground text-sm',
  field: 'flex w-full flex-col gap-1.5',
  error: 'text-destructive text-xs',
  spinner: 'mr-2 size-4 animate-spin',
} as const;
