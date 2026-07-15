import { type SignInValues, signInSchema } from '@chatovo/schemas';
import { useMutation } from '@tanstack/react-query';

import { authClient } from '@/shared/api';

export type { SignInValues };
export { signInSchema };

export const useSignIn = () => {
  return useMutation({
    mutationFn: async (values: SignInValues) => {
      const { data, error } = await authClient.signIn.email(values);

      if (error) {
        throw new Error(error.message ?? 'Sign in failed');
      }

      return data;
    },
  });
};
