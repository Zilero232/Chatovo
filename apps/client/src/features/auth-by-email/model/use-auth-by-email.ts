import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { supabase } from '@/shared/api';

const authSchema = z.object({
  email: z.email('Invalid email'),
  password: z.string().min(6, 'Min 6 characters'),
});

type AuthFormValues = z.infer<typeof authSchema>;

export type AuthMode = 'signin' | 'signup';

export const useAuthByEmail = () => {
  const form = useForm<AuthFormValues>({
    resolver: zodResolver(authSchema),
    defaultValues: { email: '', password: '' },
  });

  const mutation = useMutation({
    mutationFn: async ({ mode, values }: { mode: AuthMode; values: AuthFormValues }) => {
      const { data, error } =
        mode === 'signin'
          ? await supabase.auth.signInWithPassword(values)
          : await supabase.auth.signUp(values);
      if (error) throw error;
      return data;
    },
  });

  return { form, mutation };
};
