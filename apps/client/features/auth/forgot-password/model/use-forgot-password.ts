import { type ForgotPasswordValues, forgotPasswordSchema } from '@chatovo/schemas';
import { useMutation } from '@tanstack/react-query';

import { authClient } from '@/shared/api';
import { ROUTES } from '@/shared/constants';
import { buildPublicAppUrl } from '@/shared/lib/app-url';

export type { ForgotPasswordValues };
export { forgotPasswordSchema };

export const useForgotPassword = () => {
  return useMutation({
    mutationFn: async ({ email }: ForgotPasswordValues) => {
      const { error } = await authClient.requestPasswordReset({
        email,
        redirectTo: buildPublicAppUrl(ROUTES.resetPassword),
      });

      if (error) {
        throw new Error(error.message ?? 'Failed to send reset email');
      }
    },
  });
};
