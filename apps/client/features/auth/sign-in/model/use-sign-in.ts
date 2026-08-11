import type { SignInValues } from '@chatovo/schemas';

import { signInSchema } from '@chatovo/schemas';
import { useMutation } from '@tanstack/react-query';

import { authClient, unwrapAuth } from '@/shared/api';

export type { SignInValues };
export { signInSchema };

export const useSignIn = () =>
  useMutation({
    mutationFn: (values: SignInValues) =>
      unwrapAuth(authClient.signIn.email(values), 'Sign in failed')
  });
