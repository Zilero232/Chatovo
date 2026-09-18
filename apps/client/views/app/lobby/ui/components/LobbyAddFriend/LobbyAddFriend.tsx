'use client';

import type { SendFriendRequestInput } from '@chatovo/schemas';

import { sendFriendRequestInputSchema } from '@chatovo/schemas';
import { zodResolver } from '@hookform/resolvers/zod';
import { UserPlus } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

import { useToastError } from '@/entities/app/locale';
import { useCurrentUser } from '@/entities/auth/user';
import { FriendTag, useSendFriendRequest } from '@/entities/social/friend';
import { Button, Input, Spinner } from '@/ui-kit';

import s from './LobbyAddFriend.module.scss';

export const LobbyAddFriend = () => {
  const t = useTranslations('friends');
  const toastError = useToastError();

  const { friendTag } = useCurrentUser();
  const sendRequest = useSendFriendRequest();

  const { register, handleSubmit, reset, formState } = useForm<SendFriendRequestInput>({
    resolver: zodResolver(sendFriendRequestInputSchema),
    mode: 'onChange',
    defaultValues: { tag: '' }
  });

  const send = handleSubmit(({ tag }) => {
    sendRequest.mutate(
      { tag: tag.trim().toLowerCase() },
      {
        onSuccess: () => {
          reset();
          toast.success(t('requestSent'), { id: 'friend-request-send-by-tag' });
        },
        onError: toastError('friend-request-send-by-tag')
      }
    );
  });

  return (
    <section className={s.root}>
      <h2 className={s.title}>{t('addTitle')}</h2>
      <p className={s.hint}>{t('addHint')}</p>

      <form className={s.form} onSubmit={send}>
        <Input
          autoComplete='off'
          className={s.input}
          placeholder={t('tagPlaceholder')}
          {...register('tag')}
        />

        <Button
          disabled={!formState.isValid || sendRequest.isPending}
          type='submit'
          variant='primary'
        >
          {sendRequest.isPending ? <Spinner decorative /> : <UserPlus aria-hidden />}
          {t('sendByTag')}
        </Button>
      </form>

      {friendTag && (
        <div className={s.ownTag}>
          <span className={s.ownTagLabel}>{t('yourTagLabel')}</span>
          <FriendTag tag={friendTag} />
        </div>
      )}
    </section>
  );
};
