import type { ResetPasswordValues } from '@chatovo/schemas';

import { resetPasswordSchema } from '@chatovo/schemas';
import { useMutation } from '@tanstack/react-query';

import { authClient, unwrapAuth } from '@/shared/api';

export type { ResetPasswordValues };
export { resetPasswordSchema };

export const useResetPassword = (token: string) =>
  useMutation({
    mutationFn: ({ newPassword }: ResetPasswordValues) =>
      unwrapAuth(authClient.resetPassword({ newPassword, token }), 'Failed to reset password')
  });
