import { type SignUpValues, signUpSchema } from '@chatovo/schemas';
import { useMutation } from '@tanstack/react-query';

import { authClient } from '@/shared/api';

export type { SignUpValues };
export { signUpSchema };

export const useSignUp = () => {
  return useMutation({
    mutationFn: async ({ email, password, name }: SignUpValues) => {
      const { data, error } = await authClient.signUp.email({ email, password, name });

      if (error) {
        throw new Error(error.message ?? 'Sign up failed');
      }

      return data;
    },
  });
};
