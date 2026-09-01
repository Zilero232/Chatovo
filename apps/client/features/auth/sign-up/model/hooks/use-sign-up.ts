import type { SignUpValues } from '@chatovo/schemas';

import { signUpSchema } from '@chatovo/schemas';
import { useMutation } from '@tanstack/react-query';

import { authClient, unwrapAuth } from '@/shared/api';

export type { SignUpValues };
export { signUpSchema };

export const useSignUp = () =>
  useMutation({
    mutationFn: async ({ email, password, name }: SignUpValues) => {
      const result = await unwrapAuth(
        authClient.signUp.email({ email, password, name }),
        'Sign up failed'
      );

      await authClient.getSession();

      return result;
    }
  });
