'use client';

import { UserPlus } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { toast } from 'sonner';

import { useSendFriendRequest } from '@/entities/social/friend';
import { Button, Input } from '@/shared/ui';

import s from '../../FriendsDialog.module.scss';

export const AddFriendForm = () => {
  const t = useTranslations('friends');

  const [friendTag, setFriendTag] = useState('');
  const sendRequest = useSendFriendRequest();

  const canSend = friendTag.trim().length > 0 && !sendRequest.isPending;

  const send = () => {
    const tag = friendTag.trim().toLowerCase();

    sendRequest.mutate(
      { tag },
      {
        onSuccess: () => {
          setFriendTag('');
          toast.success(t('requestSent'));
        },
        onError: () => {
          toast.error(t('sendFailed'));
        },
      },
    );
  };

  return (
    <div className={s.searchRow}>
      <Input
        className={s.searchInput}
        placeholder={t('tagPlaceholder')}
        value={friendTag}
        onChange={(event) => setFriendTag(event.target.value)}
      />
      <Button disabled={!canSend} size="sm" onClick={send}>
        <UserPlus aria-hidden />
        {t('sendByTag')}
      </Button>
    </div>
  );
};
