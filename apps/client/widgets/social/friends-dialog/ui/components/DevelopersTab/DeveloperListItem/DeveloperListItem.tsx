'use client';

import { UserPlus } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { toast } from 'sonner';

import { useErrorMessage } from '@/entities/app/locale';
import { UserAvatar, UserName } from '@/entities/auth/user';
import { FriendTag, useSendFriendRequest } from '@/entities/social/friend';
import { Button } from '@/ui-kit';

import type { DeveloperListItemProps } from './DeveloperListItem.types';

import s from './DeveloperListItem.module.scss';

export const DeveloperListItem = ({ developer, isFriend }: DeveloperListItemProps) => {
  const t = useTranslations('friends');
  const errorMessage = useErrorMessage();

  const sendRequest = useSendFriendRequest();

  const handleAdd = () => {
    sendRequest.mutate(
      { tag: developer.friendTag, relationUserId: developer.id },
      {
        onSuccess: () =>
          toast.success(t('requestSent'), { id: `friend-request-send-${developer.id}` }),
        onError: (err: Error) =>
          toast.error(errorMessage(err), { id: `friend-request-send-${developer.id}` })
      }
    );
  };

  return (
    <div className={s.root}>
      <UserAvatar className={s.avatar} name={developer.name} size='sm' src={developer.avatarUrl} />

      <div className={s.info}>
        <UserName
          className={s.name}
          developer={developer.developer}
          name={developer.name}
          profileUrl={developer.profileUrl}
          verified={developer.verified}
        />
        <FriendTag className={s.tag} tag={developer.friendTag} />
      </div>

      {!isFriend && (
        <Button
          aria-label={t('addFriend')}
          className={s.add}
          disabled={sendRequest.isPending}
          size='icon-sm'
          title={t('addFriend')}
          onClick={handleAdd}
        >
          <UserPlus aria-hidden />
        </Button>
      )}
    </div>
  );
};
