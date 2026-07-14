'use client';

import { useMutation } from '@tanstack/react-query';

import { authClient } from '@/shared/api';

export const useSendVerificationEmail = () => {
  return useMutation({
    mutationFn: async (email: string) => {
      const callbackURL = typeof window === 'undefined' ? '/' : `${window.location.origin}/`;

      const { error } = await authClient.sendVerificationEmail({
        email,
        callbackURL,
      });

      if (error) {
        throw new Error(error.message ?? 'Failed to send verification email');
      }
    },
  });
};
