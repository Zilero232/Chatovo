import type { ResetPasswordValues } from '@chatovo/schemas';

import { resetPasswordSchema } from '@chatovo/schemas';
import { useMutation } from '@tanstack/react-query';

import { authClient } from '@/shared/api';

export type { ResetPasswordValues };
export { resetPasswordSchema };

export const useResetPassword = (token: string) =>
  useMutation({
    mutationFn: async ({ newPassword }: ResetPasswordValues) => {
      const { error } = await authClient.resetPassword({ newPassword, token });

      if (error) {
        throw new Error(error.message ?? 'Failed to reset password');
      }
    }
  });
