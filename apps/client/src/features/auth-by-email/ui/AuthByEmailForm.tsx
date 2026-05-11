import { useState } from 'react';
import { toast } from 'sonner';
import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';
import { Label } from '@/shared/ui/label';
import { type AuthMode, useAuthByEmail } from '../model/use-auth-by-email';

export const AuthByEmailForm = () => {
  const [mode, setMode] = useState<AuthMode>('signin');
  const { form, mutation } = useAuthByEmail();
  const { register, handleSubmit, formState } = form;

  const onSubmit = handleSubmit((values) => {
    mutation.mutate(
      { mode, values },
      {
        onSuccess: () => {
          if (mode === 'signup')
            toast.success('Account created. Check email if confirmation is on.');
        },
        onError: (err: Error) => toast.error(err.message),
      },
    );
  });

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input id="email" type="email" autoComplete="email" {...register('email')} />
        {formState.errors.email ? (
          <p className="text-destructive text-sm">{formState.errors.email.message}</p>
        ) : null}
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          type="password"
          autoComplete="current-password"
          {...register('password')}
        />
        {formState.errors.password ? (
          <p className="text-destructive text-sm">{formState.errors.password.message}</p>
        ) : null}
      </div>

      <Button type="submit" className="w-full" disabled={mutation.isPending}>
        {mutation.isPending ? '...' : mode === 'signin' ? 'Sign in' : 'Sign up'}
      </Button>

      <button
        type="button"
        onClick={() => setMode(mode === 'signin' ? 'signup' : 'signin')}
        className="block w-full text-center text-muted-foreground text-sm hover:text-foreground"
      >
        {mode === 'signin' ? 'No account? Sign up' : 'Have account? Sign in'}
      </button>
    </form>
  );
};
