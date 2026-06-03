import { useMutation } from '@tanstack/react-query';
import { z } from 'zod';
import { authClient } from '@/shared/api';

export const resetPasswordSchema = z
  .object({
    newPassword: z.string().min(8, 'validation.passwordMin'),
    confirmPassword: z.string(),
  })
  .refine((values) => values.newPassword === values.confirmPassword, {
    message: 'validation.passwordsMismatch',
    path: ['confirmPassword'],
  });

export type ResetPasswordValues = z.infer<typeof resetPasswordSchema>;

export const useResetPassword = (token: string) => {
  return useMutation({
    mutationFn: async ({ newPassword }: ResetPasswordValues) => {
      const { error } = await authClient.resetPassword({ newPassword, token });

      if (error) {
        throw new Error(error.message ?? 'Failed to reset password');
      }
    },
  });
};
