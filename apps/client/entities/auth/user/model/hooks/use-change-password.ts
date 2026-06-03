'use client';

import { useMutation } from '@tanstack/react-query';
import { z } from 'zod';
import { authClient } from '@/shared/api';

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, 'validation.required'),
    newPassword: z.string().min(8, 'validation.passwordMin'),
    confirmPassword: z.string(),
  })
  .refine((values) => values.newPassword === values.confirmPassword, {
    message: 'validation.passwordsMismatch',
    path: ['confirmPassword'],
  });

export type ChangePasswordValues = z.infer<typeof changePasswordSchema>;

export const useChangePassword = () => {
  return useMutation({
    mutationFn: async ({ currentPassword, newPassword }: ChangePasswordValues) => {
      const { error } = await authClient.changePassword({
        currentPassword,
        newPassword,
        revokeOtherSessions: true,
      });

      if (error) {
        throw new Error(error.message ?? 'Failed to change password');
      }
    },
  });
};
