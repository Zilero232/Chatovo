import { type ForgotPasswordValues, forgotPasswordSchema } from '@chatovo/schemas';
import { useMutation } from '@tanstack/react-query';
import { authClient } from '@/shared/api';
import { buildAbsoluteUrl, ROUTES } from '@/shared/constants';

export type { ForgotPasswordValues };
export { forgotPasswordSchema };

export const useForgotPassword = () => {
  return useMutation({
    mutationFn: async ({ email }: ForgotPasswordValues) => {
      const { error } = await authClient.requestPasswordReset({
        email,
        redirectTo: buildAbsoluteUrl(ROUTES.resetPassword),
      });

      if (error) {
        throw new Error(error.message ?? 'Failed to send reset email');
      }
    },
  });
};
