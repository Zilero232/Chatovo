'use client';

import { clsx } from 'clsx';
import { Phone } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { isNullish } from 'remeda';

import { useToastError } from '@/entities/app/locale';
import { useCurrentUser, UserAvatar, UserName } from '@/entities/auth/user';
import { useCallFriend } from '@/entities/social/friend';
import { CenteredState, IconButtonWithTooltip, Spinner } from '@/ui-kit';
import { ChatConversation } from '@/widgets/chat/chat-panel';

import { useDmPage } from '../model/hooks';

import s from './DmPage.module.scss';

export const DmPage = () => {
  const t = useTranslations('friends');
  const toastError = useToastError();

  const { user } = useCurrentUser();
  const { peerId, peer, roomId, isPending } = useDmPage();
  const callFriend = useCallFriend();

  if (isNullish(peerId)) {
    return <CenteredState size='sm' title={t('dmMissing')} />;
  }

  return (
    <div className={s.root}>
      <header className={clsx('surface-bar', s.header)}>
        <span aria-hidden className='accent-top-line' />

        {peer && (
          <>
            <UserAvatar name={peer.name} size='sm' src={peer.avatarUrl} />
            <span className={s.name}>
              <UserName developer={peer.developer} name={peer.name} verified={peer.verified} />
            </span>

            <IconButtonWithTooltip
              className={s.call}
              disabled={callFriend.isPending || isNullish(roomId)}
              icon={<Phone />}
              label={t('callFriend')}
              size='icon-sm'
              variant='ghost'
              onClick={() =>
                callFriend.mutate(
                  { userId: peer.id },
                  { onError: toastError(`friend-call-${peer.id}`) }
                )
              }
            />
          </>
        )}
      </header>

      <div className={s.body}>
        {isPending || isNullish(roomId) ? (
          <div className={s.loading}>
            <Spinner />
          </div>
        ) : (
          <ChatConversation currentUserId={user?.id ?? ''} roomId={roomId} />
        )}
      </div>
    </div>
  );
};
