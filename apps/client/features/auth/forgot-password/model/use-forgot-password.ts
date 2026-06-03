import { useMutation } from '@tanstack/react-query';
import { z } from 'zod';
import { authClient } from '@/shared/api';
import { buildAbsoluteUrl, ROUTES } from '@/shared/constants';

export const forgotPasswordSchema = z.object({
  email: z.email('validation.emailInvalid'),
});

export type ForgotPasswordValues = z.infer<typeof forgotPasswordSchema>;

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
