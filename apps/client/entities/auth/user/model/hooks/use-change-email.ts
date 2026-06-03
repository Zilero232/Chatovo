'use client';

import { type ChangeEmailValues, changeEmailSchema } from '@chatovo/schemas';
import { useMutation } from '@tanstack/react-query';
import { authClient } from '@/shared/api';

export type { ChangeEmailValues };
export { changeEmailSchema };

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
