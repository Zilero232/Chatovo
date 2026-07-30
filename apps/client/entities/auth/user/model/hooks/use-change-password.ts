'use client';

import type { ChangePasswordValues } from '@chatovo/schemas';

import { changePasswordSchema } from '@chatovo/schemas';
import { useMutation } from '@tanstack/react-query';

import { authClient } from '@/shared/api';

export type { ChangePasswordValues };
export { changePasswordSchema };

export const useChangePassword = () =>
  useMutation({
    mutationFn: async ({ currentPassword, newPassword }: ChangePasswordValues) => {
      const { error } = await authClient.changePassword({
        currentPassword,
        newPassword,
        revokeOtherSessions: true
      });

      if (error) {
        throw new Error(error.message ?? 'Failed to change password');
      }
    }
  });
