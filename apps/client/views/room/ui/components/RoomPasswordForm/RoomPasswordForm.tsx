'use client';

import type { z } from 'zod';

import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import { useForm } from 'react-hook-form';

import { useRoomToken } from '@/entities/room';
import { Button, Input, Label } from '@/shared/ui';

import type { RoomPasswordFormProps } from './RoomPasswordForm.types';

import { passwordSchema, roomPasswordFormStyles as s } from './RoomPasswordForm.styles';

type PasswordValues = z.infer<typeof passwordSchema>;

export const RoomPasswordForm = ({ displayName, roomId }: RoomPasswordFormProps) => {
  const tokenMutation = useRoomToken();

  const {
    formState: { errors },
    handleSubmit,
    register,
    setError,
  } = useForm<PasswordValues>({
    resolver: zodResolver(passwordSchema),
    defaultValues: { password: '' },
  });

  const onSubmit = handleSubmit(({ password }) => {
    tokenMutation.mutate(
      { roomId, password },
      { onError: (err) => setError('password', { message: err.message }) },
    );
  });

  return (
    <div className={s.root}>
      <form className={s.box} onSubmit={onSubmit}>
        <p className={s.text}>Enter password for "{displayName}"</p>
        <div className={s.field}>
          <Label htmlFor="room-password">Password</Label>
          <Input
            disabled={tokenMutation.isPending}
            id="room-password"
            type="password"
            {...register('password')}
          />
          {errors.password ? <p className={s.error}>{errors.password.message}</p> : null}
        </div>
        <Button disabled={tokenMutation.isPending} type="submit">
          {tokenMutation.isPending ? <Loader2 className={s.spinner} /> : null}
          Join
        </Button>
      </form>
    </div>
  );
};
