'use client';

import type { SendFriendRequestInput } from '@chatovo/schemas';

import { sendFriendRequestInputSchema } from '@chatovo/schemas';
import { zodResolver } from '@hookform/resolvers/zod';
import { UserPlus } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

import { useSendFriendRequest } from '@/entities/social/friend';
import { Button, Input, Spinner } from '@/ui-kit';

import s from '../../FriendsDialog.module.scss';

export const AddFriendForm = () => {
  const t = useTranslations('friends');

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
        onError: () => {
          toast.error(t('sendFailed'), { id: 'friend-request-send-by-tag' });
        }
      }
    );
  });

  return (
    <form className={s.searchRow} onSubmit={send}>
      <Input className={s.searchInput} placeholder={t('tagPlaceholder')} {...register('tag')} />
      <Button
        aria-label={t('sendByTag')}
        className={s.searchButton}
        disabled={!formState.isValid || sendRequest.isPending}
        size='sm'
        type='submit'
      >
        {sendRequest.isPending ? <Spinner decorative /> : <UserPlus aria-hidden />}
        <span className={s.searchButtonLabel}>{t('sendByTag')}</span>
      </Button>
    </form>
  );
};
