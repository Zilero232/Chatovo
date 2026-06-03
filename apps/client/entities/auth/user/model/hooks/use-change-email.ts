'use client';

import { useMutation } from '@tanstack/react-query';
import { z } from 'zod';
import { authClient } from '@/shared/api';

export const changeEmailSchema = z.object({
  newEmail: z.email('validation.emailInvalid').trim().toLowerCase(),
});

export type ChangeEmailValues = z.infer<typeof changeEmailSchema>;

export const useChangeEmail = () => {
  return useMutation({
    mutationFn: async ({ newEmail }: ChangeEmailValues) => {
      const { error } = await authClient.changeEmail({
        newEmail,
        callbackURL: '/',
      });

      if (error) {
        throw new Error(error.message ?? 'Failed to change email');
      }
    },
  });
};
